import ChangePasswordForm from "@/components/change_password/ChangePasswordForm";
// import FreezeScrollOnReload from "@/components/common/FreezeScrollOnReload";
import PageViewTracker from "@/components/common/traffic/PageViewTracker";
export default function ChangePasswordPage() {
  return (
    <>
      <PageViewTracker />
      <ChangePasswordForm />
    </>
  );
}
