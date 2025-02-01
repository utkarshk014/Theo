from .base import BaseGeminiService
from app.core.config import settings
from typing import List, Dict
from app.models.conversation import Message
import json

class ContextGeminiService(BaseGeminiService):
    def __init__(self):
        super().__init__(settings.GEMINI_CONTEXT_API_KEY)
    
    async def generate_summary(self, messages: List[Message]) -> List[Dict]:
        """Generate context summary in specified format"""
        try:
            # Format messages for summary generation
            messages_text = "\n".join([
                f"{msg.role}: {msg.content}" 
                for msg in messages
            ])
            
            # Create prompt for summarization
            prompt = """
            Analyze this conversation and create a summary that captures the main topics and key points discussed.
            Return ONLY a JSON array in this exact format:
            [
                {
                    "topic": "topic name",
                    "whatDidWeTalk": "brief summary of discussion"
                }
            ]
            
            Rules:
            1. Topic should be 2-3 words maximum
            2. WhatDidWeTalk should be a brief phrase, not more than 10 words
            3. Create a new topic entry for each distinct topic discussed
            4. Focus only on stock market and investment related topics
            5. Return valid JSON that can be parsed
            
            Conversation to analyze:
            {messages_text}
            """
            
            # Get response from Gemini
            response = await self.model.generate_content(prompt)
            
            # Parse response into JSON
            # Note: We might need to clean the response text to ensure it's valid JSON
            cleaned_response = self._clean_response_text(response.text)
            summary = json.loads(cleaned_response)
            
            return summary
            
        except Exception as e:
            print(f"Error generating summary: {str(e)}")
            # Return empty summary in case of error
            return []
    
    def _clean_response_text(self, text: str) -> str:
        """Clean response text to ensure valid JSON"""
        # Remove any markdown code block indicators
        text = text.replace("```json", "").replace("```", "")
        # Remove any leading/trailing whitespace
        text = text.strip()
        return text