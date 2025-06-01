"use client";

import React, { useState } from "react";
import {
  TextField,
  Button,
  Stack,
  InputAdornment,
  IconButton,
  Typography,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useRouter } from "next/navigation";

interface LoginTabProps {
  showMessage: (severity: "success" | "error", message: string) => void;
}

const LoginTab: React.FC<LoginTabProps> = ({ showMessage }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const canLogin = email.trim() && password.trim();

  const router = useRouter();

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
      setEmail("");
      setPassword("");

      router.push("/"); // 👉 Điều hướng về trang chủ
    } catch (err: any) {
      showMessage("error", err.message);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (canLogin) handleLogin();
      }}
    >
      <Stack spacing={2}>
        <TextField
          label="Email"
          fullWidth
          size="small"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Mật khẩu"
          type={showPassword ? "text" : "password"}
          fullWidth
          size="small"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button
          fullWidth
          type="submit"
          variant="contained"
          sx={{ bgcolor: "#ffb700", color: "#fff", fontWeight: 600 }}
          disabled={!canLogin}
        >
          Đăng nhập
        </Button>
      </Stack>

      <Typography
        mt={2}
        textAlign="center"
        fontSize={14}
        fontWeight={500}
        sx={{ cursor: "pointer", textDecoration: "underline" }}
      >
        Quên mật khẩu?
      </Typography>
    </form>
  );
};

export default LoginTab;
