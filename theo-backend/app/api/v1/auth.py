# app/api/v1/auth.py
from fastapi import APIRouter, Request, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.auth import verify_webhook, fetch_clerk_user_details
from app.models import User, UserLevel

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])

@router.post("/webhook")
async def clerk_webhook(request: Request, db: Session = Depends(get_db)):
    try:
        await verify_webhook(request)
        payload = await request.json()
        # print("Webhook payload:", payload)
        event_type = payload.get("type")
        data = payload.get("data", {})

        if event_type == "user.created":
            # Create user in our DB
            user = User(
                clerk_id=data["id"],
                email=data["email_addresses"][0]["email_address"],
                first_name=data.get("first_name"),
                last_name=data.get("last_name"),
                level=UserLevel.BEGINNER,
                completed_onboarding=False
            )
            db.add(user)
            db.commit()
            return {"status": "user created"}

        elif event_type == "session.created":
            # Check if user exists, if not create the user
            user_id = data.get("user_id")
            if user_id:
                # Check if user already exists
                existing_user = db.query(User).filter(User.clerk_id == user_id).first()
                
                if not existing_user:
                    # Fetch user details from Clerk (you'll need to implement this method)
                    user_details = await fetch_clerk_user_details(user_id)
                    
                    if user_details:
                        user = User(
                            clerk_id=user_id,
                            email=user_details["email_addresses"][0]["email_address"],
                            first_name=user_details.get("first_name"),
                            last_name=user_details.get("last_name"),
                            level=UserLevel.BEGINNER,
                            completed_onboarding=True
                        )
                        db.add(user)
                        db.commit()
                        return {"status": "user created from session"}
                
                return {"status": "existing user session"}

        elif event_type == "user.updated":
            user = db.query(User).filter(User.clerk_id == data["id"]).first()
            if user:
                user.email = data["email_addresses"][0]["email_address"]
                user.first_name = data.get("first_name")
                user.last_name = data.get("last_name")
                db.commit()
            return {"status": "user updated"}

        return {"status": "event ignored"}
    except Exception as e:
        print(f"error with webhook: {e}")
        raise HTTPException(status_code=400, detail=str(e))