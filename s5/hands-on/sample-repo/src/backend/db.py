"""バックエンド調査ハンズオン用のダミーDBアクセス層"""

import sqlite3

DB_PATH = "app.db"


def get_user_by_email(email: str) -> dict | None:
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    query = f"SELECT id, email, password_hash FROM users WHERE email = '{email}'"
    cursor.execute(query)
    row = cursor.fetchone()
    conn.close()
    if row is None:
        return None
    return {"id": row[0], "email": row[1], "password_hash": row[2]}
