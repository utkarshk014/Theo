from typing import List, Optional, Dict
from sqlalchemy.orm import Session
from app.models.chapter import Chapter, Subtopic

class ChapterService:
    def __init__(self, db: Session):
        self.db = db

    def get_all_chapters_with_subtopics(self) -> List[Dict]:
        """Get all chapters with their subtopics in order"""
        try:
            chapters = self.db.query(Chapter).order_by(Chapter.order.asc()).all()
            print(f"Found {len(chapters)} chapters")  # Add logging
        
            return [
                {
                    "id": chapter.id,
                    "title": chapter.title,
                    "description": chapter.description,
                    "order": chapter.order,
                    "subtopics": [
                        {
                            "id": subtopic.id,
                            "title": subtopic.title,
                            "order": subtopic.order,
                            "content": subtopic.content
                        }
                        for subtopic in sorted(chapter.subtopics, key=lambda x: x.order)
                    ],
                    "progress": 0
                }
                for chapter in chapters
            ]
        except Exception as e:
            print(f"Error in get_all_chapters_with_subtopics: {str(e)}")  # Add logging
            raise e

    def get_chapter_with_subtopics(self, chapter_id: int) -> Optional[Dict]:
        """Get a specific chapter with all its subtopics"""
        chapter = self.db.query(Chapter).filter(Chapter.id == chapter_id).first()
        
        if not chapter:
            return None
            
        subtopics = self.db.query(Subtopic)\
            .filter(Subtopic.chapter_id == chapter_id)\
            .order_by(Subtopic.order.asc())\
            .all()
            
        return {
            "id": chapter.id,
            "title": chapter.title,
            "description": chapter.description,
            "order": chapter.order,
            "subtopics": [
                {
                    "id": subtopic.id,
                    "title": subtopic.title,
                    "order": subtopic.order,
                    "content": subtopic.content 
                }
                for subtopic in subtopics
            ],
            "progress": 0  # Placeholder for progress tracking
        }

    def get_subtopic_details(self, subtopic_id: int) -> Optional[Dict]:
        """Get detailed information about a specific subtopic"""
        subtopic = self.db.query(Subtopic).filter(Subtopic.id == subtopic_id).first()
        
        if not subtopic:
            return None
            
        return {
            "id": subtopic.id,
            "title": subtopic.title,
            "content": subtopic.content,
            "order": subtopic.order,
            "chapter_id": subtopic.chapter_id
        }

    def get_next_subtopic(self, current_subtopic_id: int) -> Optional[Dict]:
        """Get the next subtopic in the learning sequence"""
        current_subtopic = self.db.query(Subtopic).filter(Subtopic.id == current_subtopic_id).first()
        
        if not current_subtopic:
            return None
            
        # Try to get next subtopic in same chapter
        next_subtopic = self.db.query(Subtopic).filter(
            Subtopic.chapter_id == current_subtopic.chapter_id,
            Subtopic.order > current_subtopic.order
        ).order_by(Subtopic.order.asc()).first()
        
        if next_subtopic:
            return self.get_subtopic_details(next_subtopic.id)
            
        # If no next subtopic in current chapter, get first subtopic of next chapter
        next_chapter = self.db.query(Chapter).filter(
            Chapter.order > current_subtopic.chapter.order
        ).order_by(Chapter.order.asc()).first()
        
        if next_chapter:
            first_subtopic_next_chapter = self.db.query(Subtopic).filter(
                Subtopic.chapter_id == next_chapter.id
            ).order_by(Subtopic.order.asc()).first()
            
            if first_subtopic_next_chapter:
                return self.get_subtopic_details(first_subtopic_next_chapter.id)
                
        return None