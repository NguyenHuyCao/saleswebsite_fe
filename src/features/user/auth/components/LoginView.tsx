"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import {
  Box, Tab, Tabs, Typography, Paper, Fade,
  Stack, TextField, Button, InputAdornment, IconButton,
  FormControl, InputLabel, Select, MenuItem, Container,
  Checkbox, FormControlLabel, Link, Divider, Chip,
  Stepper, Step, StepLabel, CircularProgress,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

import Visibility     from "@mui/icons-material/Visibility";
import VisibilityOff  from "@mui/icons-material/VisibilityOff";
import EmailIcon      from "@mui/icons-material/Email";
import LockIcon       from "@mui/icons-material/Lock";
import PersonIcon     from "@mui/icons-material/Person";
import PhoneIcon      from "@mui/icons-material/Phone";
import ArrowBackIcon  from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import VerifiedUserIcon  from "@mui/icons-material/VerifiedUser";
import CachedIcon        from "@mui/icons-material/Cached";
import StarIcon          from "@mui/icons-material/Star";

import { useLogin, useRegister } from "../queries";
import { useToast } from "@/lib/toast/ToastContext";

const BE_URL = process.env.NEXT_PUBLIC_BE_URL ?? "http://localhost:8080";

const STORE = {
  name:    "Cường Hoa",
  tagline: "Máy công cụ 2 thì chính hãng",
  phone:   "0392 923 392",
  address: "293 TL293, Nghĩa Phương, Bắc Ninh",
};

const BENEFITS = [
  { icon: <VerifiedUserIcon sx={{ fontSize: 18, color: "#f25c05" }} />,  text: "Hàng chính hãng 100% — có tem, có phiếu BH" },
  { icon: <LocalShippingIcon sx={{ fontSize: 18, color: "#f25c05" }} />, text: "Giao hàng toàn quốc, miễn phí nội thành Bắc Ninh" },
  { icon: <CachedIcon sx={{ fontSize: 18, color: "#f25c05" }} />,        text: "Đổi trả trong 7 ngày nếu lỗi nhà sản xuất" },
  { icon: <StarIcon sx={{ fontSize: 18, color: "#f25c05" }} />,           text: "Ưu đãi thành viên — voucher, flash sale độc quyền" },
];

// ── Password strength ─────────────────────────────────────────────────────────
const checkPasswordStrength = (password: string) => {
  const requirements = [
    { met: password.length >= 8,          text: "Ít nhất 8 ký tự" },
    { met: /[A-Z]/.test(password),        text: "Ít nhất 1 chữ hoa" },
    { met: /[a-z]/.test(password),        text: "Ít nhất 1 chữ thường" },
    { met: /[0-9]/.test(password),        text: "Ít nhất 1 số" },
    { met: /[^A-Za-z0-9]/.test(password), text: "Ký tự đặc biệt (khuyến khích)" },
  ];
  const metCount = requirements.filter((r) => r.met).length;
  return {
    score: metCount,
    label: ["Rất yếu", "Yếu", "Trung bình", "Mạnh", "Rất mạnh"][metCount] ?? "Rất yếu",
    color: ["#f44336", "#ff9800", "#ffc107", "#8bc34a", "#4caf50"][metCount] ?? "#f44336",
    requirements,
  };
};

// ── Validators ────────────────────────────────────────────────────────────────
const emailRegex    = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex    = /^(03|05|07|08|09)[0-9]{8}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

