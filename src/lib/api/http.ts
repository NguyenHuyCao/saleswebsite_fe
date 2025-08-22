// src/lib/api/http.ts
import axios, {
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";
import { getAccessToken, setAccessToken, clearAccessToken } from "./token";

type ApiEnvelope<T> = { status: number; message?: any; data?: T };
type ApiError = { message?: string; error?: string; [k: string]: any };

const baseURL = (process.env.NEXT_PUBLIC_BACKEND_URL || "").replace(/\/$/, "");

export const http = axios.create({
  baseURL,
  withCredentials: true, // cần để gửi cookie refresh_token khi refresh
  headers: { "Content-Type": "application/json" },
});

// --- attach Authorization ---
http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// --- simple refresh queue ---
let isRefreshing = false;
let pending: Array<(t: string | null) => void> = [];
const enqueue = <T>(cb: (token: string | null) => Promise<T>) =>
  new Promise<T>((resolve, reject) =>
    pending.push((t) => cb(t).then(resolve).catch(reject))
  );
const flush = (t: string | null) => {
  const q = [...pending];
  pending = [];
  q.forEach((run) => run(t));
};

async function refreshAccessToken() {
  const res = await axios.get<ApiEnvelope<{ accessToken: string }>>(
    `${baseURL}/api/v1/auth/refresh`,
    {
      withCredentials: true,
    }
  );
  const newToken =
    res?.data?.data?.accessToken || (res as any)?.data?.accessToken;
  if (!newToken) throw new Error("Missing accessToken on refresh");
  setAccessToken(newToken);
  return newToken;
}

http.interceptors.response.use(
  (res) => res,
  async (err: AxiosError<ApiError>) => {
    const original = err.config as AxiosRequestConfig & { _retry?: boolean };
    const status = err.response?.status;
    const beMsg =
      (err.response?.data as any)?.message ||
      (err.response?.data as any)?.error ||
      err.message ||
      "Có lỗi xảy ra";

    if (status === 401 && !original?._retry) {
      if (isRefreshing) {
        return enqueue((token) => {
          if (!original) return Promise.reject(err);
          original.headers = original.headers || {};
          if (token)
            (original.headers as any).Authorization = `Bearer ${token}`;
          original._retry = true;
          return http(original);
        });
      }
      original._retry = true;
      isRefreshing = true;
      try {
        const newToken = await refreshAccessToken();
        flush(newToken);
        original.headers = original.headers || {};
        (original.headers as any).Authorization = `Bearer ${newToken}`;
        return http(original);
      } catch (e) {
        flush(null);
        clearAccessToken();
        if (
          typeof window !== "undefined" &&
          !location.pathname.startsWith("/login")
        ) {
          location.href = "/login";
        }
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    if (status === 403) {
      return Promise.reject(
        new Error(beMsg || "Bạn không có quyền thực hiện thao tác này.")
      );
    }
    return Promise.reject(new Error(beMsg));
  }
);
