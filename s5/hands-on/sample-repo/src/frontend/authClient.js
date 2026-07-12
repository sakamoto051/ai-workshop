// フロントエンド調査ハンズオン用のダミーAPIクライアント

const API_BASE_URL = "http://localhost:8000";

export async function login(email, password) {
  const res = await fetch(`${API_BASE_URL}/api/login`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

export function saveToken(token) {
  localStorage.setItem("auth_token", token);
}

export function logout() {
  localStorage.removeItem("auth_token");
}
