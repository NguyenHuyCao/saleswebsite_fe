export type User = {
  id: number;
  username: string;
  email: string;
  phone: string;
  address: string;
  gender: string;
};

export type UserAccount = {
  id: number;
  username: string;
  email: string;
  phone?: string;
  address?: string;
  gender?: string;
};
