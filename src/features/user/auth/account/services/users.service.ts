import { http } from "@/lib/api/http";
import type { Envelope } from "./types";
import type { User, UserAccount } from "./types";
import type { UserInfoInput } from "../schemas/user.schema";
import type { PasswordInput } from "../schemas/password.schema";

const unwrap = <T>(res: { data: Envelope<T> | any }) =>
  (res.data?.data ?? res.data) as T;

/** Lấy thông tin tài khoản hiện tại */
export async function fetchMe() {
  const res = await http.get<Envelope<UserAccount>>("/api/v1/auth/account");
  return unwrap<UserAccount>(res);
}

/** Cập nhật bản thân (me) */
export async function updateMe(
  payload: Pick<UserAccount, "username" | "phone" | "address" | "gender">
) {
  const res = await http.put<Envelope<UserAccount>>(
    "/api/v1/users/me",
    payload
  );
  return unwrap<UserAccount>(res);
}

/** Lấy user theo id (dùng cho trang setting theo id – admin) */
export async function getUserById(id: string) {
  const res = await http.get<Envelope<User>>(`/api/v1/users/${id}`);
  return unwrap<User>(res);
}

/** Cập nhật user theo id (admin) */
export async function updateUser(id: string, payload: UserInfoInput) {
  const res = await http.put<Envelope<User>>(`/api/v1/users/${id}`, payload);
  return unwrap<User>(res);
}

/** Đổi mật khẩu cho user bất kỳ (admin flow, cần id) */
export async function changePassword(id: string, payload: PasswordInput) {
  const body = {
    currentPassword: payload.currentPassword,
    newPassword: payload.newPassword,
    confirmPassword: payload.confirmNewPassword,
  };
  const res = await http.post<Envelope<unknown>>(
    `/api/v1/users/change_password?userId=${encodeURIComponent(id)}`,
    body
  );
  return unwrap(res);
}

/** Đổi mật khẩu cho chính mình (me flow) */
export async function changePasswordMe(payload: PasswordInput) {
  const body = {
    currentPassword: payload.currentPassword,
    newPassword: payload.newPassword,
    confirmPassword: payload.confirmNewPassword,
  };
  const res = await http.post<Envelope<unknown>>(
    `/api/v1/users/change_password`,
    body
  );
  return unwrap(res);
}
