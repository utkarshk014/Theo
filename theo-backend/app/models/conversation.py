from sqlalchemy import Column, Integer, String, JSON, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from .base import TimeStampedModel

class Conversation(TimeStampedModel):
   __tablename__ = "conversations"
   
   id = Column(Integer, primary_key=True)
   user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
   context_summary = Column(JSON, nullable=True)
   total_tokens = Column(Integer, default=0)
   title = Column(String, nullable=True, default="")
   message_count = Column(Integer, default=0)
   is_summary_generating = Column(Boolean, default=False)
   is_complete = Column(Boolean, default=False)
   
   messages = relationship("Message", back_populates="conversation")
   user = relationship("User", back_populates="conversations")

class Message(TimeStampedModel):
   __tablename__ = "messages"
   
   id = Column(Integer, primary_key=True)
   conversation_id = Column(Integer, ForeignKey("conversations.id"))
   user_question = Column(String, nullable=False)
   ai_response = Column(String, nullable=False)
   user_tokens = Column(Integer, nullable=False)
   ai_tokens = Column(Integer, nullable=False)
   
   conversation = relationship("Conversation", back_populates="messages")