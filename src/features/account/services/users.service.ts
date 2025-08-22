import { http } from "@/lib/http";
import { User } from "../types/user";
import { UserInfoInput } from "../schemas/user.schema";
import { PasswordInput } from "../schemas/password.schema";

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
