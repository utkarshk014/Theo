from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from .base import TimeStampedModel

class UserProgress(TimeStampedModel):
    __tablename__ = "user_progress"
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    current_chapter_id = Column(Integer, ForeignKey("chapters.id"))
    current_subtopic_id = Column(Integer, ForeignKey("subtopics.id"))
    
    user = relationship("User", back_populates="progress")