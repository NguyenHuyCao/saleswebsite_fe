import type { Metadata } from "next";
import { Suspense } from "react";
import PageViewTracker from "@/components/common/traffic/PageViewTracker";
import { ResetPasswordView } from "@/features/user/auth";

export const metadata: Metadata = {
  title: "Đặt lại mật khẩu | Máy 2 Thì",
  description: "Tạo mật khẩu mới cho tài khoản Máy 2 Thì.",
  robots: { index: false },
};

export default function ResetPasswordPage() {
  return (
    <>
      <PageViewTracker />
      <Suspense fallback={<div>Đang tải...</div>}>
        <ResetPasswordView />
      </Suspense>
    </>
  );
}
