import { NextResponse, NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

type Decoded = {
  user?: { role?: string };
  role?: string | string[];
  exp?: number;
};

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!pathname.startsWith("/admin")) return NextResponse.next();

  // Access token may be stored in a client-side cookie (set by setAccessToken).
  // Fallback to the HttpOnly refresh_token cookie set by the BE.
  const token =
    req.cookies.get("accessToken")?.value ||
    req.cookies.get("refresh_token")?.value;

  if (!token) return NextResponse.redirect(new URL("/login", req.url));

  try {
    const decoded = jwtDecode<Decoded>(token);

    // Role is nested inside the "user" claim by the BE JWT builder.
    const role =
      decoded.user?.role ||
      (Array.isArray(decoded.role) ? decoded.role[0] : decoded.role);

    if (role === "ADMIN" || role === "SUPER_ADMIN") {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/", req.url));
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = { matcher: ["/admin/:path*"] };
