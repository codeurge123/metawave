const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
const TOKEN_KEY = "metawave_access_token";
const USER_KEY = "metawave_user";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser() {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
}

export function saveSession(authResponse) {
  localStorage.setItem(TOKEN_KEY, authResponse.access_token);
  localStorage.setItem(USER_KEY, JSON.stringify(authResponse.user));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

async function request(path, options = {}) {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.detail || "Something went wrong.");
  }

  return payload;
}

export function signup(data) {
  return request("/auth/signup", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function signin(data) {
  return request("/auth/signin", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function sendChatMessage(data) {
  return request("/chat", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updatePassword(data) {
  return request("/auth/password", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}
