// Duy nhất 1 nơi định nghĩa User
export type Gender = "Nam" | "Nữ" | "Khác";

export interface User {
  id: number;
  username: string;
  email: string;
  phone?: string | null; // <-- optional/nullable
  address?: string | null; // <-- optional/nullable
  gender?: Gender | null; // <-- optional/nullable
}

export type UserAccount = User;

export type Envelope<T> = { status: number; message?: any; data: T };
