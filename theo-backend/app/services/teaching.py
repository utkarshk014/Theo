# app/services/teaching.py
from typing import Dict, Optional
from sqlalchemy.orm import Session
from app.services.chapter import ChapterService
from app.services.progress import ProgressService
from app.core.prompt_builder import build_teaching_prompt
import google.generativeai as genai
from app.core.config import settings

class TeachingService:
    def __init__(self, db: Session):
        self.db = db
        self.chapter_service = ChapterService(db)
        self.progress_service = ProgressService(db)
        genai.configure(api_key=settings.GEMINI_CONTEXT_API_KEY)
        self.model = genai.GenerativeModel('gemini-pro')

    async def handle_doubt(self, user_id: int, question: str, last_response: Optional[str] = None) -> Dict:
        """Handle student's doubt with context awareness"""
        try:
            # Get current progress with proper structure
            progress_data = self.progress_service.get_user_progress(user_id)
            
            # Get current chapter and subtopic details
            current_chapter = self.chapter_service.get_chapter_with_subtopics(
                chapter_id=progress_data['current_progress']['chapter_id']
            )
            
            current_subtopic = self.chapter_service.get_subtopic_details(
                subtopic_id=progress_data['current_progress']['subtopic_id']
            )
            
            # Get full syllabus for context
            full_syllabus = self.chapter_service.get_all_chapters_with_subtopics()

            # Build context-aware prompt
            prompt = build_teaching_prompt(
                current_chapter=current_chapter,
                current_subtopic=current_subtopic,
                student_question=question,
                full_syllabus=full_syllabus,
                last_response=last_response
            )

            # Get response from Gemini
            response = await self._get_gemini_response(prompt)

            return {
                "response": response,
                "context": {
                    "current_chapter": current_chapter['title'],
                    "current_subtopic": current_subtopic['title']
                }
            }

        except Exception as e:
            print(f"Detailed error in handle_doubt: {str(e)}")
            raise Exception(f"Error handling doubt: {str(e)}")

    async def _get_gemini_response(self, prompt: str) -> str:
        """Get response from Gemini API"""
        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            print(f"Error getting Gemini response: {str(e)}")
            raise Exception("Failed to get response from AI")