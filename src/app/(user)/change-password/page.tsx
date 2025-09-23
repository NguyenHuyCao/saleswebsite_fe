import PageViewTracker from "@/components/common/traffic/PageViewTracker";
import { ChangePasswordView } from "@/features/user/auth";

export default function ChangePasswordPage() {
  return (
    <>
      <PageViewTracker />
      <ChangePasswordView />
    </>
  );
}
