# app/api/v1/chapters.py
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from app.core.database import get_db
from app.core.auth import get_user_from_header
from app.services.chapter import ChapterService

router = APIRouter(prefix="/api/v1/chapters", tags=["chapters"])

# Pydantic models for request/response validation
class SubtopicResponse(BaseModel):
    id: int
    title: str
    order: int
    content: str

class ChapterResponse(BaseModel):
    id: int
    title: str
    description: str
    order: int
    subtopics: List[SubtopicResponse]
    progress: float = 0

@router.get("")
async def get_chapters(
    db: Session = Depends(get_db),
    authorization: str = Header(None)
):
    """Get all chapters with their subtopics"""
    try:
        user = get_user_from_header(authorization, db)
        chapter_service = ChapterService(db)
        chapters = chapter_service.get_all_chapters_with_subtopics()
        return chapters
    except Exception as e:
        print(f"Error in get_chapters: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{chapter_id}")
async def get_chapter(
    chapter_id: int,
    db: Session = Depends(get_db),
    authorization: str = Header(None)
):
    """Get specific chapter details"""
    try:
        user = get_user_from_header(authorization, db)
        chapter_service = ChapterService(db)
        chapter = chapter_service.get_chapter_with_subtopics(chapter_id)
        
        if not chapter:
            raise HTTPException(status_code=404, detail="Chapter not found")
            
        return chapter
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))