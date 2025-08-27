export type Gender = "Nam" | "Nữ" | "Khác" | "";

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  phone: string;
  address: string;
  gender: Gender;
}
