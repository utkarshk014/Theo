from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    GEMINI_CHAT_API_KEY: str
    GEMINI_CONTEXT_API_KEY: str
    MAX_TOKENS: int = 32000
    MESSAGES_BEFORE_SUMMARY: int = 4
    CLERK_SECRET_KEY: str
    CLERK_WEBHOOK_SECRET: str
    
    class Config:
        env_file = ".env"

settings = Settings()