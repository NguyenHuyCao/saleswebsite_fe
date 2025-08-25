import { http } from "@/lib/api/http";
import { setAccessToken, clearAccessToken } from "@/lib/api/token";
import type {
  Envelope,
  LoginPayload,
  LoginResponse,
  RegisterPayload,
} from "../type";

const unwrap = <T>(res: { data: Envelope<T> | any }) =>
  (res.data?.data ?? res.data) as T;

export async function login(payload: LoginPayload) {
  const res = await http.post<Envelope<LoginResponse>>(
    "/api/v1/auth/login",
    payload
  );
  const data = unwrap<LoginResponse>(res);
  setAccessToken(data.accessToken);
  if (typeof window !== "undefined")
    localStorage.setItem("user", JSON.stringify(data.user));
  return data;
}

export async function logout() {
  try {
    await http.post("/api/v1/auth/logout");
  } finally {
    clearAccessToken();
  }
}

/**
 * Lưu ý: Back-end hiện đang đặt /api/v1/users là API cần quyền user:write.
 * Nếu BE bật đăng ký public, đổi PreAuthorize hoặc cung cấp /auth/register.
 * Ở đây vẫn gọi /users và handle 403 tử tế.
 */
export async function registerUser(payload: RegisterPayload) {
  const res = await http.post("/api/v1/users", payload);
  return unwrap(res);
}
