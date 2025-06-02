import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { token } = await req.json();

  const response = NextResponse.json({ message: "Token saved to cookie" });

  response.cookies.set("accessToken", token, {
    httpOnly: false, // nếu cần server đọc nhưng vẫn client-side access được thì để false
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 1 ngày
  });

  return response;
}
