"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Container,
  Checkbox,
  FormControlLabel,
  Link,
  Divider,
  Chip,
  Avatar,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// Icons
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import FacebookIcon from "@mui/icons-material/Facebook";
import GoogleIcon from "@mui/icons-material/Google";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { useLogin, useRegister } from "../queries";

// Password strength checker
const checkPasswordStrength = (
  password: string,
): {
  score: number;
  label: string;
  color: string;
  requirements: { met: boolean; text: string }[];
} => {
  const requirements = [
    { met: password.length >= 8, text: "Ít nhất 8 ký tự" },
    { met: /[A-Z]/.test(password), text: "Ít nhất 1 chữ hoa" },
    { met: /[a-z]/.test(password), text: "Ít nhất 1 chữ thường" },
    { met: /[0-9]/.test(password), text: "Ít nhất 1 số" },
    { met: /[^A-Za-z0-9]/.test(password), text: "Ít nhất 1 ký tự đặc biệt" },
  ];

  const metCount = requirements.filter((r) => r.met).length;

  let label = "Rất yếu";
  let color = "#f44336";

  if (metCount === 5) {
    label = "Rất mạnh";
    color = "#4caf50";
  } else if (metCount === 4) {
    label = "Mạnh";
    color = "#8bc34a";
  } else if (metCount === 3) {
    label = "Trung bình";
    color = "#ffc107";
  } else if (metCount === 2) {
    label = "Yếu";
    color = "#ff9800";
  }

  return {
    score: metCount,
    label,
    color,
    requirements,
  };
};

// Validation functions
const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validatePhone = (phone: string): boolean => {
  return /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(phone);
};

