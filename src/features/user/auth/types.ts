// Duy nhất 1 nơi định nghĩa type cho auth
export type Envelope<T> = { status: number; message?: any; data: T };

export type Gender = "Nam" | "Nữ" | "Khác";
export type AuthProvider = "LOCAL" | "GOOGLE" | "FACEBOOK";

export interface User {
  id: number;
  username: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  gender?: Gender | null;
  picture?: string | null;
  provider?: AuthProvider;
  emailVerified?: boolean;
  profileComplete?: boolean; // phone đã nhập chưa
}

export type UserAccount = User;

export type LoginPayload = { email: string; password: string };

export type LoginUser = {
  id: number;
  email: string;
  name?: string;
  username?: string;
  role?: string;
  emailVerified?: boolean;
  picture?: string | null;
  provider?: AuthProvider;
  profileComplete?: boolean;
};

export type LoginResponse = { accessToken: string; user: LoginUser };

export type RegisterPayload = {
  username: string;
  email: string;
  password: string;
  phone: string;
  address?: string;
  gender?: Gender | string;
};

export type ChangePasswordInput = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type ForgotPasswordPayload = { email: string };

export type ResetPasswordPayload = {
  token: string;
  newPassword: string;
};

export type ProfileCompletePayload = {
  phone: string;
  address?: string;
  gender?: Gender | string;
};
