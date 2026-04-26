import type { Metadata } from "next";
import { Suspense } from "react";
import PageViewTracker from "@/components/common/traffic/PageViewTracker";
import { LoginView } from "@/features/user/auth";

export const metadata: Metadata = {
  title: "Đăng nhập | Cường Hoa — Máy Công Cụ 2 Thì",
  description: "Đăng nhập tài khoản Cường Hoa để mua hàng, theo dõi đơn hàng và nhận ưu đãi máy cắt cỏ, máy cưa, máy phát điện chính hãng.",
  robots: { index: false },
};

export default function LoginPage() {
  return (
    <>
      <PageViewTracker />
      <Suspense fallback={<div>Đang tải...</div>}>
        <LoginView />
      </Suspense>
    </>
  );
}
