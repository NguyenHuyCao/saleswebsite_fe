import { Suspense } from "react";

import ClientOnlyUsersPage from "@/features/admin/users/components/ClientOnlyUsersPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientOnlyUsersPage />
    </Suspense>
  );
}
