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
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const canLogin = email.trim() && password.trim();

  const handleLogin = async () => {
    setLoading(true);
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

      const token = data.data.accessToken;
      const user = data.data.user;

      // Chỉ lưu vào localStorage
      localStorage.setItem("accessToken", token);
      localStorage.setItem("user", JSON.stringify(user));

      showMessage("success", "Đăng nhập thành công!");
      router.push("/");
    } catch (err: any) {
      const msg = err?.message?.includes("Failed to fetch")
        ? "Không thể kết nối tới máy chủ"
        : err.message || "Lỗi không xác định";
      showMessage("error", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (canLogin && !loading) handleLogin();
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
          disabled={!canLogin || loading}
        >
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
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
