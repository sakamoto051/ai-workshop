"""バックエンド調査ハンズオン用のダミーコード"""


def login(email: str, password: str) -> dict:
    user = find_user_by_email(email)
    if user is None or not verify_password(password, user["password_hash"]):
        return {"ok": False, "error": "invalid credentials"}
    return {"ok": True, "token": issue_token(user)}


def find_user_by_email(email: str) -> dict | None:
    raise NotImplementedError


def verify_password(password: str, password_hash: str) -> bool:
    raise NotImplementedError


def issue_token(user: dict) -> str:
    raise NotImplementedError
