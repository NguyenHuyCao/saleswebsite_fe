export type Gender = "Nam" | "Nữ" | "Khác" | "";

export type User = {
  id: number;
  username: string;
  email: string;
  phone?: string;
  address?: string;
  gender?: Gender;
};

export type UserAccount = User;

export type Envelope<T> = { status: number; message?: any; data: T };
