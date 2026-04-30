from typing import Optional

from pymongo import ASCENDING, MongoClient
from pymongo.collection import Collection
from pymongo.database import Database

from app.config import get_settings


_client: Optional[MongoClient] = None


def get_client() -> MongoClient:
    global _client
    if _client is None:
        settings = get_settings()
        _client = MongoClient(settings.mongodb_uri, serverSelectionTimeoutMS=5000)
    return _client


def get_database() -> Database:
    settings = get_settings()
    return get_client()[settings.mongodb_db_name]


def get_users_collection() -> Collection:
    settings = get_settings()
    return get_database()[settings.mongodb_users_collection]


def init_db() -> None:
    users = get_users_collection()
    users.create_index([("email", ASCENDING)], unique=True)
    users.create_index([("username", ASCENDING)], unique=True)
