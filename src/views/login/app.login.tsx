"use client";

import { useState, useCallback } from "react";
import {
  Box,
  Tab,
  Tabs,
  Typography,
  Paper,
  Snackbar,
  Alert,
  Fade,
  Stack,
  TextField,
  Button,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useLogin } from "@/features/auth/hooks/useLogin";

const LoginForm = () => {
  const [tab, setTab] = useState(0);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    severity: "success" | "error";
    message: string;
  }>({ open: false, severity: "success", message: "" });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { mutateAsync, isPending } = useLogin();

  const handleChangeTab = (_: any, newValue: number) => {
    setTab(newValue);
    const page = newValue === 1 ? "register" : "login";
    router.replace(`/login?page=${page}`);
  };

  const showMessage = useCallback(
    (severity: "success" | "error", message: string) => {
      setSnackbar({ open: true, severity, message });
    },
    []
  );

  // đồng bộ ?page
  const page = searchParams.get("page");
  if (page === "register" && tab !== 1) setTab(1);
  if (page === "login" && tab !== 0) setTab(0);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await mutateAsync({ email, password });
      showMessage("success", "Đăng nhập thành công!");
      router.push("/"); // hoặc /account
    } catch (err: any) {
      showMessage("error", err.message || "Đăng nhập thất bại");
    }
  };

  return (
    <>
      <Fade in timeout={500}>
        <Paper
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          elevation={3}
          sx={{
            borderRadius: 2,
            overflow: "hidden",
            margin: "auto",
            maxWidth: 500,
            width: "100%",
            my: 4,
          }}
        >
          <Tabs
            value={tab}
            onChange={handleChangeTab}
            centered
            variant="fullWidth"
            sx={{
              "& .MuiTab-root": { fontWeight: "bold" },
              "& .Mui-selected": { color: "#fbbf24" },
              "& .MuiTabs-indicator": { backgroundColor: "#ffb700" },
            }}
          >
            <Tab label="ĐĂNG NHẬP" />
            <Tab label="ĐĂNG KÝ" />
          </Tabs>

          <Box sx={{ p: 4, bgcolor: "#f9f9f9" }}>
            <Typography
              variant="h6"
              textAlign="center"
              fontWeight="bold"
              mb={3}
            >
              {tab === 0 ? "ĐĂNG NHẬP" : "ĐĂNG KÝ"}
            </Typography>

            {tab === 0 ? (
              <form onSubmit={onSubmit}>
                <Stack spacing={2}>
                  <TextField
                    label="Email"
                    size="small"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <TextField
                    label="Mật khẩu"
                    size="small"
                    fullWidth
                    value={password}
                    type={showPw ? "text" : "password"}
                    onChange={(e) => setPassword(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            edge="end"
                            onClick={() => setShowPw((p) => !p)}
                          >
                            {showPw ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isPending}
                    sx={{
                      bgcolor: "#ffb700",
                      color: "#fff",
                      fontWeight: 600,
                      textTransform: "none",
                      "&:hover": { bgcolor: "#f5a000" },
                    }}
                  >
                    {isPending ? "Đang đăng nhập..." : "Đăng nhập"}
                  </Button>
                </Stack>
              </form>
            ) : (
              // giữ chỗ cho Register tab hiện tại của bạn
              <div>Form đăng ký giữ nguyên ở phần khác.</div>
            )}
          </Box>
        </Paper>
      </Fade>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default LoginForm;
