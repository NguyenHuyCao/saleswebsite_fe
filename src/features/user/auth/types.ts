// Duy nhất 1 nơi định nghĩa type cho auth
export type Envelope<T> = { status: number; message?: any; data: T };

export type Gender = "Nam" | "Nữ" | "Khác";

export interface User {
  id: number;
  username: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  gender?: Gender | null;
}

export type UserAccount = User;

export type LoginPayload = { email: string; password: string };
export type LoginUser = {
  id: number;
  email: string;
  name?: string;
  username?: string;
};
export type LoginResponse = { accessToken: string; user: LoginUser };

export type RegisterPayload = {
  username: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  gender?: Gender | string;
};

export type ChangePasswordInput = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};
