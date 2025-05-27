import LoginForm from "@/views/login/app.login";
import { Container } from "@mui/material";

const LoginPage = async () => {
  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <LoginForm />
    </Container>
  );
};

export default LoginPage;
