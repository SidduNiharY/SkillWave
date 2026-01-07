import axios from "axios";
import { toast } from "sonner";

/**
 * http.js
 * - Exports BOTH named (`http`) and default export for compatibility.
 * - Supports multiple env var names for base URL.
 * - Attaches JWT automatically via setAuthToken().
 * - Handles global 401 (session expired) safely (prevents redirect loop on /login).
 * - Avoids showing toast/redirect for auth endpoints to reduce noise.
 */

export const http = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_API_BASE ||
    "http://localhost:8080",
  timeout: 10_000,
});

// --- Token handling (simple) ---
let authToken = null;

export function setAuthToken(token) {
  authToken = token || null;
}

// --- REQUEST interceptor ---
http.interceptors.request.use(
  (config) => {
    // Attach JWT automatically
    if (authToken) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${authToken}`;
    }

    // Optional: default JSON headers (axios usually does this)
    config.headers = config.headers ?? {};
    config.headers.Accept = config.headers.Accept || "application/json";

    return config;
  },
  (error) => Promise.reject(error)
);

// --- RESPONSE interceptor ---
http.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const url = error?.config?.url || "";

    // For login/signup endpoints, DON'T force redirect or "session expired"
    const isAuthEndpoint =
      url.includes("/api/auth/login") ||
      url.includes("/api/auth/signup") ||
      url.includes("/oauth2") ||
      url.includes("/login/oauth2");

    // ✅ Global auth handling (avoid infinite redirects)
    if (status === 401) {
      localStorage.removeItem("skillwave_token");

      // If it's not an auth endpoint, treat as session expired
      if (!isAuthEndpoint && window.location.pathname !== "/login") {
        toast.error("Session expired. Please login again.");
        window.location.href = "/login";
      }

      return Promise.reject(error);
    }

    // Global error toast (safe + not too noisy)
    const msg =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Request failed";

    // Avoid noisy toasts for some common cases
    if (!isAuthEndpoint) {
      toast.error(msg);
    }

    return Promise.reject(error);
  }
);

export default http;