const provincesData: Record<string, string[]> = {
  "Hà Nội": ["Ba Đình", "Hoàn Kiếm", "Đống Đa", "Hai Bà Trưng"],
  "Hồ Chí Minh": ["Quận 1", "Quận 3", "Quận 5", "Quận 7", "Thủ Đức"],
  "Đà Nẵng": ["Hải Châu", "Thanh Khê", "Sơn Trà", "Ngũ Hành Sơn"],
  "Bắc Giang": ["Thành phố Bắc Giang", "Lục Nam", "Lục Ngạn", "Sơn Động"],
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
    [],
  );

  // LOGIN
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginErrors, setLoginErrors] = useState({ email: "", password: "" });
  const { mutateAsync: doLogin, isPending: loggingIn } = useLogin();

  // REGISTER - Chia làm 2 bước
  const [activeStep, setActiveStep] = useState(0);
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
  const [regErrors, setRegErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showRegPw, setShowRegPw] = useState(false);
  const [showRegConfirm, setShowRegConfirm] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const { mutateAsync: doRegister, isPending: registering } = useRegister();

  const passwordStrength = useMemo(
    () => checkPasswordStrength(reg.password),
    [reg.password],
  );

  useEffect(() => {
    setTab(sp.get("page") === "register" ? 1 : 0);
  }, [sp]);

  const handleChangeTab = (_: any, v: number) => {
    setTab(v);
    router.replace(`/login?page=${v === 1 ? "register" : "login"}`);
  };

  // Validation for login
  const validateLogin = (): boolean => {
    const errors = { email: "", password: "" };
    let isValid = true;

    if (!email) {
      errors.email = "Email không được để trống";
      isValid = false;
    } else if (!validateEmail(email)) {
      errors.email = "Email không hợp lệ";
      isValid = false;
    }

    if (!password) {
      errors.password = "Mật khẩu không được để trống";
      isValid = false;
    }

    setLoginErrors(errors);
    return isValid;
  };

  // Validation for register step 1
  const validateStep1 = (): boolean => {
    const errors: Record<string, string> = {};
    let isValid = true;

    if (!reg.name) {
      errors.name = "Họ tên không được để trống";
      isValid = false;
    }

    if (!reg.email) {
      errors.email = "Email không được để trống";
      isValid = false;
    } else if (!validateEmail(reg.email)) {
      errors.email = "Email không hợp lệ";
      isValid = false;
    }

    if (!reg.phone) {
      errors.phone = "Số điện thoại không được để trống";
      isValid = false;
    } else if (!validatePhone(reg.phone)) {
      errors.phone = "Số điện thoại không hợp lệ";
      isValid = false;
    }

    setRegErrors(errors);
    return isValid;
  };

  // Validation for register step 2
  const validateStep2 = (): boolean => {
    const errors: Record<string, string> = {};
    let isValid = true;

    if (!reg.password) {
      errors.password = "Mật khẩu không được để trống";
      isValid = false;
    } else if (reg.password.length < 6) {
      errors.password = "Mật khẩu phải có ít nhất 6 ký tự";
      isValid = false;
    }

    if (!reg.confirmPassword) {
      errors.confirmPassword = "Vui lòng xác nhận mật khẩu";
      isValid = false;
    } else if (reg.password !== reg.confirmPassword) {
      errors.confirmPassword = "Mật khẩu xác nhận không khớp";
      isValid = false;
    }

    if (passwordStrength.score < 3) {
      errors.password = "Mật khẩu quá yếu, vui lòng chọn mật khẩu mạnh hơn";
      isValid = false;
    }

    setRegErrors(errors);
    return isValid;
  };

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateLogin()) return;

    try {
      await doLogin({ email, password });
      showMessage("success", "Đăng nhập thành công!");

      // Save email if remember me
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      router.push("/");
    } catch (err: any) {
      showMessage("error", err?.message || "Email hoặc mật khẩu không đúng");
    }
  };

  const onRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (activeStep === 0) {
      if (validateStep1()) {
        setActiveStep(1);
      }
      return;
    }

    if (!validateStep2()) return;
    if (!agreeTerms) {
      showMessage("error", "Vui lòng đồng ý với điều khoản sử dụng");
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
        ? "Bạn không có quyền đăng ký. Liên hệ quản trị viên."
        : err?.message || "Đăng ký thất bại";
      showMessage("error", msg);
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={4} alignItems="center">
        {/* Left side - Hero Image & Benefits */}
        <Grid size={{ xs: 12, md: 6 }}>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Box sx={{ p: 4, textAlign: "center" }}>
              <Image
                src="/images/banner/istockphoto-1639694829-612x612.jpg"
                alt="Login illustration"
                width={400}
                height={300}
                style={{ maxWidth: "100%", height: "auto" }}
              />

              <Typography
                variant="h4"
                fontWeight={800}
                sx={{ mt: 4, color: "#333" }}
              >
                Chào mừng bạn đến với
              </Typography>
              <Typography
                variant="h3"
                fontWeight={900}
                sx={{ color: "#f25c05", mb: 3 }}
              >
                DolaTool
              </Typography>

              <Stack spacing={2} sx={{ maxWidth: 400, mx: "auto" }}>
                {[
                  "✅ Hàng chính hãng 100%",
                  "🚚 Miễn phí vận chuyển toàn quốc",
                  "🔧 Bảo hành lên đến 12 tháng",
                  "🎁 Ưu đãi thành viên hấp dẫn",
                ].map((benefit, idx) => (
                  <Typography
                    key={idx}
                    variant="body1"
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    {benefit}
                  </Typography>
                ))}
              </Stack>
            </Box>
          </motion.div>
        </Grid>

        {/* Right side - Login/Register Form */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Fade in timeout={500}>
            <Paper
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              elevation={3}
              sx={{
                borderRadius: 4,
                overflow: "hidden",
                maxWidth: 500,
                mx: "auto",
              }}
            >
              <Tabs
                value={tab}
                onChange={handleChangeTab}
                variant="fullWidth"
                sx={{
                  "& .MuiTab-root": {
                    fontWeight: 700,
                    py: 2,
                    fontSize: "1rem",
                  },
                  "& .Mui-selected": { color: "#f25c05" },
                  "& .MuiTabs-indicator": {
                    backgroundColor: "#f25c05",
                    height: 3,
                  },
                }}
              >
                <Tab label="ĐĂNG NHẬP" />
                <Tab label="ĐĂNG KÝ" />
              </Tabs>

              <Box sx={{ p: 4, bgcolor: "#fff" }}>
                {tab === 0 ? (
                  /* LOGIN FORM */
                  <form onSubmit={onLogin}>
                    <Stack spacing={3}>
                      <TextField
                        fullWidth
                        label="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={() => handleBlur("loginEmail")}
                        error={!!loginErrors.email}
                        helperText={loginErrors.email}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailIcon sx={{ color: "#999" }} />
                            </InputAdornment>
                          ),
                        }}
                      />

                      <TextField
                        fullWidth
                        label="Mật khẩu"
                        type={showPw ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onBlur={() => handleBlur("loginPassword")}
                        error={!!loginErrors.password}
                        helperText={loginErrors.password}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockIcon sx={{ color: "#999" }} />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowPw(!showPw)}
                                edge="end"
                              >
                                {showPw ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />

                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={rememberMe}
                              onChange={(e) => setRememberMe(e.target.checked)}
                              sx={{ color: "#f25c05" }}
                            />
                          }
                          label="Ghi nhớ đăng nhập"
                        />
                        <Link
                          href="/forgot-password"
                          sx={{
                            color: "#f25c05",
                            textDecoration: "none",
                            fontWeight: 500,
                            "&:hover": { textDecoration: "underline" },
                          }}
                        >
                          Quên mật khẩu?
                        </Link>
                      </Stack>

                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={loggingIn}
                        sx={{
                          bgcolor: "#f25c05",
                          color: "#fff",
                          fontWeight: 700,
                          py: 1.5,
                          fontSize: "1rem",
                          "&:hover": { bgcolor: "#e64a19" },
                        }}
                      >
                        {loggingIn ? (
                          <CircularProgress size={24} color="inherit" />
                        ) : (
                          "Đăng nhập"
                        )}
                      </Button>

                      <Divider>
                        <Chip label="Hoặc đăng nhập với" size="small" />
                      </Divider>

                      <Stack direction="row" spacing={2}>
                        <Button
                          fullWidth
                          variant="outlined"
                          startIcon={<FacebookIcon />}
                          sx={{
                            borderColor: "#1877f2",
                            color: "#1877f2",
                            "&:hover": { bgcolor: "#e7f0ff" },
                          }}
                        >
                          Facebook
                        </Button>
                        <Button
                          fullWidth
                          variant="outlined"
                          startIcon={<GoogleIcon />}
                          sx={{
                            borderColor: "#db4437",
                            color: "#db4437",
                            "&:hover": { bgcolor: "#fee8e7" },
                          }}
                        >
                          Google
                        </Button>
                      </Stack>
                    </Stack>
                  </form>
                ) : (
                  /* REGISTER FORM - Multi-step */
                  <form onSubmit={onRegister}>
                    <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                      <Step>
                        <StepLabel>Thông tin cơ bản</StepLabel>
                      </Step>
                      <Step>
                        <StepLabel>Bảo mật</StepLabel>
                      </Step>
                    </Stepper>

                    <AnimatePresence mode="wait">
                      {activeStep === 0 ? (
                        <motion.div
                          key="step1"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Stack spacing={2.5}>
                            <TextField
                              fullWidth
                              label="Họ và tên *"
                              value={reg.name}
                              onChange={(e) =>
                                setReg({ ...reg, name: e.target.value })
                              }
                              onBlur={() => handleBlur("name")}
                              error={touched.name && !!regErrors.name}
                              helperText={touched.name && regErrors.name}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <PersonIcon sx={{ color: "#999" }} />
                                  </InputAdornment>
                                ),
                              }}
                            />

                            <TextField
                              fullWidth
                              label="Email *"
                              type="email"
                              value={reg.email}
                              onChange={(e) =>
                                setReg({ ...reg, email: e.target.value })
                              }
                              onBlur={() => handleBlur("email")}
                              error={touched.email && !!regErrors.email}
                              helperText={touched.email && regErrors.email}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <EmailIcon sx={{ color: "#999" }} />
                                  </InputAdornment>
                                ),
                              }}
                            />

                            <TextField
                              fullWidth
                              label="Số điện thoại *"
                              value={reg.phone}
                              onChange={(e) =>
                                setReg({ ...reg, phone: e.target.value })
                              }
                              onBlur={() => handleBlur("phone")}
                              error={touched.phone && !!regErrors.phone}
                              helperText={touched.phone && regErrors.phone}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <PhoneIcon sx={{ color: "#999" }} />
                                  </InputAdornment>
                                ),
                              }}
                            />

                            <Grid container spacing={2}>
                              <Grid size={{ xs: 12, sm: 6 }}>
                                <FormControl fullWidth>
                                  <InputLabel>Tỉnh/Thành phố</InputLabel>
                                  <Select
                                    value={reg.province}
                                    label="Tỉnh/Thành phố"
                                    onChange={(e) =>
                                      setReg({
                                        ...reg,
                                        province: e.target.value,
                                        district: "",
                                      })
                                    }
                                  >
                                    <MenuItem value="">
                                      Chọn tỉnh/thành
                                    </MenuItem>
                                    {Object.keys(provincesData).map((p) => (
                                      <MenuItem key={p} value={p}>
                                        {p}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              </Grid>
                              <Grid size={{ xs: 12, sm: 6 }}>
                                <FormControl fullWidth>
                                  <InputLabel>Quận/Huyện</InputLabel>
                                  <Select
                                    value={reg.district}
                                    label="Quận/Huyện"
                                    onChange={(e) =>
                                      setReg({
                                        ...reg,
                                        district: e.target.value,
                                      })
                                    }
                                    disabled={!reg.province}
                                  >
                                    <MenuItem value="">
                                      Chọn quận/huyện
                                    </MenuItem>
                                    {(provincesData[reg.province] || []).map(
                                      (d) => (
                                        <MenuItem key={d} value={d}>
                                          {d}
                                        </MenuItem>
                                      ),
                                    )}
                                  </Select>
                                </FormControl>
                              </Grid>
                            </Grid>

                            <FormControl fullWidth>
                              <InputLabel>Giới tính</InputLabel>
                              <Select
                                value={reg.gender}
                                label="Giới tính"
                                onChange={(e) =>
                                  setReg({ ...reg, gender: e.target.value })
                                }
                              >
                                <MenuItem value="Nam">Nam</MenuItem>
                                <MenuItem value="Nữ">Nữ</MenuItem>
                                <MenuItem value="Khác">Khác</MenuItem>
                              </Select>
                            </FormControl>

                            <Button
                              fullWidth
                              variant="contained"
                              onClick={() => setActiveStep(1)}
                              sx={{
                                bgcolor: "#f25c05",
                                color: "#fff",
                                fontWeight: 600,
                                py: 1.5,
                              }}
                            >
                              Tiếp tục
                            </Button>
                          </Stack>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="step2"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Stack spacing={2.5}>
                            <TextField
                              fullWidth
                              label="Mật khẩu *"
                              type={showRegPw ? "text" : "password"}
                              value={reg.password}
                              onChange={(e) =>
                                setReg({ ...reg, password: e.target.value })
                              }
                              onBlur={() => handleBlur("password")}
                              error={touched.password && !!regErrors.password}
                              helperText={
                                touched.password && regErrors.password
                              }
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <LockIcon sx={{ color: "#999" }} />
                                  </InputAdornment>
                                ),
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton
                                      onClick={() => setShowRegPw(!showRegPw)}
                                      edge="end"
                                    >
                                      {showRegPw ? (
                                        <VisibilityOff />
                                      ) : (
                                        <Visibility />
                                      )}
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              }}
                            />

                            {reg.password && (
                              <Box sx={{ mt: 1 }}>
                                <Stack
                                  direction="row"
                                  justifyContent="space-between"
                                  sx={{ mb: 0.5 }}
                                >
                                  <Typography variant="caption">
                                    Độ mạnh:
                                  </Typography>
                                  <Chip
                                    label={passwordStrength.label}
                                    size="small"
                                    sx={{
                                      bgcolor: passwordStrength.color,
                                      color: "#fff",
                                      height: 20,
                                      fontSize: "0.65rem",
                                    }}
                                  />
                                </Stack>
                                <Box
                                  sx={{
                                    height: 4,
                                    bgcolor: "#f0f0f0",
                                    borderRadius: 2,
                                    overflow: "hidden",
                                  }}
                                >
                                  <Box
                                    sx={{
                                      width: `${(passwordStrength.score / 5) * 100}%`,
                                      height: "100%",
                                      bgcolor: passwordStrength.color,
                                      transition: "width 0.3s",
                                    }}
                                  />
                                </Box>
                              </Box>
                            )}

                            <TextField
                              fullWidth
                              label="Xác nhận mật khẩu *"
                              type={showRegConfirm ? "text" : "password"}
                              value={reg.confirmPassword}
                              onChange={(e) =>
                                setReg({
                                  ...reg,
                                  confirmPassword: e.target.value,
                                })
                              }
                              onBlur={() => handleBlur("confirmPassword")}
                              error={
                                touched.confirmPassword &&
                                !!regErrors.confirmPassword
                              }
                              helperText={
                                touched.confirmPassword &&
                                regErrors.confirmPassword
                              }
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <LockIcon sx={{ color: "#999" }} />
                                  </InputAdornment>
                                ),
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton
                                      onClick={() =>
                                        setShowRegConfirm(!showRegConfirm)
                                      }
                                      edge="end"
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

                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={agreeTerms}
                                  onChange={(e) =>
                                    setAgreeTerms(e.target.checked)
                                  }
                                  sx={{ color: "#f25c05" }}
                                />
                              }
                              label={
                                <Typography variant="body2">
                                  Tôi đồng ý với{" "}
                                  <Link href="/terms" sx={{ color: "#f25c05" }}>
                                    điều khoản sử dụng
                                  </Link>{" "}
                                  và{" "}
                                  <Link
                                    href="/privacy"
                                    sx={{ color: "#f25c05" }}
                                  >
                                    chính sách bảo mật
                                  </Link>
                                </Typography>
                              }
                            />

                            <Stack direction="row" spacing={2}>
                              <Button
                                fullWidth
                                variant="outlined"
                                onClick={() => setActiveStep(0)}
                                startIcon={<ArrowBackIcon />}
                              >
                                Quay lại
                              </Button>
                              <Button
                                fullWidth
                                type="submit"
                                variant="contained"
                                disabled={registering}
                                sx={{
                                  bgcolor: "#f25c05",
                                  color: "#fff",
                                  fontWeight: 600,
                                  py: 1.5,
                                }}
                              >
                                {registering ? (
                                  <CircularProgress size={24} color="inherit" />
                                ) : (
                                  "Đăng ký"
                                )}
                              </Button>
                            </Stack>
                          </Stack>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </form>
                )}
              </Box>
            </Paper>
          </Fade>
        </Grid>
      </Grid>

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
