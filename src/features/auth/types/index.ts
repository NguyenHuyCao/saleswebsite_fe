export type LoginPayload = { email: string; password: string };
export type LoginUser = {
  id: number;
  email: string;
  name?: string;
  username?: string;
};
export type LoginResponse = { accessToken: string; user: LoginUser };
export type Envelope<T> = { status: number; message?: any; data: T };
