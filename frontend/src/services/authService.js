const API_BASE = "http://localhost:5000/api";

/* =========================
   HELPER: GET TOKEN
========================= */
const getToken = () => {
  return localStorage.getItem("token");
};

/* =========================
   HELPER: AUTH FETCH
   - Attaches JWT automatically
   - Handles 401 globally
========================= */
const authFetch = async (url, options = {}) => {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    ...options,
    headers,
  });

  const contentType = res.headers.get("content-type");

  if (!contentType || !contentType.includes("application/json")) {
    const raw = await res.text();
    console.error("NON-JSON RESPONSE:", raw);
    throw new Error("Backend not reachable or returned HTML");
  }

  const data = await res.json();

  // 🔥 GLOBAL AUTH FAILURE
  if (res.status === 401) {
    // token invalid / expired
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // force redirect (works even outside React)
    window.location.href = "/login";
    return;
  }

  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};

/* =========================
   REGISTER
========================= */
export const registerUser = async (userData) => {
  return authFetch(`${API_BASE}/auth/register`, {
    method: "POST",
    body: JSON.stringify(userData),
  });
};

/* =========================
   LOGIN
========================= */
export const loginUser = async (credentials) => {
  return authFetch(`${API_BASE}/auth/login`, {
    method: "POST",
    body: JSON.stringify(credentials),
  });
};

/* =========================
   LOGOUT (OPTIONAL)
========================= */
export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
};
