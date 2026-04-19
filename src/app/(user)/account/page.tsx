import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@mui/material";
import PageViewTracker from "@/components/common/traffic/PageViewTracker";
import UserAccountPage from "@/features/user/account/components/UserAccountPage";

export const metadata: Metadata = {
  title: "Tài khoản của tôi | Cường Hoa — Máy Công Cụ 2 Thì",
  description: "Quản lý thông tin cá nhân, đơn hàng và địa chỉ giao hàng tài khoản Cường Hoa.",
  robots: { index: false },
};

export default function Page() {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      <PageViewTracker />
      <Suspense fallback={<div>Đang tải...</div>}>
        <UserAccountPage />
      </Suspense>
    </Container>
  );
}
