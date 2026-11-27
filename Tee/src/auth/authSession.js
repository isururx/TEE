const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export function getAccessToken() {
  return localStorage.getItem("token") || localStorage.getItem("access_token");
}

export function saveSession({ access_token, user }) {
  if (!access_token || !user?.id || !user?.role) {
    throw new Error("The server returned an incomplete login session.");
  }
  localStorage.setItem("token", access_token);
  localStorage.setItem("access_token", access_token); // compatibility with existing API modules
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("user_id", String(user.id));
  localStorage.setItem("user_role", user.role);
  window.dispatchEvent(new CustomEvent("tee-auth-changed", { detail: { user } }));
}

export function clearSession() {
  ["token", "access_token", "user", "user_id", "user_role", "verification_email"].forEach((key) => localStorage.removeItem(key));
  window.dispatchEvent(new CustomEvent("tee-auth-changed", { detail: { user: null } }));
}

export async function authRequest(path, options = {}) {
  const token = getAccessToken();
  const headers = new Headers(options.headers || {});
  if (options.body && !(options.body instanceof FormData)) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const response = await fetch(`${API_BASE_URL}/api/auth${path}`, { ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401 && token) clearSession();
    throw new Error(data.detail || "Authentication request failed.");
  }
  return data;
}

export async function loadCurrentUser() {
  return authRequest("/me", { method: "GET" });
}

export async function logout() {
  try {
    await authRequest("/logout", { method: "POST" });
  } finally {
    clearSession();
  }
}
