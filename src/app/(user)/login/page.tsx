import { Suspense } from "react";
import PageViewTracker from "@/components/common/traffic/PageViewTracker";
import LoginForm from "@/views/login/app.login";
import { Container } from "@mui/material";

const LoginPage = async () => {
  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <PageViewTracker />
      <Suspense fallback={<div>Đang tải...</div>}>
        <LoginForm />
      </Suspense>
    </Container>
  );
};

export default LoginPage;
