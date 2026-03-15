// features/user/account/types.ts
export type Gender = "Nam" | "Nữ" | "Khác";

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  phone: string;
  address: string;
  gender: Gender;
  birthDate?: string; // ISO format date string (optional)
  avatar?: string; // optional
  createdAt?: string; // optional
}

export interface UserStats {
  totalOrders: number;
  wishlistCount: number;
  totalSpent: number;
}
