export interface User {
  id: number;
  username: string;
  email: string;
  phone: string | null;
  address: string | null;
  gender: string | null;
  picture: string | null;
  provider: "LOCAL" | "GOOGLE" | "FACEBOOK";
  role: "USER" | "ADMIN";
  emailVerified: boolean;
  profileComplete: boolean;
  active: boolean;
  createdAt: string;
}

export interface PagedResp<T> {
  result: T[];
  meta: { page: number; pageSize: number; pages: number; total: number };
}
