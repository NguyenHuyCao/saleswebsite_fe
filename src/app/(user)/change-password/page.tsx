import ChangePasswordForm from "@/components/change_password/ChangePasswordForm";
// import FreezeScrollOnReload from "@/components/common/FreezeScrollOnReload";
import PageViewTracker from "@/components/common/traffic/PageViewTracker";

export default function ChangePasswordPage() {
  let userId: number | null = null;
  let token: string | null = null;

  if (typeof window === "undefined") {
  } else {
    const user = localStorage.getItem("user");
    userId = user ? JSON.parse(user).id : null;
    token = localStorage.getItem("accessToken");
  }

  return (
    <>
      <PageViewTracker />
      <ChangePasswordForm userId={userId} token={token} />
      {/* <FreezeScrollOnReload /> */}
    </>
  );
}
