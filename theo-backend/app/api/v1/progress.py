# app/api/v1/progress.py
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from typing import Dict
from pydantic import BaseModel
from app.core.database import get_db
from app.core.auth import get_user_from_header
from app.services.progress import ProgressService

router = APIRouter(prefix="/api/v1/progress", tags=["progress"])

class UpdateProgressRequest(BaseModel):
    chapter_id: int
    subtopic_id: int

@router.get("")
async def get_progress(
    db: Session = Depends(get_db),
    authorization: str = Header(None)
):
    """Get current user's learning progress"""
    try:
        user = get_user_from_header(authorization, db)
        progress_service = ProgressService(db)
        return progress_service.get_user_progress(user.id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/update")
async def update_progress(
    request: UpdateProgressRequest,
    db: Session = Depends(get_db),
    authorization: str = Header(None)
):
    """Manually update user's current chapter and subtopic"""
    try:
        user = get_user_from_header(authorization, db)
        progress_service = ProgressService(db)
        return progress_service.update_progress(
            user_id=user.id,
            chapter_id=request.chapter_id,
            subtopic_id=request.subtopic_id
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/next")
async def move_to_next(
    db: Session = Depends(get_db),
    authorization: str = Header(None)
):
    """Move user to next subtopic or chapter"""
    try:
        user = get_user_from_header(authorization, db)
        progress_service = ProgressService(db)
        result = progress_service.move_to_next_subtopic(user.id)
        return result
    except Exception as e:
        print(f"Error in move_to_next: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))