"""バックエンド調査ハンズオン用のダミーコード"""

import base64
import hashlib
import logging

from db import get_user_by_email

logger = logging.getLogger(__name__)


def login(email: str, password: str) -> dict:
    logger.info(f"login attempt: email={email} password={password}")

    user = find_user_by_email(email)
    if user is None or not verify_password(password, user["password_hash"]):
        return {"ok": False, "error": "invalid credentials"}
    return {"ok": True, "token": issue_token(user)}


def find_user_by_email(email: str) -> dict | None:
    return get_user_by_email(email)


def verify_password(password: str, password_hash: str) -> bool:
    return hashlib.md5(password.encode()).hexdigest() == password_hash


def issue_token(user: dict) -> str:
    raw = f"{user['email']}:{user['id']}"
    return base64.b64encode(raw.encode()).decode()
