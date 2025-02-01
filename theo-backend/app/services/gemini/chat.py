# import json
# import google.generativeai as genai
# from typing import List, Dict, Optional
# from app.core.config import settings

# class ChatGeminiService:
#    def __init__(self):
#        self.chat_model = genai.GenerativeModel('gemini-pro')
#        self.context_model = genai.GenerativeModel('gemini-pro')
   
#    def get_response(self, content: str, context_summary: Optional[List[Dict]] = None) -> str:
#        try:
#            genai.configure(api_key=settings.GEMINI_CHAT_API_KEY)
#            prompt = self._build_chat_prompt(content, context_summary)
#            response = self.chat_model.generate_content(prompt)
#            return response.text
#        except Exception as e:
#            raise Exception(f"Chat error: {str(e)}")
    
#     def build_prompt_for_chat(self, content: str, context_summary: Optional[List[Dict]] = None) -> str:
#         """Build a complete prompt for chat interactions"""
        
#         # Start with Theo's personality
#         prompt = f"""{THEO_PERSONALITY}

#         IMPORTANT RULE:
#         If the question is NOT related to finance, stocks, mutual funds, or investments, respond ONLY with:
#         "I understand your curiosity! However, I'm specialized in teaching finance and investments. Let's focus on those topics where I can help you grow as an investor. What would you like to know about the financial markets?"
#         """

#         # Add previous context if available
#         if context_summary:
#             context_section = "\nPrevious Topics Discussed:"
#             for item in context_summary:
#                 context_section += f"\n- {item['topic']}: {item['whatDidWeTalk']}"
#                 prompt += f"\n{context_section}"

#         # Add current question
#         prompt += f"\n\nCurrent Question: \"{content}\""
        
#         return prompt

#    def generate_context(self, message: str, response: str, old_context: Optional[List[Dict]] = None) -> List[Dict]:
#        try:
#            genai.configure(api_key=settings.GEMINI_CONTEXT_API_KEY)
#            prompt = self._build_context_prompt(message, response, old_context)
#            context_response = self.context_model.generate_content(prompt)
#            cleaned_response = self._clean_json_response(context_response.text)
#            return json.loads(cleaned_response)
#        except Exception as e:
#            print(f"Context generation error: {str(e)}")
#            return old_context or []

#    def _build_chat_prompt(self, content: str, context_summary: Optional[List[Dict]]) -> str:
#        if not context_summary:
#            return content
           
#        context_text = "\n".join([
#            f"Topic: {item['topic']}\n{item['whatDidWeTalk']}" 
#            for item in context_summary
#        ])
#        return f"Previous Context:\n{context_text}\n\nUser: {content}"

#    def _build_context_prompt(self, message: str, response: str, old_context: Optional[List[Dict]]) -> str:
#         if old_context:
#             return f"""Previous context: {old_context}

#         Current exchange:
#         User: {message}
#         Assistant: {response}

#         Rules for context update:
#         1. DO NOT remove any existing topics
#         2. If new conversation relates to existing topic, ADD the new information to that topic's whatDidWeTalk
#         3. Only create new topic if conversation introduces completely new subject
#         4. Keep format: [{{"topic": "2-3 words", "whatDidWeTalk": "continuous summary of ALL relevant discussions"}}]

#         Return complete updated JSON."""

#         return f"""Analyze conversation:
#             User: {message}
#             Assistant: {response}

#             Create initial context in JSON:
#             [{{"topic": "2-3 words", "whatDidWeTalk": "summary of discussion"}}]"""

#    def _clean_json_response(self, text: str) -> str:
#        return text.replace("```json", "").replace("```", "").strip()


import json
import google.generativeai as genai
from typing import List, Dict, Optional
from app.core.config import settings
from app.core.theo import THEO_PERSONALITY

class ChatGeminiService:
   def __init__(self):
       self.chat_model = genai.GenerativeModel('gemini-pro')
       self.context_model = genai.GenerativeModel('gemini-pro')
   
   async def get_response(self, content: str, context_summary: Optional[List[Dict]] = None) -> str:
       try:
           genai.configure(api_key=settings.GEMINI_CHAT_API_KEY)
           prompt = self.build_prompt_for_chat(content, context_summary)
           response = self.chat_model.generate_content(prompt)
           return response.text
       except Exception as e:
           raise Exception(f"Chat error: {str(e)}")

   def build_prompt_for_chat(self, content: str, context_summary: Optional[List[Dict]] = None) -> str:
       """Build a complete prompt for chat interactions"""
       
       # Start with Theo's personality
       prompt = f"""{THEO_PERSONALITY}

IMPORTANT RULE:
If the question is NOT related to finance, stocks, mutual funds, or investments, respond ONLY with:
"I understand your curiosity! However, I'm specialized in teaching finance and investments. Let's focus on those topics where I can help you grow as an investor. What would you like to know about the financial markets?"
"""

       # Add previous context if available
       if context_summary:
           context_section = "\nPrevious Topics Discussed:"
           for item in context_summary:
               context_section += f"\n- {item['topic']}: {item['whatDidWeTalk']}"
           prompt += f"\n{context_section}"

       # Add current question
       prompt += f"\n\nCurrent Question: \"{content}\""
       
       return prompt

   async def generate_context(self, message: str, response: str, old_context: Optional[List[Dict]] = None) -> List[Dict]:
       try:
           genai.configure(api_key=settings.GEMINI_CONTEXT_API_KEY)
           prompt = self._build_context_prompt(message, response, old_context)
           context_response = self.context_model.generate_content(prompt)
           cleaned_response = self._clean_json_response(context_response.text)
           return json.loads(cleaned_response)
       except Exception as e:
           print(f"Context generation error: {str(e)}")
           return old_context or []

   def _build_chat_prompt(self, content: str, context_summary: Optional[List[Dict]]) -> str:
       if not context_summary:
           return content
           
       context_text = "\n".join([
           f"Topic: {item['topic']}\n{item['whatDidWeTalk']}" 
           for item in context_summary
       ])
       return f"Previous Context:\n{context_text}\n\nUser: {content}"

   def _build_context_prompt(self, message: str, response: str, old_context: Optional[List[Dict]]) -> str:
       if old_context:
           return f"""Previous context: {old_context}

Current exchange:
User: {message}
Assistant: {response}

Rules for context update:
1. DO NOT remove any existing topics
2. If new conversation relates to existing topic, ADD the new information to that topic's whatDidWeTalk
3. Only create new topic if conversation introduces completely new subject
4. Keep format: [{{"topic": "2-3 words", "whatDidWeTalk": "continuous summary of ALL relevant discussions"}}]

Return complete updated JSON."""

       return f"""Analyze conversation:
User: {message}
Assistant: {response}

Create initial context in JSON:
[{{"topic": "2-3 words", "whatDidWeTalk": "summary of discussion"}}]"""

   def _clean_json_response(self, text: str) -> str:
       return text.replace("```json", "").replace("```", "").strip()