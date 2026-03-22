import { api, http } from "@/lib/api/http";
import { clearAccessToken, setAccessToken } from "@/lib/api/token";
import type {
  ForgotPasswordPayload,
  LoginPayload,
  LoginResponse,
  ProfileCompletePayload,
  RegisterPayload,
  ResetPasswordPayload,
  UserAccount,
  ChangePasswordInput,
} from "./types";

// ── Profile ───────────────────────────────────────────────────────────────

export async function fetchMe(): Promise<UserAccount> {
  return api.get<UserAccount>("/api/v1/auth/account");
}

export async function updateMe(payload: Partial<UserAccount>): Promise<UserAccount> {
  return api.put<UserAccount, Partial<UserAccount>>("/api/v1/users/me", payload);
}

export async function changePasswordMe(payload: ChangePasswordInput): Promise<void> {
  await http.post("/api/v1/users/change_password", payload);
}

/** Hoàn thiện hồ sơ cho OAuth users (thêm phone, address, gender). */
export async function completeProfile(payload: ProfileCompletePayload): Promise<UserAccount> {
  return api.post<UserAccount, ProfileCompletePayload>("/api/v1/users/me/complete-profile", payload);
}

// ── Auth ─────────────────────────────────────────────────────────────────

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const res = await api.post<LoginResponse, LoginPayload>("/api/v1/auth/login", payload);
  setAccessToken(res.accessToken);
  if (typeof window !== "undefined")
    localStorage.setItem("user", JSON.stringify(res.user));
  return res;
}

export async function logout(): Promise<void> {
  try {
    await http.post("/api/v1/auth/logout");
  } finally {
    clearAccessToken();
    if (typeof window !== "undefined") localStorage.removeItem("user");
  }
}

/**
 * Đăng ký tài khoản mới — gọi PUBLIC endpoint /auth/register.
 * Sau khi đăng ký, BE gửi email xác thực; FE hiển thị thông báo.
 */
export async function registerUser(payload: RegisterPayload): Promise<void> {
  await http.post("/api/v1/auth/register", payload);
}

// ── Email verification ────────────────────────────────────────────────────

export async function verifyEmail(token: string): Promise<{ message: string }> {
  return api.get<{ message: string }>(`/api/v1/auth/verify-email?token=${encodeURIComponent(token)}`);
}

export async function resendVerification(): Promise<void> {
  await http.post("/api/v1/auth/resend-verification");
}

// ── Forgot / Reset password ───────────────────────────────────────────────

export async function forgotPassword(payload: ForgotPasswordPayload): Promise<void> {
  await http.post("/api/v1/auth/forgot-password", payload);
}

export async function resetPassword(payload: ResetPasswordPayload): Promise<void> {
  await http.post("/api/v1/auth/reset-password", payload);
}
