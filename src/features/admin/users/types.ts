export interface User {
  id: number;
  username: string;
  email: string;
  phone: string;
  address: string;
  gender: string;
}

export interface PagedResp<T> {
  result: T[];
  meta: { page: number; pageSize: number; pages: number; total: number };
}
