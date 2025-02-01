from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from .base import TimeStampedModel

class Chapter(TimeStampedModel):
    __tablename__ = "chapters"
    
    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    description = Column(String)
    order = Column(Integer, nullable=False)
    subtopics = relationship("Subtopic", back_populates="chapter")

class Subtopic(TimeStampedModel):
    __tablename__ = "subtopics"
    
    id = Column(Integer, primary_key=True)
    chapter_id = Column(Integer, ForeignKey("chapters.id"))
    title = Column(String, nullable=False)
    content = Column(String, nullable=False)
    order = Column(Integer, nullable=False)
    chapter = relationship("Chapter", back_populates="subtopics")