import axios from "axios";
import { toast } from "sonner";

/**
 * http.js
 * - Exports BOTH named (`http`) and default export for compatibility.
 * - Supports multiple env var names for base URL.
 * - Attaches JWT automatically via setAuthToken().
 * - Handles global 401 (session expired) safely (prevents redirect loop on /login).
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
    return config;
  },
  (error) => Promise.reject(error)
);

// --- RESPONSE interceptor ---
http.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    // ✅ Global auth handling (avoid infinite redirects)
    if (status === 401) {
      localStorage.removeItem("skillwave_token");

      // only redirect if we're not already on /login
      if (window.location.pathname !== "/login") {
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

    toast.error(msg);
    return Promise.reject(error);
  }
);

export default http;