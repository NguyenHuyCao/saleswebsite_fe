import PageViewTracker from "@/components/common/traffic/PageViewTracker";
import { ChangePasswordView } from "@/features/user/auth/account";

export default function ChangePasswordPage() {
  return (
    <>
      <PageViewTracker />
      <ChangePasswordView />
    </>
  );
}
