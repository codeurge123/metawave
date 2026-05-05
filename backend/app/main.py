import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.database import init_db
from app.routers import antenna, auth, chat, metamaterial


settings = get_settings()
logger = logging.getLogger(__name__)

app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1):\d+",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    try:
        init_db()
    except Exception as exc:
        logger.warning("Skipping database index setup: %s", exc)


@app.get("/health", tags=["health"])
def health() -> dict:
    return {"status": "ok", "service": settings.app_name, "environment": settings.environment}


app.include_router(auth.router)
app.include_router(chat.router)
app.include_router(antenna.router)
app.include_router(metamaterial.router)
