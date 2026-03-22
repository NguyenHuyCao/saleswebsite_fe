import type { Metadata } from "next";
import { Suspense } from "react";
import { OAuth2CallbackView } from "@/features/user/auth";

export const metadata: Metadata = {
  title: "Đăng nhập | Máy 2 Thì",
  robots: { index: false },
};

export default function OAuth2CallbackPage() {
  return (
    <Suspense fallback={<div>Đang xử lý...</div>}>
      <OAuth2CallbackView />
    </Suspense>
  );
}
