const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

export async function apiFetch(input, init = {}) {
  const headers = new Headers(init.headers || {});
  const requestUrl = typeof input === 'string' ? input : input.url;
  const isPublicAuthRequest = /\/api\/auth\/(login|verify-2fa|resend-otp|forgot-password|verify-reset-otp|reset-password)(\?|$)/.test(requestUrl);
  const token = isPublicAuthRequest ? null : localStorage.getItem('token');
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  const response = await fetch(input, { ...init, headers });
  if (response.status === 401 && token) {
    localStorage.removeItem('token');
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_id');
    window.dispatchEvent(new Event('tee-session-expired'));
  }
  return response;
}
