import axios, { type AxiosError, type AxiosRequestConfig } from "axios";

/**
 * Minimal Axios instance for cookie-only auth + automatic refresh.
 *
 * - withCredentials is enabled so cookies (including refresh token) are sent.
 * - No tokens are stored in memory or localStorage.
 * - On 401, the client calls POST /auth/refresh (cookies sent) and, if successful,
 *   retries the original request. Concurrent requests are queued while refresh runs.
 *
 * Usage:
 *   import api from "@/lib/api";
 *   api.get("/protected_route"); // will automatically attempt refresh on 401
 */

const BASE_URL = (import.meta as any).env?.VITE_API_URL;
if (!BASE_URL) {
  throw new Error("VITE_API_URL environment variable is not set. Please configure it in your environment.");
}

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

function processQueue(error: any) {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(undefined);
  });
  failedQueue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (
    error: AxiosError & { config?: AxiosRequestConfig & { _retry?: boolean } },
  ) => {
    const originalRequest = error.config as any;

    // If no config or already retried, reject
    if (!originalRequest) return Promise.reject(error);
    if (originalRequest._retry) return Promise.reject(error);

    const status = error.response?.status;

    // Only attempt refresh on 401 Unauthorized
    if (status !== 401) return Promise.reject(error);

    // Prevent trying to refresh if the failing request was the refresh endpoint itself
    const url = originalRequest.url || "";
    if (url.includes("/auth/refresh")) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      // Queue the request until refresh finishes
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(() => api(originalRequest));
    }

    isRefreshing = true;

    try {
      // Use plain axios to call refresh to avoid re-using this instance's interceptors
      await axios.request({
        method: "post",
        baseURL: BASE_URL,
        url: "/auth/refresh",
        withCredentials: true,
        data: {},
        headers: { "Content-Type": "application/json" },
      });

      processQueue(null);

      // Retry original request (cookies will be sent automatically)
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError);
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;
