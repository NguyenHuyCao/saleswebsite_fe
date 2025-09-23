import { api } from "@/lib/api/http";
import { clearAccessToken, setAccessToken } from "@/lib/api/token";
import type {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  UserAccount,
  ChangePasswordInput,
} from "./types";

// me
export async function fetchMe(): Promise<UserAccount> {
  return api.get<UserAccount>("/api/v1/auth/account");
}
export async function updateMe(
  payload: Partial<UserAccount>
): Promise<UserAccount> {
  return api.put<UserAccount, Partial<UserAccount>>(
    "/api/v1/users/me",
    payload
  );
}
export async function changePasswordMe(
  payload: ChangePasswordInput
): Promise<void> {
  const body = {
    currentPassword: payload.currentPassword,
    newPassword: payload.newPassword,
    confirmPassword: payload.confirmPassword,
  };
  await api.post<void, typeof body>("/api/v1/users/change_password", body);
}

// auth
export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const res = await api.post<LoginResponse, LoginPayload>(
    "/api/v1/auth/login",
    payload
  );
  setAccessToken(res.accessToken);
  if (typeof window !== "undefined")
    localStorage.setItem("user", JSON.stringify(res.user));
  return res;
}

export async function logout(): Promise<void> {
  try {
    await api.post<void, unknown>("/api/v1/auth/logout", {});
  } finally {
    clearAccessToken();
  }
}

/**
 * Lưu ý: nếu BE yêu cầu quyền tạo user, có thể cần mở /auth/register.
 * UI vẫn gọi /users và hiển thị message phù hợp khi 403.
 */
export async function registerUser(payload: RegisterPayload): Promise<any> {
  return api.post<any, RegisterPayload>("/api/v1/users", payload);
}
