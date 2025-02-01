# from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Header
# from sqlalchemy.orm import Session
# from typing import List, Optional
# from pydantic import BaseModel
# from app.core.database import get_db
# from app.services.conversation import ConversationService
# from app.core.auth import get_user_from_header
# from app.models import User

# router = APIRouter(prefix="/api/v1/chat", tags=["chat"])

# # Pydantic models for request/response validation
# class MessageCreate(BaseModel):
#     content: str

# class MessageResponse(BaseModel):
#     user: str
#     ai: str
#     userTokens: int
#     aiTokens: int
#     createdAt: str

# class ConversationResponse(BaseModel):
#     conversation_id: int
#     messages: List[MessageResponse]
#     total_tokens: int
#     is_complete: bool
#     is_generating_summary: Optional[bool] = False
#     has_context_summary: Optional[bool] = False

# class ConversationStatusResponse(BaseModel):
#     id: int
#     total_tokens: int
#     message_count: int
#     is_complete: bool
#     is_generating_summary: bool
#     has_context_summary: bool

# class UpdateTitleRequest(BaseModel):
#     title: str

# @router.post("/message", response_model=ConversationResponse)
# async def create_message(
#     message: MessageCreate,
#     db: Session = Depends(get_db),
#     conversation_id: Optional[int] = None,
#     authorization: str = Header(None)
# ):
#     user = get_user_from_header(authorization, db)
#     conversation_service = ConversationService(db)
#     response = await conversation_service.handle_message(
#         user_id=user.id,
#         content=message.content,
#         conversation_id=conversation_id
#     )
#     return response

# @router.get("/conversation/{conversation_id}", response_model=ConversationResponse)
# def get_conversation(
#     conversation_id: int,
#     db: Session = Depends(get_db),
#     authorization: str = Header(None)
# ):
#     user = get_user_from_header(authorization, db)
#     conversation_service = ConversationService(db)
#     conversation = conversation_service.get_conversation(user.id, conversation_id)
    
#     if not conversation:
#         raise HTTPException(status_code=404, detail="Conversation not found")
    
#     return conversation

# @router.get("/conversations", response_model=List[ConversationStatusResponse])
# def list_conversations(
#     db: Session = Depends(get_db),
#     authorization: str = Header(None)
# ):
#     user = get_user_from_header(authorization, db)
#     conversation_service = ConversationService(db)
#     return conversation_service.get_user_conversations(user.id)

# @router.post("/conversation/new", response_model=ConversationResponse)
# def start_new_conversation(
#     db: Session = Depends(get_db),
#     authorization: str = Header(None)
# ):
#     user = get_user_from_header(authorization, db)
#     conversation_service = ConversationService(db)
#     return conversation_service.create_new_conversation(user.id)

# @router.patch("/conversation/{conversation_id}/title", response_model=ConversationResponse)
# def update_title(
#     conversation_id: int,
#     request: UpdateTitleRequest,
#     db: Session = Depends(get_db),
#     authorization: str = Header(None)
# ):
#     user = get_user_from_header(authorization, db)
#     conversation_service = ConversationService(db)
#     return conversation_service.update_conversation_title(
#         user_id=user.id,
#         conversation_id=conversation_id,
#         title=request.title
#     )


from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from app.core.database import get_db
from app.services.conversation import ConversationService
from app.core.auth import get_user_from_header

router = APIRouter(prefix="/api/v1/chat", tags=["chat"])

class MessageCreate(BaseModel):
   content: str

class MessageResponse(BaseModel):
   user: str
   ai: str
   userTokens: int
   aiTokens: int
   createdAt: str

class ConversationResponse(BaseModel):
   conversation_id: int
   messages: List[MessageResponse]
   total_tokens: int
   is_complete: bool
   is_generating_summary: Optional[bool] = False
   has_context_summary: Optional[bool] = False
   status: str

class ConversationStatusResponse(BaseModel):
   id: int
   total_tokens: int
   message_count: int
   is_complete: bool
   is_generating_summary: bool
   has_context_summary: bool

class UpdateTitleRequest(BaseModel):
   title: str

@router.post("/message", response_model=ConversationResponse)
async def create_message(
   message: MessageCreate,
   db: Session = Depends(get_db),
   conversation_id: Optional[int] = None,
   authorization: str = Header(None)
):
   user = get_user_from_header(authorization, db)
   conversation_service = ConversationService(db)
   return await conversation_service.handle_message(
       user_id=user.id,
       content=message.content,
       conversation_id=conversation_id
   )

@router.get("/conversation/{conversation_id}", response_model=ConversationResponse)
async def get_conversation(
   conversation_id: int,
   db: Session = Depends(get_db),
   authorization: str = Header(None)
):
   user = get_user_from_header(authorization, db)
   conversation_service = ConversationService(db)
   return await conversation_service.get_conversation(user.id, conversation_id)

@router.get("/conversations", response_model=List[ConversationStatusResponse])
async def list_conversations(
   db: Session = Depends(get_db),
   authorization: str = Header(None)
):
   user = get_user_from_header(authorization, db)
   conversation_service = ConversationService(db)
   return await conversation_service.get_user_conversations(user.id)

@router.post("/conversation/new", response_model=ConversationResponse)
async def start_new_conversation(
   db: Session = Depends(get_db),
   authorization: str = Header(None)
):
   user = get_user_from_header(authorization, db)
   conversation_service = ConversationService(db)
   return await conversation_service.create_new_conversation(user.id)

@router.patch("/conversation/{conversation_id}/title", response_model=ConversationResponse)
async def update_title(
   conversation_id: int,
   request: UpdateTitleRequest,
   db: Session = Depends(get_db),
   authorization: str = Header(None)
):
   user = get_user_from_header(authorization, db)
   conversation_service = ConversationService(db)
   return await conversation_service.update_conversation_title(
       user_id=user.id,
       conversation_id=conversation_id,
       title=request.title
   )