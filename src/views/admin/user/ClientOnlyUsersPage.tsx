"use client";

import MultiStepAccountPage from "@/features/admin/users/components/MultiStepAccountPage";
import UserTablePage from "@/views/admin/user/UserTablePage";
import { useSearchParams } from "next/navigation";

const ClientOnlyUsersPage = () => {
  const searchParams = useSearchParams();
  const page = searchParams.get("userId");

  if (!page) {
    return <UserTablePage />;
  }

  return <MultiStepAccountPage />;
};

export default ClientOnlyUsersPage;
