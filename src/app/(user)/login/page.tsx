import type { Metadata } from "next";
import { Suspense } from "react";
import PageViewTracker from "@/components/common/traffic/PageViewTracker";
import { LoginView } from "@/features/user/auth";

export const metadata: Metadata = {
  title: "Đăng nhập | Máy 2 Thì",
  description: "Đăng nhập tài khoản để mua hàng, theo dõi đơn hàng và nhận ưu đãi từ cửa hàng Cường Hoa.",
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
