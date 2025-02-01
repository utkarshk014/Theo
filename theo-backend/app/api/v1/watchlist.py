from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.core.database import get_db
from app.services.watchlist import WatchlistService
from typing import List, Dict
from app.models import User
from app.core.auth import get_user_from_header

router = APIRouter(prefix="/api/v1/watchlist", tags=["watchlist"])

class AddStockRequest(BaseModel):
   symbol: str

class UpdateWatchlistRequest(BaseModel):
   symbols: List[str]

@router.put("/stocks")
async def update_watchlist(
    request: UpdateWatchlistRequest,
    db: Session = Depends(get_db),
    authorization: str = Header(None)
):

    user = get_user_from_header(authorization, db)    
    try:
        watchlist_service = WatchlistService(db)
        return watchlist_service.update_watchlist(user.id, request.symbols)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/stocks")
async def get_watchlist(
   db: Session = Depends(get_db),
   authorization: str = Header(None)
):  
   print("enter ", authorization)
   user = get_user_from_header(authorization, db)    
   try:
       watchlist_service = WatchlistService(db)
       return watchlist_service.get_watchlist(user.id)
   except Exception as e:
       print(f"Error getting watchlist: {str(e)}")
       raise HTTPException(status_code=500, detail=str(e))