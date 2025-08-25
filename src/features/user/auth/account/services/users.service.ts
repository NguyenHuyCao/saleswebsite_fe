import { http } from "@/lib/api/http";
import { User } from "../types";
import { UserInfoInput } from "../schemas/user.schema";
import { PasswordInput } from "../schemas/password.schema";
import type { UserAccount } from "../types";

type Env<T> = { status: number; message?: any; data: T };
const unwrap = <T>(res: { data: Env<T> | any }) =>
  (res.data?.data ?? res.data) as T;

export async function fetchMe() {
  const res = await http.get<Env<UserAccount>>("/api/v1/auth/account");
  return unwrap(res);
}

export async function updateMe(
  payload: Pick<UserAccount, "username" | "phone" | "address" | "gender">
) {
  const res = await http.put<Env<UserAccount>>("/api/v1/users/me", payload);
  return unwrap(res);
}

export const getUserById = async (id: string) => {
  const res = await http.get<{ status: number; data: User }>(
    `/api/v1/users/${id}`
  );
  return res.data.data;
};

export const updateUser = async (id: string, payload: UserInfoInput) => {
  const res = await http.put(`/api/v1/users/${id}`, payload);
  return res.data;
};

/** Đổi mật khẩu cho user bất kỳ (admin flow, cần id) */
export const changePassword = async (id: string, payload: PasswordInput) => {
  const body = {
    currentPassword: payload.currentPassword,
    newPassword: payload.newPassword,
    confirmPassword: payload.confirmNewPassword,
  };
  const res = await http.post(
    `/api/v1/users/change_password?userId=${id}`,
    body
  );
  return res.data;
};

/** Đổi mật khẩu cho chính mình (me flow, không cần id) */
export const changePasswordMe = async (payload: PasswordInput) => {
  const body = {
    currentPassword: payload.currentPassword,
    newPassword: payload.newPassword,
    confirmPassword: payload.confirmNewPassword,
  };
  const res = await http.post(`/api/v1/users/change_password`, body);
  return res.data;
};
