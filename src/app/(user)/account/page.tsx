import UserAccountPage from "@/components/account/UserAccountPage";
import PageViewTracker from "@/components/traffic/PageViewTracker";
import { Container } from "@mui/material";

const AccountPage = () => {
  return (
    <Container>
      <PageViewTracker />
      <UserAccountPage />
    </Container>
  );
};

export default AccountPage;
