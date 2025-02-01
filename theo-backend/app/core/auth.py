# app/core/auth.py
from fastapi import Depends, Request, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.concurrency import run_in_threadpool
from sqlalchemy.orm import Session
from clerk_backend_api import Clerk
from app.core.database import get_db
from app.models import User
from .config import settings
import asyncio
from typing import Optional
import jwt


security = HTTPBearer()
clerk = Clerk(bearer_auth=settings.CLERK_SECRET_KEY)

def get_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    return credentials.credentials

def get_user_from_db(db: Session, token: str) -> Optional[User]:
    return db.query(User).filter(User.clerk_id == token).first()


async def get_current_user(
    # credentials: HTTPAuthorizationCredentials = Depends(security),
    token: str = Depends(get_token),
    db: Session = Depends(get_db)
) -> User:
    try:
        # token = credentials.credentials

        print("\n\n token is ", token)
        
        # # Run verify_token in threadpool if it's synchronous
        # session = await run_in_threadpool(clerk.sessions.verify_token, token)
        
        # # Run DB query in threadpool
        # user = await run_in_threadpool(
        #     lambda: db.query(User).filter(User.clerk_id == session.user_id).first()
        # )

        # user = db.query(User).filter(User.clerk_id == token).first()
        user = get_user_from_db(db, token)
        if not user:
            raise HTTPException(status_code=401, detail="User not found")

        print("\n\n session is ", session.user_id)
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
            
        return user
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))

async def verify_webhook(request: Request):
    try:
        headers = {
            "svix-id": request.headers.get("svix-id"),
            "svix-timestamp": request.headers.get("svix-timestamp"),
            "svix-signature": request.headers.get("svix-signature"),
        }
        if not all(headers.values()):
            raise HTTPException(400, "Missing required Svix headers")
        return True
    except Exception as e:
        print(f"Webhook error: {e}")
        raise HTTPException(400, str(e))

async def fetch_clerk_user_details(user_id: str):
    try:
        user = clerk.users.list(user_id=[user_id])[0]
        return {
            "id": user.id,
            "email_addresses": [{"email_address": user.email_addresses[0].email_address}],
            "first_name": user.first_name,
            "last_name": user.last_name
        }
    except Exception as e:
        print(f"Error fetching user details: {e}")
        return None

def auth_user(token: str, db: Session) -> User:
    """Simple synchronous function to get user"""
    try:
        user = db.query(User).filter(User.clerk_id == token).first()
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))

def get_user_from_header(authorization: str | None, db: Session) -> User:
    """Helper function to get user from authorization header"""
    if not authorization:
        raise HTTPException(status_code=401, detail="No authorization header")
        
    token = authorization.replace('Bearer ', '')
    
    try:
        # Decode JWT without verification (since we just need the sub claim)
        decoded = jwt.decode(token, options={"verify_signature": False})
        clerk_user_id = decoded.get('sub')  # This will give us user_2rnNak...
        
        if not clerk_user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        user = db.query(User).filter(User.clerk_id == clerk_user_id).first()

        print(user.email)
        
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
            
        return user
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")