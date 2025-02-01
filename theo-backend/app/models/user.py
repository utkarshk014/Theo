from sqlalchemy import Column, Integer, String, Boolean, Enum, JSON, DateTime
from sqlalchemy.orm import relationship
from enum import Enum as PyEnum
from .base import TimeStampedModel

class UserLevel(PyEnum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    PRO = "pro"

class User(TimeStampedModel):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True)
    clerk_id = Column(String, unique=True, nullable=False)  # Clerk's user ID
    email = Column(String, nullable=False)  # We'll sync this from Clerk

    last_login = Column(DateTime(timezone=True))
    
    # Profile data (can be synced from Clerk or managed in our app)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    image_url = Column(String, nullable=True)  # Profile picture from Clerk
    
    # App-specific user data
    level = Column(Enum(UserLevel), default=UserLevel.BEGINNER)
    completed_onboarding = Column(Boolean, default=False)
    
    # Store additional Clerk metadata if needed
    clerk_metadata = Column(JSON, nullable=True)  # Store any additional Clerk user metadata
    
    # Relationships
    conversations = relationship("Conversation", back_populates="user", cascade="all, delete-orphan")
    watchlist = relationship("Watchlist", back_populates="user", uselist=False, cascade="all, delete-orphan")
    progress = relationship("UserProgress", back_populates="user", cascade="all, delete-orphan")

class ClerkWebhookEvent(TimeStampedModel):
    __tablename__ = "clerk_webhook_events"
    
    id = Column(Integer, primary_key=True)
    clerk_event_id = Column(String, unique=True, nullable=False)
    event_type = Column(String, nullable=False)  # e.g., 'user.created', 'user.updated'
    data = Column(JSON, nullable=False)  # Store the full webhook payload
    processed = Column(Boolean, default=False)
    
    def __repr__(self):
        return f"<ClerkWebhookEvent {self.event_type} {self.clerk_event_id}>"
