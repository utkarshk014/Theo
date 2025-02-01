from typing import List, Dict
from sqlalchemy.orm import Session
from app.models.watchlist import Watchlist

class WatchlistService:
   def __init__(self, db: Session):
       self.db = db

   def update_watchlist(self, user_id: int, new_symbols: List[str]) -> Dict:
       watchlist = self._get_or_create_watchlist(user_id)
       
       if len(new_symbols) > 5:
           raise Exception("Maximum 5 stocks allowed in watchlist")
           
       new_symbols = [symbol.upper() for symbol in new_symbols]
       watchlist.stock_symbols = new_symbols
       self.db.commit()
       
       return {"symbols": watchlist.stock_symbols}
             
   def get_watchlist(self, user_id: int) -> Dict:
       watchlist = self._get_watchlist(user_id)
       if not watchlist:
           return {"symbols": []}
       return {"symbols": watchlist.stock_symbols}
      
   def _get_or_create_watchlist(self, user_id: int) -> Watchlist:
       watchlist = self._get_watchlist(user_id)
       if not watchlist:
           watchlist = Watchlist(user_id=user_id, stock_symbols=[])
           self.db.add(watchlist)
           self.db.commit()
       return watchlist
      
   def _get_watchlist(self, user_id: int) -> Watchlist:
       return self.db.query(Watchlist).filter(
           Watchlist.user_id == user_id
       ).first()