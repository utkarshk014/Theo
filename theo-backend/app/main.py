from fastapi import FastAPI, Depends, Request
from sqlalchemy.orm import Session
from .core.database import get_db, Base, engine
from .api.v1 import chat
from app.api.v1 import chat, watchlist, auth, chapters, progress, teaching
import logging
from fastapi.middleware.cors import CORSMiddleware


logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="Theo API",
    description="API for Theo - Your Stock Market Teaching Assistant",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],  
)

@app.get("/")
async def root():
    return {"message": "Welcome to Theo API"}

@app.get("/test-db")
async def test_db(db: Session = Depends(get_db)):
    try:
        # Try to execute a simple query
        db.execute("SELECT 1")
        return {"message": "Database connection successful!"}
    except Exception as e:
        return {"error": f"Database connection failed: {str(e)}"}

@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"Request: {request.method} {request.url}")
    response = await call_next(request)
    return response

app.include_router(chat.router)
app.include_router(watchlist.router)
app.include_router(auth.router)
app.include_router(chapters.router)
app.include_router(progress.router)
app.include_router(teaching.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)