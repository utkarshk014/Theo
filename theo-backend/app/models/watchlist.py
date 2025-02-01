# app/models/watchlist.py
from sqlalchemy import Column, Integer, String, ForeignKey, ARRAY
from sqlalchemy.orm import relationship
from .base import TimeStampedModel

class Watchlist(TimeStampedModel):
    __tablename__ = "watchlists"
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    stock_symbols = Column(ARRAY(String), nullable=False, default=[])  # Stores up to 5 symbols
    user = relationship("User", back_populates="watchlist")