export default function LoginView() {
  const [tab, setTab] = useState(0);
  const router        = useRouter();
  const sp            = useSearchParams();
  const { showToast } = useToast();
  const formRef       = useRef<HTMLDivElement>(null);

  // Thông báo từ OAuth / verify-email
  useEffect(() => {
    const err      = sp.get("error");
    const verified = sp.get("verified");
    if (err === "oauth_failed")   showToast("Đăng nhập qua mạng xã hội thất bại. Thử lại.", "error");
    if (err === "oauth_no_email") showToast("Không lấy được email từ tài khoản mạng xã hội.", "error");
    if (verified === "true")      showToast("Email đã xác thực thành công! Hãy đăng nhập.", "success");
  }, [sp]);

  // Sync tab với URL
  useEffect(() => {
    setTab(sp.get("page") === "register" ? 1 : 0);
  }, [sp]);

  // ── Login state ───────────────────────────────────────────────────────────
  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [showPw, setShowPw]         = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginErrors, setLoginErrors] = useState({ email: "", password: "" });
  const { mutateAsync: doLogin, isPending: loggingIn } = useLogin();

  // Restore remembered email
  useEffect(() => {
    const saved = localStorage.getItem("rememberedEmail");
    if (saved) { setEmail(saved); setRememberMe(true); }
  }, []);

  // ── Register state ────────────────────────────────────────────────────────
  const [activeStep, setActiveStep] = useState(0);
  const [reg, setReg] = useState({
    name: "", email: "", password: "", confirmPassword: "",
    phone: "", province: "", district: "", gender: "",
  });
  const [regErrors, setRegErrors]   = useState<Record<string, string>>({});
  const [touched, setTouched]       = useState<Record<string, boolean>>({});
  const [showRegPw, setShowRegPw]           = useState(false);
  const [showRegConfirm, setShowRegConfirm] = useState(false);
  const [agreeTerms, setAgreeTerms]         = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const { mutateAsync: doRegister, isPending: registering } = useRegister();

  const [provinces, setProvinces] = useState<{ code: number; name: string; districts: { code: number; name: string }[] }[]>([]);
  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/?depth=2")
      .then((r) => r.json())
      .then(setProvinces)
      .catch(() => {});
  }, []);

  const selectedProvince  = provinces.find((p) => p.name === reg.province);
  const passwordStrength  = useMemo(() => checkPasswordStrength(reg.password), [reg.password]);

  // ── Validation ────────────────────────────────────────────────────────────
  const validateLogin = () => {
    const errors = { email: "", password: "" };
    let ok = true;
    if (!email)                      { errors.email    = "Email không được để trống"; ok = false; }
    else if (!emailRegex.test(email)){ errors.email    = "Email không hợp lệ";        ok = false; }
    if (!password)                   { errors.password = "Mật khẩu không được để trống"; ok = false; }
    setLoginErrors(errors);
    return ok;
  };

  const validateStep1 = () => {
    const errors: Record<string, string> = {};
    let ok = true;
    if (!reg.name)                         { errors.name  = "Họ tên không được để trống"; ok = false; }
    if (!reg.email)                        { errors.email = "Email không được để trống";  ok = false; }
    else if (!emailRegex.test(reg.email))  { errors.email = "Email không hợp lệ";         ok = false; }
    if (!reg.phone)                        { errors.phone = "Số điện thoại không được để trống"; ok = false; }
    else if (!phoneRegex.test(reg.phone))  { errors.phone = "VD: 0912345678 (10 số, đầu 03/05/07/08/09)"; ok = false; }
    setRegErrors(errors);
    return ok;
  };

  const validateStep2 = () => {
    const errors: Record<string, string> = {};
    let ok = true;
    if (!reg.password)                         { errors.password = "Mật khẩu không được để trống"; ok = false; }
    else if (!passwordRegex.test(reg.password)){ errors.password = "Ít nhất 8 ký tự, gồm chữ hoa, thường và số"; ok = false; }
    if (!reg.confirmPassword)                  { errors.confirmPassword = "Vui lòng xác nhận mật khẩu"; ok = false; }
    else if (reg.password !== reg.confirmPassword){ errors.confirmPassword = "Mật khẩu xác nhận không khớp"; ok = false; }
    setRegErrors(errors);
    return ok;
  };

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleChangeTab = (_: any, v: number) => {
    setTab(v);
    setActiveStep(0);
    router.replace(`/login?page=${v === 1 ? "register" : "login"}`);
  };

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateLogin()) return;
    try {
      const res = await doLogin({ email, password });
      if (rememberMe) localStorage.setItem("rememberedEmail", email);
      else            localStorage.removeItem("rememberedEmail");
      window.dispatchEvent(new Event("login"));
      const dest = res.user.profileComplete === false ? "/profile-complete" : "/";
      if (res.user.emailVerified === false) {
        showToast("Vui lòng xác thực email để dùng đầy đủ tính năng.", "info", "Đăng nhập thành công");
      } else {
        showToast(`Chào mừng bạn trở lại, ${res.user.name || res.user.username || res.user.email}!`, "success", "Đăng nhập thành công");
      }
      setTimeout(() => router.push(dest), 300);
    } catch (err: any) {
      showToast(err?.message || "Email hoặc mật khẩu không đúng", "error");
    }
  };

  const onRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeStep === 0) { if (validateStep1()) setActiveStep(1); return; }
    if (!validateStep2()) return;
    if (!agreeTerms) { showToast("Vui lòng đồng ý với điều khoản sử dụng", "error"); return; }
    try {
      await doRegister({
        username: reg.name,
        email: reg.email,
        password: reg.password,
        phone: reg.phone,
        address: reg.district && reg.province ? `${reg.district}, ${reg.province}` : undefined,
        gender: reg.gender || undefined,
      });
      setRegisterSuccess(true);
    } catch (err: any) {
      showToast(err?.message || "Đăng ký thất bại. Vui lòng thử lại.", "error");
    }
  };

  const handleBlur = (field: string) => setTouched((p) => ({ ...p, [field]: true }));

  const handleGoogleLogin   = () => { window.location.href = `${BE_URL}/oauth2/authorization/google`; };
  const handleFacebookLogin = () => { window.location.href = `${BE_URL}/oauth2/authorization/facebook`; };

  // ── Register success ──────────────────────────────────────────────────────
  if (registerSuccess) {
    return (
      <Box sx={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}>
        <Paper elevation={3} sx={{
          p: { xs: 4, sm: 5 },
          borderRadius: 4,
          textAlign: "center",
          maxWidth: 480,
          width: "100%",
          "@keyframes popIn": {
            from: { opacity: 0, transform: "scale(0.85)" },
            to:   { opacity: 1, transform: "scale(1)" },
          },
          animation: "popIn 0.45s cubic-bezier(0.34,1.56,0.64,1) both",
        }}>
          <Box sx={{
            width: 80, height: 80, borderRadius: "50%",
            bgcolor: "#e8f5e9", display: "flex",
            alignItems: "center", justifyContent: "center", mx: "auto", mb: 2,
          }}>
            <CheckCircleIcon sx={{ fontSize: 48, color: "#4caf50" }} />
          </Box>
          <Typography variant="h5" fontWeight={800} gutterBottom>Đăng ký thành công!</Typography>
          <Typography color="text.secondary" sx={{ mb: 1 }}>
            Email xác thực đã được gửi tới
          </Typography>
          <Typography fontWeight={700} color="#f25c05" sx={{ mb: 2 }}>{reg.email}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Vui lòng kiểm tra hộp thư (kể cả thư mục <strong>Spam</strong>) và nhấn link xác thực trước khi đăng nhập.
          </Typography>
          <Button
            variant="contained"
            fullWidth
            onClick={() => { setTab(0); setRegisterSuccess(false); router.replace("/login"); }}
            sx={{ bgcolor: "#f25c05", "&:hover": { bgcolor: "#e64a19" }, fontWeight: 700, py: 1.5 }}
          >
            Đến trang đăng nhập
          </Button>
        </Paper>
      </Box>
    );
  }

  // ── Main render ───────────────────────────────────────────────────────────
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
      <Grid container spacing={{ xs: 0, md: 4 }} alignItems="stretch">

        {/* ── FORM — hiện trước trên mobile ── */}
        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{ order: { xs: 1, md: 2 } }}
        >
          <Fade in timeout={400}>
            <Box ref={formRef} sx={{ maxWidth: 500, mx: "auto" }}>

              {/* Logo nhỏ — chỉ hiện trên mobile */}
              <Box sx={{
                display: { xs: "flex", md: "none" },
                alignItems: "center",
                gap: 1.5,
                mb: 2.5,
                px: 0.5,
              }}>
                <Box sx={{
                  width: 44, height: 44, borderRadius: 2,
                  bgcolor: "#f25c05",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <Typography fontWeight={900} fontSize={20} color="#fff">C</Typography>
                </Box>
                <Box>
                  <Typography fontWeight={800} fontSize="1.1rem" color="#1a1a1a" lineHeight={1.2}>
                    {STORE.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">{STORE.tagline}</Typography>
                </Box>
              </Box>

              <Paper elevation={3} sx={{
                borderRadius: { xs: 3, sm: 4 },
                overflow: "hidden",
                boxShadow: { xs: "0 4px 20px rgba(0,0,0,0.08)", md: "0 8px 32px rgba(0,0,0,0.12)" },
              }}>
                {/* Tabs */}
                <Tabs
                  value={tab}
                  onChange={handleChangeTab}
                  variant="fullWidth"
                  sx={{
                    bgcolor: "#fafafa",
                    borderBottom: "1px solid rgba(0,0,0,0.08)",
                    "& .MuiTab-root": { fontWeight: 700, py: { xs: 1.5, sm: 2 }, fontSize: { xs: "0.9rem", sm: "1rem" } },
                    "& .Mui-selected": { color: "#f25c05" },
                    "& .MuiTabs-indicator": { backgroundColor: "#f25c05", height: 3 },
                  }}
                >
                  <Tab label="ĐĂNG NHẬP" />
                  <Tab label="ĐĂNG KÝ" />
                </Tabs>

                <Box sx={{ p: { xs: 2.5, sm: 3.5 }, bgcolor: "#fff" }}>

                  {/* ═══════════ ĐĂNG NHẬP ═══════════ */}
                  {tab === 0 && (
                    <Fade in timeout={300}>
                      <form onSubmit={onLogin}>
                        <Stack spacing={2.5}>
                          <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onBlur={() => handleBlur("loginEmail")}
                            error={!!loginErrors.email}
                            helperText={loginErrors.email}
                            slotProps={{
                              input: {
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <EmailIcon sx={{ color: "#999", fontSize: 20 }} />
                                  </InputAdornment>
                                ),
                              },
                            }}
                          />

                          <TextField
                            fullWidth
                            label="Mật khẩu"
                            type={showPw ? "text" : "password"}
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onBlur={() => handleBlur("loginPassword")}
                            error={!!loginErrors.password}
                            helperText={loginErrors.password}
                            slotProps={{
                              input: {
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <LockIcon sx={{ color: "#999", fontSize: 20 }} />
                                  </InputAdornment>
                                ),
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton onClick={() => setShowPw(!showPw)} edge="end" size="small">
                                      {showPw ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              },
                            }}
                          />

                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={rememberMe}
                                  onChange={(e) => setRememberMe(e.target.checked)}
                                  size="small"
                                  sx={{ color: "#f25c05", "&.Mui-checked": { color: "#f25c05" } }}
                                />
                              }
                              label={<Typography variant="body2">Ghi nhớ đăng nhập</Typography>}
                            />
                            <Link href="/forgot-password" sx={{ color: "#f25c05", textDecoration: "none", fontSize: "0.85rem", fontWeight: 500, "&:hover": { textDecoration: "underline" } }}>
                              Quên mật khẩu?
                            </Link>
                          </Stack>

                          <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={loggingIn}
                            size="large"
                            sx={{
                              bgcolor: "#f25c05",
                              color: "#fff",
                              fontWeight: 700,
                              py: 1.5,
                              fontSize: "1rem",
                              borderRadius: 2,
                              "&:hover": { bgcolor: "#e64a19" },
                              "&:disabled": { bgcolor: "#ccc" },
                            }}
                          >
                            {loggingIn ? <CircularProgress size={22} color="inherit" /> : "Đăng nhập"}
                          </Button>

                          <Divider>
                            <Chip label="Hoặc đăng nhập với" size="small" sx={{ fontSize: "0.72rem", color: "#888" }} />
                          </Divider>

                          <Stack direction="row" spacing={1.5}>
                            <Button
                              fullWidth
                              variant="outlined"
                              onClick={handleGoogleLogin}
                              startIcon={<Box component="span" sx={{ fontWeight: 900, fontSize: 15, color: "#DB4437" }}>G</Box>}
                              sx={{ borderColor: "#DB4437", color: "#DB4437", fontWeight: 600, "&:hover": { bgcolor: "#fff3f2" } }}
                            >
                              Google
                            </Button>
                            <Button
                              fullWidth
                              variant="outlined"
                              onClick={handleFacebookLogin}
                              startIcon={<Box component="span" sx={{ fontWeight: 900, fontSize: 15, color: "#1877F2" }}>f</Box>}
                              sx={{ borderColor: "#1877F2", color: "#1877F2", fontWeight: 600, "&:hover": { bgcolor: "#f0f4ff" } }}
                            >
                              Facebook
                            </Button>
                          </Stack>

                          <Typography variant="body2" textAlign="center" color="text.secondary">
                            Chưa có tài khoản?{" "}
                            <Box
                              component="span"
                              onClick={() => handleChangeTab(null, 1)}
                              sx={{ color: "#f25c05", fontWeight: 700, cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
                            >
                              Đăng ký ngay
                            </Box>
                          </Typography>
                        </Stack>
                      </form>
                    </Fade>
                  )}

                  {/* ═══════════ ĐĂNG KÝ ═══════════ */}
                  {tab === 1 && (
                    <Fade in timeout={300}>
                      <form onSubmit={onRegister}>
                        <Stepper
                          activeStep={activeStep}
                          sx={{
                            mb: 3,
                            "& .MuiStepLabel-label": { fontSize: { xs: "0.75rem", sm: "0.875rem" } },
                            "& .MuiStepIcon-root.Mui-active": { color: "#f25c05" },
                            "& .MuiStepIcon-root.Mui-completed": { color: "#f25c05" },
                          }}
                        >
                          <Step><StepLabel>Thông tin cơ bản</StepLabel></Step>
                          <Step><StepLabel>Tạo mật khẩu</StepLabel></Step>
                        </Stepper>

                        {/* Step 1 */}
                        {activeStep === 0 && (
                          <Fade in timeout={280}>
                            <Stack spacing={2.5}>
                              <TextField
                                fullWidth
                                label="Họ và tên *"
                                autoComplete="name"
                                value={reg.name}
                                onChange={(e) => setReg({ ...reg, name: e.target.value })}
                                onBlur={() => handleBlur("name")}
                                error={touched.name && !!regErrors.name}
                                helperText={touched.name && regErrors.name}
                                slotProps={{
                                  input: {
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <PersonIcon sx={{ color: "#999", fontSize: 20 }} />
                                      </InputAdornment>
                                    ),
                                  },
                                }}
                              />

                              <TextField
                                fullWidth
                                label="Email *"
                                type="email"
                                autoComplete="email"
                                value={reg.email}
                                onChange={(e) => setReg({ ...reg, email: e.target.value })}
                                onBlur={() => handleBlur("email")}
                                error={touched.email && !!regErrors.email}
                                helperText={touched.email && regErrors.email}
                                slotProps={{
                                  input: {
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <EmailIcon sx={{ color: "#999", fontSize: 20 }} />
                                      </InputAdornment>
                                    ),
                                  },
                                }}
                              />

                              <TextField
                                fullWidth
                                label="Số điện thoại *"
                                type="tel"
                                autoComplete="tel"
                                value={reg.phone}
                                onChange={(e) => setReg({ ...reg, phone: e.target.value })}
                                onBlur={() => handleBlur("phone")}
                                error={touched.phone && !!regErrors.phone}
                                helperText={touched.phone ? regErrors.phone : "VD: 0912 345 678"}
                                slotProps={{
                                  input: {
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <PhoneIcon sx={{ color: "#999", fontSize: 20 }} />
                                      </InputAdornment>
                                    ),
                                  },
                                }}
                              />

                              <Grid container spacing={1.5}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                  <FormControl fullWidth size="small">
                                    <InputLabel>Tỉnh/Thành phố</InputLabel>
                                    <Select
                                      value={reg.province}
                                      label="Tỉnh/Thành phố"
                                      onChange={(e) => setReg({ ...reg, province: e.target.value, district: "" })}
                                    >
                                      <MenuItem value="">Chọn tỉnh/thành</MenuItem>
                                      {provinces.map((p) => (
                                        <MenuItem key={p.code} value={p.name}>{p.name}</MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                  <FormControl fullWidth size="small">
                                    <InputLabel>Quận/Huyện</InputLabel>
                                    <Select
                                      value={reg.district}
                                      label="Quận/Huyện"
                                      disabled={!reg.province}
                                      onChange={(e) => setReg({ ...reg, district: e.target.value })}
                                    >
                                      <MenuItem value="">Chọn quận/huyện</MenuItem>
                                      {(selectedProvince?.districts ?? []).map((d) => (
                                        <MenuItem key={d.code} value={d.name}>{d.name}</MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                </Grid>
                              </Grid>

                              <FormControl fullWidth size="small">
                                <InputLabel>Giới tính</InputLabel>
                                <Select
                                  value={reg.gender}
                                  label="Giới tính"
                                  onChange={(e) => setReg({ ...reg, gender: e.target.value })}
                                >
                                  <MenuItem value="Nam">Nam</MenuItem>
                                  <MenuItem value="Nữ">Nữ</MenuItem>
                                  <MenuItem value="Khác">Khác</MenuItem>
                                </Select>
                              </FormControl>

                              <Button
                                fullWidth
                                variant="contained"
                                size="large"
                                onClick={() => { if (validateStep1()) setActiveStep(1); }}
                                sx={{ bgcolor: "#f25c05", color: "#fff", fontWeight: 700, py: 1.4, borderRadius: 2, "&:hover": { bgcolor: "#e64a19" } }}
                              >
                                Tiếp tục
                              </Button>

                              <Divider>
                                <Chip label="Hoặc đăng ký với" size="small" sx={{ fontSize: "0.72rem", color: "#888" }} />
                              </Divider>
                              <Stack direction="row" spacing={1.5}>
                                <Button
                                  fullWidth
                                  variant="outlined"
                                  onClick={handleGoogleLogin}
                                  sx={{ borderColor: "#DB4437", color: "#DB4437", fontWeight: 600, "&:hover": { bgcolor: "#fff3f2" } }}
                                >
                                  G &nbsp;Google
                                </Button>
                                <Button
                                  fullWidth
                                  variant="outlined"
                                  onClick={handleFacebookLogin}
                                  sx={{ borderColor: "#1877F2", color: "#1877F2", fontWeight: 600, "&:hover": { bgcolor: "#f0f4ff" } }}
                                >
                                  f &nbsp;Facebook
                                </Button>
                              </Stack>

                              <Typography variant="body2" textAlign="center" color="text.secondary">
                                Đã có tài khoản?{" "}
                                <Box
                                  component="span"
                                  onClick={() => handleChangeTab(null, 0)}
                                  sx={{ color: "#f25c05", fontWeight: 700, cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
                                >
                                  Đăng nhập
                                </Box>
                              </Typography>
                            </Stack>
                          </Fade>
                        )}

                        {/* Step 2 */}
                        {activeStep === 1 && (
                          <Fade in timeout={280}>
                            <Stack spacing={2.5}>
                              <TextField
                                fullWidth
                                label="Mật khẩu *"
                                type={showRegPw ? "text" : "password"}
                                autoComplete="new-password"
                                value={reg.password}
                                onChange={(e) => setReg({ ...reg, password: e.target.value })}
                                onBlur={() => handleBlur("password")}
                                error={touched.password && !!regErrors.password}
                                helperText={touched.password ? regErrors.password : "Ít nhất 8 ký tự, gồm chữ hoa, thường và số"}
                                slotProps={{
                                  input: {
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <LockIcon sx={{ color: "#999", fontSize: 20 }} />
                                      </InputAdornment>
                                    ),
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        <IconButton onClick={() => setShowRegPw(!showRegPw)} edge="end" size="small">
                                          {showRegPw ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                        </IconButton>
                                      </InputAdornment>
                                    ),
                                  },
                                }}
                              />

                              {reg.password && (
                                <Box>
                                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.75 }}>
                                    <Typography variant="caption" color="text.secondary">Độ mạnh:</Typography>
                                    <Chip
                                      label={passwordStrength.label}
                                      size="small"
                                      sx={{ bgcolor: passwordStrength.color, color: "#fff", height: 20, fontSize: "0.65rem", fontWeight: 700 }}
                                    />
                                  </Stack>
                                  <Box sx={{ height: 5, bgcolor: "#f0f0f0", borderRadius: 3, overflow: "hidden" }}>
                                    <Box sx={{
                                      width: `${(passwordStrength.score / 5) * 100}%`,
                                      height: "100%",
                                      bgcolor: passwordStrength.color,
                                      borderRadius: 3,
                                      transition: "width 0.3s ease",
                                    }} />
                                  </Box>
                                </Box>
                              )}

                              <TextField
                                fullWidth
                                label="Xác nhận mật khẩu *"
                                type={showRegConfirm ? "text" : "password"}
                                autoComplete="new-password"
                                value={reg.confirmPassword}
                                onChange={(e) => setReg({ ...reg, confirmPassword: e.target.value })}
                                onBlur={() => handleBlur("confirmPassword")}
                                error={touched.confirmPassword && !!regErrors.confirmPassword}
                                helperText={touched.confirmPassword && regErrors.confirmPassword}
                                slotProps={{
                                  input: {
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <LockIcon sx={{ color: "#999", fontSize: 20 }} />
                                      </InputAdornment>
                                    ),
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        <IconButton onClick={() => setShowRegConfirm(!showRegConfirm)} edge="end" size="small">
                                          {showRegConfirm ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                        </IconButton>
                                      </InputAdornment>
                                    ),
                                  },
                                }}
                              />

                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={agreeTerms}
                                    onChange={(e) => setAgreeTerms(e.target.checked)}
                                    size="small"
                                    sx={{ color: "#f25c05", "&.Mui-checked": { color: "#f25c05" } }}
                                  />
                                }
                                label={
                                  <Typography variant="body2">
                                    Tôi đồng ý với{" "}
                                    <Link href="/terms" sx={{ color: "#f25c05" }}>điều khoản sử dụng</Link>{" "}
                                    và{" "}
                                    <Link href="/privacy" sx={{ color: "#f25c05" }}>chính sách bảo mật</Link>
                                  </Typography>
                                }
                              />

                              <Stack direction="row" spacing={1.5}>
                                <Button
                                  variant="outlined"
                                  onClick={() => setActiveStep(0)}
                                  startIcon={<ArrowBackIcon fontSize="small" />}
                                  sx={{ minWidth: 110, borderColor: "#ddd", color: "#555", "&:hover": { borderColor: "#bbb" } }}
                                >
                                  Quay lại
                                </Button>
                                <Button
                                  fullWidth
                                  type="submit"
                                  variant="contained"
                                  disabled={registering}
                                  size="large"
                                  sx={{ bgcolor: "#f25c05", color: "#fff", fontWeight: 700, py: 1.4, borderRadius: 2, "&:hover": { bgcolor: "#e64a19" }, "&:disabled": { bgcolor: "#ccc" } }}
                                >
                                  {registering ? <CircularProgress size={22} color="inherit" /> : "Hoàn tất đăng ký"}
                                </Button>
                              </Stack>
                            </Stack>
                          </Fade>
                        )}
                      </form>
                    </Fade>
                  )}
                </Box>
              </Paper>
            </Box>
          </Fade>
        </Grid>

        {/* ── HERO — ẩn trên mobile, hiện trên desktop ── */}
        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{
            order: { xs: 2, md: 1 },
            display: { xs: "none", md: "block" },
          }}
        >
          {/* Image-cover panel — fills 100% height of the form */}
          <Box sx={{
            position: "relative",
            width: "100%",
            height: "100%",
            minHeight: 500,
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
          }}>
            {/* Background image — covers entire panel */}
            <Image
              src="/images/banner/istockphoto-1639694829-612x612.jpg"
              alt="Cường Hoa — Máy công cụ 2 thì"
              fill
              style={{ objectFit: "cover", objectPosition: "center" }}
              priority
            />

            {/* Gradient overlay: top = subtle dark, bottom = strong dark for text */}
            <Box sx={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.72) 75%, rgba(0,0,0,0.88) 100%)",
            }} />

            {/* Top-left: Brand badge */}
            <Box sx={{
              position: "absolute",
              top: 24,
              left: 24,
              display: "flex",
              alignItems: "center",
              gap: 1.25,
              zIndex: 2,
            }}>
              <Box sx={{
                width: 38, height: 38, borderRadius: 1.5,
                bgcolor: "#f25c05",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 2px 8px rgba(242,92,5,0.5)",
              }}>
                <Typography fontWeight={900} fontSize={18} color="#fff" lineHeight={1}>C</Typography>
              </Box>
              <Box>
                <Typography fontWeight={900} fontSize="1rem" color="#fff" lineHeight={1.2}
                  sx={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
                  {STORE.name}
                </Typography>
                <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.75)", fontSize: "0.7rem" }}>
                  {STORE.tagline}
                </Typography>
              </Box>
            </Box>

            {/* Bottom: Store info overlay */}
            <Box sx={{
              position: "absolute",
              bottom: 0, left: 0, right: 0,
              p: { md: 3, lg: 4 },
              zIndex: 2,
            }}>
              {/* Headline */}
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)", mb: 0.5, letterSpacing: "0.04em", fontSize: "0.78rem" }}>
                CHÀO MỪNG BẠN ĐẾN VỚI
              </Typography>
              <Typography fontWeight={900} sx={{
                color: "#fff",
                fontSize: { md: "1.9rem", lg: "2.3rem" },
                lineHeight: 1.15,
                mb: 0.5,
                textShadow: "0 2px 8px rgba(0,0,0,0.4)",
              }}>
                {STORE.name}
              </Typography>
              <Box sx={{
                display: "inline-block",
                bgcolor: "#f25c05",
                px: 1.5, py: 0.4,
                borderRadius: 1,
                mb: 2.5,
              }}>
                <Typography fontWeight={700} sx={{ color: "#fff", fontSize: "0.78rem", letterSpacing: "0.03em" }}>
                  {STORE.tagline.toUpperCase()}
                </Typography>
              </Box>

              {/* Benefits — compact 2×2 grid */}
              <Box sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 1,
                mb: 2.5,
              }}>
                {BENEFITS.map((b, i) => (
                  <Stack key={i} direction="row" spacing={0.75} alignItems="center">
                    <Box sx={{
                      width: 22, height: 22,
                      borderRadius: 1,
                      bgcolor: "rgba(242,92,5,0.85)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                      "& svg": { fontSize: 13, color: "#fff" },
                    }}>
                      {b.icon}
                    </Box>
                    <Typography sx={{ color: "rgba(255,255,255,0.88)", fontSize: "0.72rem", fontWeight: 500, lineHeight: 1.3 }}>
                      {b.text}
                    </Typography>
                  </Stack>
                ))}
              </Box>

              {/* Hotline */}
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box sx={{
                  width: 28, height: 28, borderRadius: "50%",
                  bgcolor: "#f25c05",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <Typography fontSize={14}>📞</Typography>
                </Box>
                <Box>
                  <Typography sx={{ color: "rgba(255,255,255,0.6)", fontSize: "0.65rem", lineHeight: 1 }}>
                    Hotline hỗ trợ (8:00–21:00)
                  </Typography>
                  <Typography fontWeight={800} sx={{ color: "#ffb700", fontSize: "1rem", letterSpacing: "0.02em" }}>
                    {STORE.phone}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Box>
        </Grid>

      </Grid>
    </Container>
  );
}
