import { NextResponse, NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

type Decoded = { role?: string | string[]; roles?: string[] };

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!pathname.startsWith("/admin")) return NextResponse.next();

  const token = req.cookies.get("accessToken")?.value;
  if (!token) return NextResponse.redirect(new URL("/login", req.url));

  try {
    const decoded = jwtDecode<Decoded>(token);
    const roles = new Set([
      ...(Array.isArray(decoded.role)
        ? decoded.role
        : decoded.role
        ? [decoded.role]
        : []),
      ...(decoded.roles || []),
    ]);

    if (roles.has("ADMIN") || roles.has("SUPER_ADMIN")) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/", req.url));
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = { matcher: ["/admin/:path*"] };
