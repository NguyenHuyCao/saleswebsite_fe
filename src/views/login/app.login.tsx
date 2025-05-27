"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import GoogleIcon from "@mui/icons-material/Google";
import { useRouter, useSearchParams } from "next/navigation";

const LoginForm = () => {
  const [tab, setTab] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailRegister, setEmailRegister] = useState("");
  const [passwordRegister, setPasswordRegister] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();

  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  const handleCloseToken = async () => {
    const accessToken = localStorage?.getItem("accessToken");
    if (accessToken) {
      await fetch("http://localhost:8080/api/v1/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
    }
  };

  useEffect(() => {
    handleCloseToken();
  }, []);

  useEffect(() => {
    const page = searchParams.get("page");
    if (page === "register") setTab(1);
    else if (page === "login") setTab(0);
  }, [searchParams]);

  const handleChange = (_: any, newValue: number) => setTab(newValue);

  const showMessage = (severity: "success" | "error", message: string) => {
    setSnackbar({ open: true, severity, message });
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setName("");
    setPhone("");
    setAddress("");
    setEmailRegister("");
    setPasswordRegister("");
  };

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: email.trim(),
          password: password.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Đăng nhập thất bại");

      localStorage.setItem("accessToken", data.data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.data.user));

      showMessage("success", "Đăng nhập thành công!");
      resetForm();
    } catch (err: any) {
      showMessage("error", err.message);
    }
  };

  const handleRegister = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/v1/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: name.trim(),
          email: emailRegister.trim(),
          password: passwordRegister.trim(),
          phone: phone.trim(),
          address: address.trim(),
        }),
      });

      const data = await res.json();

      if (res.status === 201) {
        showMessage("success", "Đăng ký thành công!");
        resetForm();
        setTab(0); // chuyển về tab đăng nhập
      } else {
        throw new Error(data.message || "Đăng ký thất bại");
      }
    } catch (err: any) {
      showMessage("error", err.message);
    }
  };

  const canLogin = email.trim() && password.trim();
  const canRegister =
    name.trim() &&
    emailRegister.trim() &&
    passwordRegister.trim() &&
    phone.trim() &&
    address.trim();

  return (
    <>
      <Paper
        elevation={2}
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          margin: "auto",
          maxWidth: 450,
          width: "100%",
          my: 2,
          mt: -2,
        }}
      >
        <Tabs
          value={tab}
          onChange={handleChange}
          centered
          variant="fullWidth"
          sx={{
            "& .MuiTab-root": { fontWeight: "bold" },
            "& .Mui-selected": { color: "#fbbf24" },
            "& .MuiTabs-indicator": { backgroundColor: "#ffb700" },
          }}
        >
          <Tab
            label="ĐĂNG NHẬP"
            onClick={() => router.push(`/login?page=login`)}
          />
          <Tab
            label="ĐĂNG KÝ"
            onClick={() => router.push(`/login?page=register`)}
          />
        </Tabs>

        <Box sx={{ p: 4, bgcolor: "#f3f3f3" }}>
          <Typography variant="h6" textAlign="center" fontWeight="bold" mb={3}>
            {tab === 0 ? "ĐĂNG NHẬP" : "ĐĂNG KÝ"}
          </Typography>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (tab === 0 && canLogin) handleLogin();
              if (tab === 1 && canRegister) handleRegister();
            }}
          >
            <Stack spacing={2}>
              {tab === 1 && (
                <>
                  <TextField
                    label="Họ tên"
                    fullWidth
                    size="small"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <TextField
                    label="Số điện thoại"
                    fullWidth
                    size="small"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <TextField
                    label="Địa chỉ"
                    fullWidth
                    size="small"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                  <TextField
                    label="Email"
                    fullWidth
                    size="small"
                    value={emailRegister}
                    onChange={(e) => setEmailRegister(e.target.value)}
                  />
                  <TextField
                    label="Mật khẩu"
                    type="password"
                    fullWidth
                    size="small"
                    value={passwordRegister}
                    onChange={(e) => setPasswordRegister(e.target.value)}
                  />
                </>
              )}
              {tab === 0 && (
                <>
                  <TextField
                    label="Email"
                    fullWidth
                    size="small"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <TextField
                    label="Mật khẩu"
                    type="password"
                    fullWidth
                    size="small"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </>
              )}

              <Button
                fullWidth
                type="submit"
                variant="contained"
                sx={{ bgcolor: "#ffb700", color: "#fff", fontWeight: 600 }}
                disabled={tab === 0 ? !canLogin : !canRegister}
              >
                {tab === 0 ? "Đăng nhập" : "Đăng ký"}
              </Button>
            </Stack>
          </form>

          {tab === 0 && (
            <Typography
              mt={2}
              textAlign="center"
              fontSize={14}
              fontWeight={500}
              sx={{ cursor: "pointer", textDecoration: "underline" }}
            >
              Quên mật khẩu?
            </Typography>
          )}

          <Typography mt={2} textAlign="center" fontSize={14} fontWeight={500}>
            Hoặc đăng nhập bằng
          </Typography>

          <Stack direction="row" spacing={2} justifyContent="center" mt={2}>
            <Button
              startIcon={<FacebookIcon />}
              variant="contained"
              sx={{ bgcolor: "#3b5998", textTransform: "none" }}
            >
              Facebook
            </Button>
            <Button
              startIcon={<GoogleIcon />}
              variant="contained"
              sx={{ bgcolor: "#db4437", textTransform: "none" }}
            >
              Google
            </Button>
          </Stack>
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ mt: 5, zIndex: 9999 }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity as any}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default LoginForm;
