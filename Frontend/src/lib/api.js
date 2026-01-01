// src/lib/api.js

const API_BASE =
  import.meta.env.VITE_API_BASE || "http://localhost:8080";

/* -------------------------------------------------------
   Helpers
------------------------------------------------------- */
async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include",
    ...options,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.message || "Request failed");
  }

  return data;
}

/* -------------------------------------------------------
   Auth APIs
------------------------------------------------------- */

// ✅ LOGIN (email + password)
export async function loginLocal(payload) {
  return request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// ✅ SIGNUP (email + password)
export async function signupLocal(payload) {
  return request("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}