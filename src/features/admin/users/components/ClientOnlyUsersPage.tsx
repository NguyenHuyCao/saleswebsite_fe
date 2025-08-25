// src/features/admin/users/components/ClientOnlyUsersPage.tsx
"use client";

import { useSearchParams } from "next/navigation";
import UserTablePage from "./UserTablePage";
import MultiStepAccountPage from "./MultiStepAccountPage";

export default function ClientOnlyUsersPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  return userId ? <MultiStepAccountPage /> : <UserTablePage />;
}
