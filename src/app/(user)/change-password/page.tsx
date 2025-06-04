import ChangePasswordForm from "@/components/change_password/ChangePasswordForm";

export default function ChangePasswordPage() {
  let userId: number | null = null;
  let token: string | null = null;

  if (typeof window === "undefined") {
  } else {
    const user = localStorage.getItem("user");
    userId = user ? JSON.parse(user).id : null;
    token = localStorage.getItem("accessToken");
  }

  return <ChangePasswordForm userId={userId} token={token} />;
}
