import LoginForm from "@/components/login/app.login";
import { Container } from "@mui/material";

const LoginPage = () => {
  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <LoginForm />
    </Container>
  );
};

export default LoginPage;
