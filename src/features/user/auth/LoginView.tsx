"use client";

import { useEffect, useState, useCallback } from "react";
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
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Container,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useLogin } from "./hooks/useLogin";
import { useRegister } from "./hooks/useRegister";

const provincesData: Record<string, string[]> = {
  "Hà Nội": ["Ba Đình", "Hoàn Kiếm", "Đống Đa"],
  "Hồ Chí Minh": ["Quận 1", "Quận 3", "Quận 5"],
  "Đà Nẵng": ["Hải Châu", "Thanh Khê", "Liên Chiểu"],
};

export default function LoginView() {
  const [tab, setTab] = useState(0);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    severity: "success" | "error";
    message: string;
  }>({ open: false, severity: "success", message: "" });

  const router = useRouter();
  const sp = useSearchParams();

  const showMessage = useCallback(
    (severity: "success" | "error", message: string) =>
      setSnackbar({ open: true, severity, message }),
    []
  );

  // LOGIN
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const { mutateAsync: doLogin, isPending: loggingIn } = useLogin();

  // REGISTER
  const [reg, setReg] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    province: "",
    district: "",
    gender: "",
  });
  const [showRegPw, setShowRegPw] = useState(false);
  const [showRegConfirm, setShowRegConfirm] = useState(false);
  const { mutateAsync: doRegister, isPending: registering } = useRegister();

  useEffect(() => {
    const page = sp.get("page");
    setTab(page === "register" ? 1 : 0);
  }, [sp]);

  const handleChangeTab = (_: any, v: number) => {
    setTab(v);
    router.replace(`/login?page=${v === 1 ? "register" : "login"}`);
  };

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await doLogin({ email, password });
      showMessage("success", "Đăng nhập thành công!");
      router.push("/");
    } catch (err: any) {
      showMessage("error", err?.message || "Đăng nhập thất bại");
    }
  };

  const onRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (reg.password !== reg.confirmPassword) {
      showMessage("error", "Mật khẩu xác nhận không khớp");
      return;
    }
    try {
      await doRegister({
        username: reg.name,
        email: reg.email,
        password: reg.password,
        phone: reg.phone,
        address:
          reg.district && reg.province
            ? `${reg.district}, ${reg.province}`
            : "",
        gender: reg.gender,
      });
      showMessage("success", "Đăng ký thành công!");
      setTab(0);
      router.replace("/login?page=login");
      setEmail(reg.email);
      setPassword("");
    } catch (err: any) {
      const msg = err?.message?.includes("quyền")
        ? "Bạn không có quyền đăng ký. Liên hệ quản trị hoặc mở endpoint /auth/register."
        : err?.message || "Đăng ký thất bại";
      showMessage("error", msg);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
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
              <form onSubmit={onLogin}>
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
                    disabled={loggingIn}
                    sx={{
                      bgcolor: "#ffb700",
                      color: "#fff",
                      fontWeight: 600,
                      textTransform: "none",
                      "&:hover": { bgcolor: "#f5a000" },
                    }}
                  >
                    {loggingIn ? "Đang đăng nhập..." : "Đăng nhập"}
                  </Button>
                </Stack>
              </form>
            ) : (
              <form onSubmit={onRegister}>
                <Stack spacing={2}>
                  <TextField
                    label="Họ tên"
                    size="small"
                    fullWidth
                    value={reg.name}
                    onChange={(e) =>
                      setReg((s) => ({ ...s, name: e.target.value }))
                    }
                  />
                  <TextField
                    label="Số điện thoại"
                    size="small"
                    fullWidth
                    value={reg.phone}
                    onChange={(e) =>
                      setReg((s) => ({ ...s, phone: e.target.value }))
                    }
                  />

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormControl fullWidth size="small">
                        <InputLabel id="province-label">
                          Tỉnh/Thành phố
                        </InputLabel>
                        <Select
                          labelId="province-label"
                          value={reg.province}
                          label="Tỉnh/Thành phố"
                          onChange={(e) =>
                            setReg((s) => ({
                              ...s,
                              province: String(e.target.value),
                              district: "",
                            }))
                          }
                          MenuProps={{ disableScrollLock: true }}
                        >
                          {Object.keys(provincesData).map((p) => (
                            <MenuItem key={p} value={p}>
                              {p}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormControl fullWidth size="small">
                        <InputLabel id="district-label">Xã/Quận</InputLabel>
                        <Select
                          labelId="district-label"
                          value={reg.district}
                          label="Xã/Quận"
                          onChange={(e) =>
                            setReg((s) => ({
                              ...s,
                              district: String(e.target.value),
                            }))
                          }
                          disabled={!reg.province}
                          MenuProps={{ disableScrollLock: true }}
                        >
                          {(provincesData[reg.province] ?? []).map((d) => (
                            <MenuItem key={d} value={d}>
                              {d}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>

                  <FormControl fullWidth size="small">
                    <InputLabel id="gender-label">Giới tính</InputLabel>
                    <Select
                      labelId="gender-label"
                      value={reg.gender}
                      label="Giới tính"
                      onChange={(e) =>
                        setReg((s) => ({
                          ...s,
                          gender: String(e.target.value),
                        }))
                      }
                      MenuProps={{ disableScrollLock: true }}
                    >
                      <MenuItem value="Nam">Nam</MenuItem>
                      <MenuItem value="Nữ">Nữ</MenuItem>
                      <MenuItem value="Khác">Khác</MenuItem>
                    </Select>
                  </FormControl>

                  <TextField
                    label="Email"
                    size="small"
                    fullWidth
                    value={reg.email}
                    onChange={(e) =>
                      setReg((s) => ({ ...s, email: e.target.value }))
                    }
                  />
                  <TextField
                    label="Mật khẩu"
                    size="small"
                    fullWidth
                    value={reg.password}
                    type={showRegPw ? "text" : "password"}
                    onChange={(e) =>
                      setReg((s) => ({ ...s, password: e.target.value }))
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            edge="end"
                            onClick={() => setShowRegPw((p) => !p)}
                          >
                            {showRegPw ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    label="Xác nhận mật khẩu"
                    size="small"
                    fullWidth
                    value={reg.confirmPassword}
                    type={showRegConfirm ? "text" : "password"}
                    onChange={(e) =>
                      setReg((s) => ({ ...s, confirmPassword: e.target.value }))
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            edge="end"
                            onClick={() => setShowRegConfirm((p) => !p)}
                          >
                            {showRegConfirm ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={registering}
                    sx={{
                      bgcolor: "#ffb700",
                      color: "#fff",
                      fontWeight: 600,
                      textTransform: "none",
                      "&:hover": { bgcolor: "#f5a000" },
                    }}
                  >
                    {registering ? "Đang đăng ký..." : "Đăng ký"}
                  </Button>
                </Stack>
              </form>
            )}
          </Box>
        </Paper>
      </Fade>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((p) => ({ ...p, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((p) => ({ ...p, open: false }))}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
