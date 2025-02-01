from typing import Optional, Dict, List
from sqlalchemy.orm import Session
from app.models.conversation import Conversation, Message
from app.services.gemini.chat import ChatGeminiService
from app.core.config import settings
from app.services.token_counter import TokenCounter

class ConversationService:
   def __init__(self, db: Session):
       self.db = db
       self.chat_service = ChatGeminiService()
       self.token_counter = TokenCounter()

   async def handle_message(self, user_id: int, content: str, conversation_id: Optional[int] = None) -> Dict:
       try:
           conversation = await self._get_or_create_conversation(user_id, conversation_id)
           user_tokens = self.token_counter.count_tokens(content)
           
           if conversation.total_tokens + user_tokens >= settings.MAX_TOKENS:
               conversation.is_complete = True
               self.db.commit()
               raise Exception("Token limit reached")

           response = await self.chat_service.get_response(content, conversation.context_summary)
           ai_tokens = self.token_counter.count_tokens(response)
           
           message = await self._create_message(
               conversation=conversation,
               user_question=content, 
               ai_response=response,
               user_tokens=user_tokens,
               ai_tokens=ai_tokens
           )

           updated_context = await self.chat_service.generate_context(
               message=content,
               response=response, 
               old_context=conversation.context_summary
           )

           conversation.context_summary = updated_context
           conversation.total_tokens += (user_tokens + ai_tokens)
           conversation.message_count += 1
           self.db.commit()

           return {
               "conversation_id": conversation.id,
               "messages": [{
                   "user": message.user_question,
                   "ai": message.ai_response,
                   "userTokens": message.user_tokens,
                   "aiTokens": message.ai_tokens,
                   "createdAt": message.created_at.isoformat()
               }],
               "total_tokens": conversation.total_tokens,
               "is_complete": conversation.is_complete,
               "has_context_summary": bool(conversation.context_summary),
               "status": "message created" 
           }
       except Exception as e:
           self.db.rollback()
           raise e

   async def _get_or_create_conversation(self, user_id: int, conversation_id: Optional[int] = None) -> Conversation:
       try:
           if conversation_id:
               conversation = self.db.query(Conversation).filter(
                   Conversation.id == conversation_id,
                   Conversation.user_id == user_id
               ).first()
               if not conversation:
                   raise Exception("Conversation not found")
               return conversation
           
           conversation = Conversation(user_id=user_id)
           self.db.add(conversation)
           self.db.flush()
           return conversation
       except Exception as e:
           self.db.rollback()
           raise e

   async def _create_message(self, conversation: Conversation, user_question: str, ai_response: str, 
                           user_tokens: int, ai_tokens: int) -> Message:
       try:
           message = Message(
               conversation_id=conversation.id,
               user_question=user_question,
               ai_response=ai_response,
               user_tokens=user_tokens,
               ai_tokens=ai_tokens
           )
           self.db.add(message)
           self.db.flush()
           return message
       except Exception as e:
           self.db.rollback()
           raise e

   async def get_conversation(self, user_id: int, conversation_id: int) -> Optional[Dict]:
       try:
           conversation = self.db.query(Conversation).filter(
               Conversation.id == conversation_id,
               Conversation.user_id == user_id
           ).first()
       
           if not conversation:
               return {
                "conversation_id": conversation_id,
                "title": "",
                "messages": [],
                "total_tokens": 0,
                "is_complete": False,
                "has_context_summary": False,
                "status": "no records"
                }
           
           messages = self.db.query(Message).filter(
               Message.conversation_id == conversation_id
           ).order_by(Message.created_at).all()
       
           return {
               "conversation_id": conversation.id,
               "title": conversation.title,
               "messages": [{
                   "user": msg.user_question,
                   "ai": msg.ai_response,
                   "userTokens": msg.user_tokens,
                   "aiTokens": msg.ai_tokens,
                   "createdAt": msg.created_at.isoformat()
               } for msg in messages],
               "total_tokens": conversation.total_tokens,
               "is_complete": conversation.is_complete,
               "has_context_summary": bool(conversation.context_summary),
               "status": "records present"
           }
       except Exception as e:
           raise e

   async def get_user_conversations(self, user_id: int) -> List[Dict]:
       conversations = self.db.query(Conversation).filter(
           Conversation.user_id == user_id
       ).order_by(Conversation.updated_at.desc()).all()
   
       return [{
           "id": conv.id,
           "total_tokens": conv.total_tokens,
           "title": conv.title,
           "message_count": conv.message_count,
           "is_complete": conv.is_complete,
           "is_generating_summary": conv.is_summary_generating,
           "has_context_summary": bool(conv.context_summary)
       } for conv in conversations]

   async def create_new_conversation(self, user_id: int) -> Dict:
       try:
           conversation = Conversation(
               user_id=user_id,
               total_tokens=0,
               message_count=0,
               is_summary_generating=False,
               is_complete=False
           )
           self.db.add(conversation)
           self.db.commit()
           
           return {
               "conversation_id": conversation.id,
               "messages": [],
               "total_tokens": 0,
               "is_complete": False,
               "is_generating_summary": False,
               "has_context_summary": False,
               "status": "message created" 
           }
       except Exception as e:
           self.db.rollback()
           raise e

   async def update_conversation_title(self, user_id: int, conversation_id: int, title: str) -> Dict:
       try:
           conversation = self.db.query(Conversation).filter(
               Conversation.id == conversation_id,
               Conversation.user_id == user_id
           ).first()
           
           if not conversation:
               raise Exception("Conversation not found")
               
           conversation.title = title
           self.db.commit()
           
           return await self.get_conversation(user_id, conversation_id)
       except Exception as e:
           self.db.rollback()
           raise e