import type { Metadata } from "next";
import { Suspense } from "react";
import PageViewTracker from "@/components/common/traffic/PageViewTracker";
import { ProfileCompleteView } from "@/features/user/auth";

export const metadata: Metadata = {
  title: "Hoàn thiện hồ sơ | Máy 2 Thì",
  description: "Cung cấp thêm thông tin để hoàn tất đăng ký tài khoản.",
  robots: { index: false },
};

export default function ProfileCompletePage() {
  return (
    <>
      <PageViewTracker />
      <Suspense fallback={<div>Đang tải...</div>}>
        <ProfileCompleteView />
      </Suspense>
    </>
  );
}
