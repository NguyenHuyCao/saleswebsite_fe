import PageViewTracker from "@/components/traffic/PageViewTracker";
import LoginForm from "@/views/login/app.login";
import { Container } from "@mui/material";

const LoginPage = async () => {
  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <PageViewTracker />
      <LoginForm />
    </Container>
  );
};

export default LoginPage;
