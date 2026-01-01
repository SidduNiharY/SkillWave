import axios from "axios";
import { toast } from "sonner";

// NOTE:
// - We export BOTH a named export (`http`) and a default export.
// - This fixes errors like:
//   "The requested module '/src/api/http.js' does not provide an export named 'http'"

export const http = axios.create({
  // support either env var name
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

// --- REQUEST "middleware" ---
http.interceptors.request.use(
  (config) => {
    // Attach JWT automatically
    if (authToken) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${authToken}`;
    }

    // Optional: request logging
    // console.log("[HTTP]", config.method?.toUpperCase(), config.url);

    return config;
  },
  (error) => Promise.reject(error)
);

// --- RESPONSE "middleware" ---
http.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    // Global auth handling
    if (status === 401) {
      toast.error("Session expired. Please login again.");
      // clear token + redirect
      localStorage.removeItem("skillwave_token");
      window.location.href = "/login";
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