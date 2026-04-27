const KEY = "accessToken";

const IS_PROD = process.env.NODE_ENV === "production";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(KEY);
}

export function setAccessToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) {
    localStorage.setItem(KEY, token);
    // Mirror into a JS-readable cookie so Next.js middleware can read the role.
    const secure = IS_PROD ? "; Secure" : "";
    document.cookie = `${KEY}=${token}; path=/; SameSite=Lax${secure}`;
  } else {
    localStorage.removeItem(KEY);
    document.cookie = `${KEY}=; path=/; max-age=0`;
  }
}

export function clearAccessToken() {
  setAccessToken(null);
  if (typeof window !== "undefined") localStorage.removeItem("user");
}
