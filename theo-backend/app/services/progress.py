# app/services/progress.py
from typing import Optional, Dict
from sqlalchemy.orm import Session
from app.models.user_progress import UserProgress
from app.models.chapter import Chapter, Subtopic

class ProgressService:
    def __init__(self, db: Session):
        self.db = db
    
    def get_user_progress(self, user_id: int) -> Dict:
        """Get user's current progress and completion status"""
        progress = self.db.query(UserProgress).filter(
            UserProgress.user_id == user_id
        ).first()
        
        if not progress:
            # Initialize with first chapter and subtopic
            progress = self._initialize_progress(user_id)
            
        current_chapter = self.db.query(Chapter).filter(
            Chapter.id == progress.current_chapter_id
        ).first()
        
        current_subtopic = self.db.query(Subtopic).filter(
            Subtopic.id == progress.current_subtopic_id
        ).first()
        
        # Calculate completion status
        completed_subtopics = []
        completed_chapters = []
        
        for chapter in self.db.query(Chapter).order_by(Chapter.order.asc()).all():
            if chapter.order < current_chapter.order:
                completed_chapters.append(chapter.id)
                # All subtopics in previous chapters are completed
                completed_subtopics.extend([st.id for st in chapter.subtopics])
            elif chapter.id == current_chapter.id:
                # For current chapter, only include subtopics before current one
                for subtopic in chapter.subtopics:
                    if subtopic.order < current_subtopic.order:
                        completed_subtopics.append(subtopic.id)
        
        return {
            "current_progress": {
                "chapter_id": current_chapter.id,
                "chapter_title": current_chapter.title,
                "chapter_order": current_chapter.order,
                "subtopic_id": current_subtopic.id,
                "subtopic_title": current_subtopic.title,
                "subtopic_order": current_subtopic.order
            },
            "completion_status": {
                "completed_chapters": completed_chapters,
                "completed_subtopics": completed_subtopics,
                "total_chapters": 2,  # Since we have 2 fixed chapters
                "total_subtopics": 10  # 5 subtopics per chapter
            }
        }
    
    def update_progress(self, user_id: int, chapter_id: int, subtopic_id: int) -> Dict:
        """Update user's current position in learning journey"""
        progress = self.db.query(UserProgress).filter(
            UserProgress.user_id == user_id
        ).first()
        
        if not progress:
            progress = UserProgress(user_id=user_id)
            self.db.add(progress)
        
        progress.current_chapter_id = chapter_id
        progress.current_subtopic_id = subtopic_id
        self.db.commit()
        
        return self.get_user_progress(user_id)
    
    def _initialize_progress(self, user_id: int) -> UserProgress:
        """Initialize progress with first chapter and subtopic"""
        first_chapter = self.db.query(Chapter).order_by(Chapter.order.asc()).first()
        first_subtopic = self.db.query(Subtopic).filter(
            Subtopic.chapter_id == first_chapter.id
        ).order_by(Subtopic.order.asc()).first()
        
        progress = UserProgress(
            user_id=user_id,
            current_chapter_id=first_chapter.id,
            current_subtopic_id=first_subtopic.id
        )
        self.db.add(progress)
        self.db.commit()
        
        return progress

    def move_to_next_subtopic(self, user_id: int) -> Dict:
        """Move user to next subtopic or chapter"""
        progress = self.db.query(UserProgress).filter(
            UserProgress.user_id == user_id
        ).first()
        
        if not progress:
            return self.get_user_progress(user_id)
            
        current_subtopic = self.db.query(Subtopic).filter(
            Subtopic.id == progress.current_subtopic_id
        ).first()
        
        # Try to get next subtopic in current chapter
        next_subtopic = self.db.query(Subtopic).filter(
            Subtopic.chapter_id == current_subtopic.chapter_id,
            Subtopic.order > current_subtopic.order
        ).order_by(Subtopic.order.asc()).first()

        print(next_subtopic)
        
        if next_subtopic:
            return self.update_progress(user_id, current_subtopic.chapter_id, next_subtopic.id)
            
        # If no next subtopic, move to next chapter
        next_chapter = self.db.query(Chapter).filter(
            Chapter.order > current_subtopic.chapter.order
        ).order_by(Chapter.order.asc()).first()

        print(next_chapter)
        
        if next_chapter:
            first_subtopic_next_chapter = self.db.query(Subtopic).filter(
                Subtopic.chapter_id == next_chapter.id
            ).order_by(Subtopic.order.asc()).first()
            
            return self.update_progress(user_id, next_chapter.id, first_subtopic_next_chapter.id)
            
        # If no next chapter, user has completed all content
        return self.get_user_progress(user_id)

    # def move_to_next_subtopic(self, user_id: int) -> Dict:
    #     """Move user to next subtopic or chapter"""
    #     try:
    #         # Get current progress
    #         progress = self.db.query(UserProgress).filter(
    #             UserProgress.user_id == user_id
    #         ).first()
            
    #         if not progress:
    #             return self.get_user_progress(user_id)
                
    #         # Get current subtopic
    #         current_subtopic = self.db.query(Subtopic).filter(
    #             Subtopic.id == progress.current_subtopic_id
    #         ).first()
            
    #         if not current_subtopic:
    #             return self.get_user_progress(user_id)
            
    #         # Add current subtopic to completed if not already there
    #         if current_subtopic.id not in progress.completed_subtopics:
    #             if progress.completed_subtopics is None:
    #                 progress.completed_subtopics = []
    #             progress.completed_subtopics.append(current_subtopic.id)
            
    #         # Find next subtopic in current chapter
    #         next_subtopic = self.db.query(Subtopic).filter(
    #             Subtopic.chapter_id == current_subtopic.chapter_id,
    #             Subtopic.order > current_subtopic.order
    #         ).order_by(Subtopic.order.asc()).first()
            
    #         if next_subtopic:
    #             self.db.commit()
    #             return self.update_progress(user_id, current_subtopic.chapter_id, next_subtopic.id)
                
    #         # If we're here, we've completed the current chapter
    #         if current_subtopic.chapter_id not in progress.completed_chapters:
    #             if progress.completed_chapters is None:
    #                 progress.completed_chapters = []
    #             progress.completed_chapters.append(current_subtopic.chapter_id)
            
    #         # Try to find next chapter
    #         next_chapter = self.db.query(Chapter).filter(
    #             Chapter.order > current_subtopic.chapter.order
    #         ).order_by(Chapter.order.asc()).first()
            
    #         if next_chapter:
    #             first_subtopic_next_chapter = self.db.query(Subtopic).filter(
    #                 Subtopic.chapter_id == next_chapter.id
    #             ).order_by(Subtopic.order.asc()).first()
                
    #             if first_subtopic_next_chapter:
    #                 self.db.commit()
    #                 return self.update_progress(user_id, next_chapter.id, first_subtopic_next_chapter.id)
            
    #         # We're at the very end - commit changes and return current progress
    #         self.db.commit()
    #         return self.get_user_progress(user_id)

    #     except Exception as e:
    #         self.db.rollback()
    #         print(f"Error in move_to_next_subtopic: {str(e)}")
    #         raise e