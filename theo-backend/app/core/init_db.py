# app/core/init_db.py
from sqlalchemy import inspect
from app.core.database import engine, Base
from app.models import Conversation, Message

def init_db():
    print("Starting database initialization...")
    
    try:
        inspector = inspect(engine)
        
        for table in ['messages', 'conversations']:
            if table in inspector.get_table_names():
                print(f"Dropping {table} table...")
                if table == 'messages':
                    Message.__table__.drop(engine)
                else:
                    Conversation.__table__.drop(engine)
        
        # Create conversations first, then messages
        Conversation.__table__.create(engine)
        Message.__table__.create(engine)
        print("Created new tables with updated schema")
        
    except Exception as e:
        print(f"Error: {str(e)}")
        raise

if __name__ == "__main__":
    init_db()