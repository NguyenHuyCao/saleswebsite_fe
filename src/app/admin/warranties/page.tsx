import { Suspense } from "react";

import WarrantyManagementPage from "@/features/admin/warranty/components/WarrantyManagementPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WarrantyManagementPage />
    </Suspense>
  );
}
