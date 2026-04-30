from __future__ import annotations

from typing import Optional

from bson import ObjectId
from pymongo.errors import DuplicateKeyError
from fastapi import HTTPException, status

from app.database import get_users_collection
from app.schemas import UserCreate
from app.security import hash_password, verify_password


def document_to_user(document: dict) -> dict:
    return {
        "id": str(document["_id"]),
        "username": document["username"],
        "email": document["email"],
        "created_at": document["created_at"].isoformat(),
    }


def create_user(payload: UserCreate) -> dict:
    from datetime import datetime, timezone

    users = get_users_collection()
    document = {
        "username": payload.username.strip(),
        "email": payload.email.lower(),
        "hashed_password": hash_password(payload.password),
        "created_at": datetime.now(timezone.utc),
    }

    try:
        result = users.insert_one(document)
    except DuplicateKeyError as exc:
        message = "Username or email already exists."
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=message) from exc

    document["_id"] = result.inserted_id
    return document_to_user(document)


def authenticate_user(email: str, password: str) -> Optional[dict]:
    document = get_users_collection().find_one({"email": email.lower()})
    if document is None or not verify_password(password, document["hashed_password"]):
        return None
    return document_to_user(document)


def get_user_by_id(user_id: str) -> Optional[dict]:
    if not ObjectId.is_valid(user_id):
        return None

    document = get_users_collection().find_one({"_id": ObjectId(user_id)})
    return document_to_user(document) if document else None


def update_user_password(user_id: str, current_password: str, new_password: str) -> bool:
    if not ObjectId.is_valid(user_id):
        return False

    users = get_users_collection()
    document = users.find_one({"_id": ObjectId(user_id)})
    if document is None or not verify_password(current_password, document["hashed_password"]):
        return False

    users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"hashed_password": hash_password(new_password)}},
    )
    return True
