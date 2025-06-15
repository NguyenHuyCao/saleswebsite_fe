import UserAccountPage from "@/components/account/UserAccountPage";
// import FreezeScrollOnReload from "@/components/common/FreezeScrollOnReload";
import PageViewTracker from "@/components/common/traffic/PageViewTracker";
import { Container } from "@mui/material";

const AccountPage = () => {
  return (
    <Container>
      <PageViewTracker />
      <UserAccountPage />
      {/* <FreezeScrollOnReload /> */}
    </Container>
  );
};

export default AccountPage;
