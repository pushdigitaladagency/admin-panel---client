// Lightweight client for the CMS Express API.
//
// - Reads the base URL from NEXT_PUBLIC_API_BASE_URL (falls back to the live host).
// - Attaches the JWT (Authorization: Bearer) from localStorage on authed calls.
// - Unwraps the backend's { success, data, meta } envelope and throws ApiError on
//   { success:false } or non-2xx responses.
// - Emits a window 'auth:unauthorized' event on 401 so the auth layer can react.

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://63.141.242.203:6001/api';

const TOKEN_KEY = 'cms_token';

export function getToken() {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  constructor(message, status, payload) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;
  }
}

async function request(path, { method = 'GET', body, auth = true, headers = {} } = {}) {
  const isForm = typeof FormData !== 'undefined' && body instanceof FormData;

  const finalHeaders = { ...headers };
  if (!isForm && body !== undefined) finalHeaders['Content-Type'] = 'application/json';

  const token = auth ? getToken() : null;
  if (token) finalHeaders['Authorization'] = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: finalHeaders,
      body: isForm ? body : body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError('Network error — could not reach the server.', 0, null);
  }

  // Parse the body defensively (some responses may be empty).
  let payload = null;
  const text = await res.text();
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = { raw: text };
    }
  }

  // Surface auth failures so the AuthContext can clear state / redirect.
  if (res.status === 401 && auth && typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('auth:unauthorized'));
  }

  if (!res.ok || (payload && payload.success === false)) {
    const message = (payload && payload.error) || `Request failed (${res.status})`;
    throw new ApiError(message, res.status, payload);
  }

  return payload;
}

export const api = {
  get: (path, opts) => request(path, { ...opts, method: 'GET' }),
  post: (path, body, opts) => request(path, { ...opts, method: 'POST', body }),
  put: (path, body, opts) => request(path, { ...opts, method: 'PUT', body }),
  patch: (path, body, opts) => request(path, { ...opts, method: 'PATCH', body }),
  del: (path, opts) => request(path, { ...opts, method: 'DELETE' }),
};

// Multipart uploads. Returns the saved-file descriptor(s) from /api/upload.
export async function uploadFile(file) {
  const fd = new FormData();
  fd.append('file', file);
  const res = await request('/upload', { method: 'POST', body: fd });
  return res.data; // { filename, path, size, mimetype }
}

export async function uploadFiles(files) {
  const fd = new FormData();
  Array.from(files).forEach((f) => fd.append('files', f));
  const res = await request('/upload/multiple', { method: 'POST', body: fd });
  return res.data;
}

export { BASE_URL };
