# app/api/v1/teaching.py
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from typing import Dict, Optional
from pydantic import BaseModel
from app.core.database import get_db
from app.core.auth import get_user_from_header
from app.services.teaching import TeachingService

router = APIRouter(prefix="/api/v1/teaching", tags=["teaching"])

class DoubtRequest(BaseModel):
    question: str
    last_response: Optional[str] = None

@router.post("/doubt", response_model=Dict)
async def ask_doubt(
    request: DoubtRequest,
    db: Session = Depends(get_db),
    authorization: str = Header(None)
):
    """Handle student's doubt about current or previous topics"""
    try:
        user = get_user_from_header(authorization, db)
        teaching_service = TeachingService(db)
        
        return await teaching_service.handle_doubt(
            user_id=user.id,
            question=request.question
        )
        
    except Exception as e:
        print(f"Error in ask_doubt: {str(e)}")  # Add logging
        raise HTTPException(status_code=400, detail=str(e))