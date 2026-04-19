import type { Metadata } from "next";
import { Container } from "@mui/material";
import PageViewTracker from "@/components/common/traffic/PageViewTracker";
import { ChangePasswordView } from "@/features/user/auth";

export const metadata: Metadata = {
  title: "Đổi mật khẩu | Cường Hoa — Máy Công Cụ 2 Thì",
  description: "Thay đổi mật khẩu tài khoản Cường Hoa để bảo vệ thông tin của bạn.",
  robots: { index: false },
};

export default function ChangePasswordPage() {
  return (
    <Container maxWidth="md">
      <PageViewTracker />
      <ChangePasswordView />
    </Container>
  );
}
