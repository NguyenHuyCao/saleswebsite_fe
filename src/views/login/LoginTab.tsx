"use client";

import React, { useCallback, useState } from "react";
import {
  TextField,
  Button,
  Stack,
  InputAdornment,
  IconButton,
  Typography,
  Fade,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  CART_COUNT_KEY,
  WISHLIST_COUNT_KEY,
  ORDERS_COUNT_KEY,
} from "@/constants/apiKeys";
import { mutate } from "swr";

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

  const handleInputChange = useCallback(
    (field: "email" | "password", value: string) => {
      field === "email" ? setEmail(value) : setPassword(value);
    },
    []
  );

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: email.trim(),
            password: password.trim(),
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Đăng nhập thất bại");

      const { accessToken, user } = data.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("user", JSON.stringify(user));

      showMessage("success", "Đăng nhập thành công!");
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new Event("login"));

      mutate(CART_COUNT_KEY);
      mutate(WISHLIST_COUNT_KEY);
      mutate(ORDERS_COUNT_KEY);
      router.push("/");
    } catch (err: any) {
      const message = err?.message?.includes("fetch")
        ? "Không thể kết nối đến máy chủ."
        : err.message || "Lỗi không xác định";
      showMessage("error", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fade in timeout={500}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (canLogin && !loading) handleLogin();
        }}
      >
        <Stack
          spacing={2}
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <TextField
            label="Email"
            fullWidth
            size="small"
            value={email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            autoComplete="username"
          />
          <TextField
            label="Mật khẩu"
            type={showPassword ? "text" : "password"}
            fullWidth
            size="small"
            value={password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            autoComplete="current-password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)}
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
            sx={{
              bgcolor: "#ffb700",
              color: "#fff",
              fontWeight: 600,
              textTransform: "none",
              "&:hover": { bgcolor: "#f5a600" },
            }}
            disabled={!canLogin || loading}
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>

          <Typography
            mt={1}
            textAlign="center"
            fontSize={14}
            fontWeight={500}
            sx={{
              cursor: "pointer",
              textDecoration: "underline",
              color: "#1976d2",
              "&:hover": { opacity: 0.8 },
            }}
          >
            Quên mật khẩu?
          </Typography>
        </Stack>
      </form>
    </Fade>
  );
};

export default LoginTab;
