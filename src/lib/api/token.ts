// src/lib/api/token.ts
const KEY = "accessToken";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(KEY);
}
export function setAccessToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) localStorage.setItem(KEY, token);
  else localStorage.removeItem(KEY);
}
export function clearAccessToken() {
  setAccessToken(null);
  if (typeof window !== "undefined") localStorage.removeItem("user");
}
