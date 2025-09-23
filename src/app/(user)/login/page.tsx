import { Suspense } from "react";
import PageViewTracker from "@/components/common/traffic/PageViewTracker";
import { LoginView } from "@/features/user/auth";

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
