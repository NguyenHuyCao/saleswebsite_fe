import type { Metadata } from "next";
import { Suspense } from "react";
import PageViewTracker from "@/components/common/traffic/PageViewTracker";
import { ForgotPasswordView } from "@/features/user/auth";

export const metadata: Metadata = {
  title: "Quên mật khẩu | Máy 2 Thì",
  description: "Đặt lại mật khẩu tài khoản Máy 2 Thì.",
  robots: { index: false },
};

export default function ForgotPasswordPage() {
  return (
    <>
      <PageViewTracker />
      <Suspense fallback={<div>Đang tải...</div>}>
        <ForgotPasswordView />
      </Suspense>
    </>
  );
}
