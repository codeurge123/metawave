from fastapi import APIRouter, Depends

from app.config import get_settings
from app.dependencies import get_current_user
from app.gemini import generate_chat_reply
from app.schemas import ChatRequest, ChatResponse


router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("", response_model=ChatResponse)
async def chat(payload: ChatRequest, current_user: dict = Depends(get_current_user)) -> ChatResponse:
    del current_user
    reply = await generate_chat_reply(payload.message, payload.history)
    return ChatResponse(reply=reply, model=get_settings().gemini_model)
