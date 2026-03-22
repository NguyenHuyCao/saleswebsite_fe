import type { Metadata } from "next";
import { Suspense } from "react";
import PageViewTracker from "@/components/common/traffic/PageViewTracker";
import { VerifyEmailView } from "@/features/user/auth";

export const metadata: Metadata = {
  title: "Xác thực email | Máy 2 Thì",
  description: "Xác thực địa chỉ email để kích hoạt tài khoản.",
  robots: { index: false },
};

export default function VerifyEmailPage() {
  return (
    <>
      <PageViewTracker />
      <Suspense fallback={<div>Đang tải...</div>}>
        <VerifyEmailView />
      </Suspense>
    </>
  );
}
