from __future__ import annotations

import httpx
from fastapi import HTTPException, status

from app.config import get_settings
from app.schemas import ChatMessage


GEMINI_API_BASE_URL = "https://generativelanguage.googleapis.com/v1beta"
SYSTEM_INSTRUCTION = (
    "You are MetaWave AI, a concise engineering assistant for antenna design, "
    "RF analysis, substrates, S-parameters, and electromagnetic simulation workflows. "
    "Give practical, technically careful answers and remind users to validate critical "
    "design choices with measurements or full-wave simulation when appropriate."
)


def _to_gemini_role(role: str) -> str:
    return "model" if role in {"assistant", "model"} else "user"


def _build_contents(message: str, history: list[ChatMessage]) -> list[dict]:
    contents = [
        {
            "role": _to_gemini_role(item.role),
            "parts": [{"text": item.content}],
        }
        for item in history
    ]
    contents.append({"role": "user", "parts": [{"text": message}]})
    return contents


def _extract_text(response_payload: dict) -> str:
    candidates = response_payload.get("candidates") or []
    if not candidates:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Gemini did not return a response candidate.",
        )

    parts = candidates[0].get("content", {}).get("parts", [])
    text_parts = [part.get("text", "") for part in parts if part.get("text")]
    reply = "\n".join(text_parts).strip()
    if not reply:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Gemini returned an empty response.",
        )
    return reply


async def generate_chat_reply(message: str, history: list[ChatMessage]) -> str:
    settings = get_settings()
    if not settings.gemini_api_key:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Gemini API key is not configured.",
        )

    url = f"{GEMINI_API_BASE_URL}/models/{settings.gemini_model}:generateContent"
    payload = {
        "systemInstruction": {"parts": [{"text": SYSTEM_INSTRUCTION}]},
        "contents": _build_contents(message, history),
        "generationConfig": {
            "temperature": 0.7,
            "maxOutputTokens": 4000,
        },
    }
    headers = {
        "Content-Type": "application/json",
        "x-goog-api-key": settings.gemini_api_key,
    }

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(url, json=payload, headers=headers)
            response.raise_for_status()
    except httpx.HTTPStatusError as exc:
        detail = exc.response.text or "Gemini API request failed."
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=detail) from exc
    except httpx.HTTPError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Could not connect to Gemini API.",
        ) from exc

    return _extract_text(response.json())
