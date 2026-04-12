// src/lib/api/http.ts
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { getAccessToken, setAccessToken, clearAccessToken } from "./token";

export type ApiEnvelope<T> = { status: number; message?: any; data?: T };
type ApiError = {
  message?: string;
  error?: string;
  code?: string;
  [k: string]: any;
};

const baseURL = (process.env.NEXT_PUBLIC_BACKEND_URL || "").replace(/\/$/, "");

// unwrap: AxiosResponse<ApiEnvelope<T>> -> T
export function unwrap<T>(res: AxiosResponse<ApiEnvelope<T>>): T {
  if (!res?.data) throw new Error("Invalid response shape");
  return res.data.data as T;
}

// ----- Singleton instance
const g = globalThis as any;
export const http: AxiosInstance =
  g.__APP_HTTP__ ??
  axios.create({
    baseURL,
    withCredentials: true,
    timeout: 30000,
    headers: { "Content-Type": "application/json", "Accept-Language": "vi" },
  });
if (!g.__APP_HTTP__) g.__APP_HTTP__ = http;

// ----- Request: attach token
http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const t = getAccessToken();
  if (t) config.headers.Authorization = `Bearer ${t}`;
  (config.headers as any)["X-Request-ID"] =
    (typeof crypto !== "undefined" && (crypto as any).randomUUID?.()) ||
    Date.now().toString(36);
  return config;
});

// ----- Refresh queue + error handling (giữ nguyên phần của bạn)
let isRefreshing = false;
let pending: Array<(t: string | null) => void> = [];
const runQueued = (t: string | null, rejectAll = false) => {
  const q = [...pending];
  pending = [];
  q.forEach((fn) => (rejectAll ? fn(null) : fn(t)));
};

async function refreshAccessToken() {
  const res = await axios.get<ApiEnvelope<{ accessToken: string }>>(
    `${baseURL}/api/v1/auth/refresh`,
    { withCredentials: true }
  );
  const newToken =
    res?.data?.data?.accessToken || (res as any)?.data?.accessToken;
  if (!newToken) throw new Error("Missing accessToken on refresh");
  setAccessToken(newToken);
  return newToken;
}
const NO_REFRESH = [/\/auth\/(login|logout|refresh)(\?|$)/];

http.interceptors.response.use(
  (r) => r,
  async (err: AxiosError<ApiError>) => {
    // Xử lý lỗi canceled - KIỂM TRA ĐẦU TIÊN
    if (err.code === "ERR_CANCELED" || err.message === "canceled") {
      // Tạo lỗi mới rõ ràng hơn nhưng vẫn giữ nguyên tính chất canceled
      const cancelError = new Error("Request cancelled");
      cancelError.name = "CanceledError";
      return Promise.reject(cancelError);
    }

    // Lấy original config - sửa lỗi cú pháp ở đây
    const original = err.config as
      | (AxiosRequestConfig & { _retry?: boolean })
      | undefined;

    // Lấy status - kiểm tra tồn tại
    const status = err.response?.status;

    // Lấy message - sửa lỗi cú pháp và optional chaining
    const msg =
      (err.response?.data as any)?.message ||
      (err.response?.data as any)?.error ||
      err.message ||
      "Có lỗi xảy ra";

    // Phần còn lại của interceptor giữ nguyên
    const url = (original?.url || "") as string;
    const skip = NO_REFRESH.some((rx) => rx.test(url));

    // Xử lý rate limit
    if (
      (status === 429 || status === 503) &&
      original?.method === "get" &&
      !(original as any)._retried429
    ) {
      (original as any)._retried429 = true;
      await new Promise((r) => setTimeout(r, 600));
      return http(original!);
    }

    // Xử lý 401 và refresh token
    if (status === 401 && original && !original._retry && !skip) {
      original._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pending.push(async (token) => {
            if (!token) return reject(new Error("Phiên đăng nhập đã hết hạn."));
            original.headers = original.headers || {};
            (original.headers as any).Authorization = `Bearer ${token}`;
            try {
              resolve(await http(original));
            } catch (e) {
              reject(e);
            }
          });
        });
      }

      isRefreshing = true;
      try {
        const token = await refreshAccessToken();
        const res = await new Promise((resolve, reject) => {
          runQueued(token);
          original.headers = original.headers || {};
          (original.headers as any).Authorization = `Bearer ${token}`;
          http(original).then(resolve).catch(reject);
        });
        return res as any;
      } catch {
        runQueued(null, true);
        clearAccessToken();
        if (
          typeof window !== "undefined" &&
          !location.pathname.startsWith("/login")
        ) {
          window.dispatchEvent(new Event("logout"));
          location.href = "/login";
        }
        throw new Error("Phiên đăng nhập đã hết hạn.");
      } finally {
        isRefreshing = false;
      }
    }

    if (status === 403)
      throw new Error(msg || "Bạn không có quyền thực hiện thao tác này.");

    throw new Error(msg);
  },
);

export const toApiError = (e: unknown) =>
  e instanceof Error ? e : new Error("Có lỗi xảy ra");

/** Helpers trả về T đã unwrap – dùng thay cho việc extend AxiosInstance */
export const api = {
  get: async <T>(url: string, config?: AxiosRequestConfig) =>
    unwrap<T>(await http.get<ApiEnvelope<T>>(url, config)),
  delete: async <T>(url: string, config?: AxiosRequestConfig) =>
    unwrap<T>(await http.delete<ApiEnvelope<T>>(url, config)),
  post: async <T, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ) =>
    unwrap<T>(
      await http.post<ApiEnvelope<T>, AxiosResponse<ApiEnvelope<T>>, D>(
        url,
        data,
        config
      )
    ),
  put: async <T, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ) =>
    unwrap<T>(
      await http.put<ApiEnvelope<T>, AxiosResponse<ApiEnvelope<T>>, D>(
        url,
        data,
        config
      )
    ),
  patch: async <T, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ) =>
    unwrap<T>(
      await http.patch<ApiEnvelope<T>, AxiosResponse<ApiEnvelope<T>>, D>(
        url,
        data,
        config
      )
    ),
};
