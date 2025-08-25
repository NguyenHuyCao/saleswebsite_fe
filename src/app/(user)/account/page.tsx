import { Suspense } from "react";
import { Container } from "@mui/material";
import PageViewTracker from "@/components/common/traffic/PageViewTracker";

import UserAccountPage from "@/features/user/account/components/UserAccountPage";

export default function Page() {
  return (
    <Container>
      <PageViewTracker />
      <Suspense fallback={<div>Loading...</div>}>
        <UserAccountPage />
      </Suspense>
    </Container>
  );
}
