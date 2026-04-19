"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import {
  Box, Tab, Tabs, Typography, Paper, Fade,
  Stack, TextField, Button, InputAdornment, IconButton,
  FormControl, InputLabel, Select, MenuItem, Container,
  Checkbox, FormControlLabel, Link, Divider, Chip,
  Stepper, Step, StepLabel, CircularProgress,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// Icons
import Visibility    from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import EmailIcon     from "@mui/icons-material/Email";
import LockIcon      from "@mui/icons-material/Lock";
import PersonIcon    from "@mui/icons-material/Person";
import PhoneIcon     from "@mui/icons-material/Phone";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { useLogin, useRegister } from "../queries";
import { useToast } from "@/lib/toast/ToastContext";

const BE_URL = process.env.NEXT_PUBLIC_BE_URL ?? "http://localhost:8080";

// ── Password strength ────────────────────────────────────────────────────

const checkPasswordStrength = (password: string) => {
  const requirements = [
    { met: password.length >= 8,          text: "Ít nhất 8 ký tự" },
    { met: /[A-Z]/.test(password),        text: "Ít nhất 1 chữ hoa" },
    { met: /[a-z]/.test(password),        text: "Ít nhất 1 chữ thường" },
    { met: /[0-9]/.test(password),        text: "Ít nhất 1 số" },
    { met: /[^A-Za-z0-9]/.test(password), text: "Ít nhất 1 ký tự đặc biệt (khuyến khích)" },
  ];
  const metCount = requirements.filter((r) => r.met).length;
  const label = ["Rất yếu","Yếu","Trung bình","Mạnh","Rất mạnh"][metCount] ?? "Rất yếu";
  const color = ["#f44336","#ff9800","#ffc107","#8bc34a","#4caf50"][metCount] ?? "#f44336";
  return { score: metCount, label, color, requirements };
};

// ── Validators (khớp hoàn toàn với BE) ──────────────────────────────────

const emailRegex   = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex   = /^(03|05|07|08|09)[0-9]{8}$/;
// Khớp với BE: ≥8 ký tự, có chữ hoa, chữ thường, số (special char optional)
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

const validateEmail = (v: string) => emailRegex.test(v);
const validatePhone = (v: string) => phoneRegex.test(v);
const validatePassword = (v: string) => passwordRegex.test(v);

export default function LoginView() {
  const [tab, setTab] = useState(0);
  const router = useRouter();
  const sp     = useSearchParams();
  const { showToast } = useToast();

  // Thông báo từ OAuth callback hoặc verify-email
  useEffect(() => {
    const err      = sp.get("error");
    const verified = sp.get("verified");
    if (err === "oauth_failed")   showToast("Đăng nhập qua mạng xã hội thất bại. Thử lại.", "error");
    if (err === "oauth_no_email") showToast("Không lấy được email từ tài khoản mạng xã hội.", "error");
    if (verified === "true")      showToast("Email đã xác thực thành công! Hãy đăng nhập.", "success");
  }, [sp]);

  // ── Login state ────────────────────────────────────────────────────────
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [showPw, setShowPw]       = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginErrors, setLoginErrors] = useState({ email: "", password: "" });
  const { mutateAsync: doLogin, isPending: loggingIn } = useLogin();

  // ── Register state — 2 bước ───────────────────────────────────────────
  const [activeStep, setActiveStep] = useState(0);
  const [reg, setReg] = useState({
    name: "", email: "", password: "", confirmPassword: "",
    phone: "", province: "", district: "", gender: "",
  });
  const [regErrors, setRegErrors] = useState<Record<string, string>>({});
  const [touched, setTouched]     = useState<Record<string, boolean>>({});
  const [showRegPw, setShowRegPw]         = useState(false);
  const [showRegConfirm, setShowRegConfirm] = useState(false);
  const [agreeTerms, setAgreeTerms]       = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const { mutateAsync: doRegister, isPending: registering } = useRegister();

  // Province/district — lấy từ API
  const [provinces, setProvinces] = useState<{ code: number; name: string; districts: { code: number; name: string }[] }[]>([]);
  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/?depth=2")
      .then((r) => r.json())
      .then(setProvinces)
      .catch(() => {}); // fail silently — tỉnh/huyện là optional
  }, []);

  const selectedProvince = provinces.find((p) => p.name === reg.province);

  const passwordStrength = useMemo(() => checkPasswordStrength(reg.password), [reg.password]);

  useEffect(() => {
    setTab(sp.get("page") === "register" ? 1 : 0);
  }, [sp]);

  const handleChangeTab = (_: any, v: number) => {
    setTab(v);
    router.replace(`/login?page=${v === 1 ? "register" : "login"}`);
  };

  // ── Login validation ───────────────────────────────────────────────────
  const validateLogin = (): boolean => {
    const errors = { email: "", password: "" };
    let ok = true;
    if (!email)                   { errors.email    = "Email không được để trống"; ok = false; }
    else if (!validateEmail(email)) { errors.email  = "Email không hợp lệ";        ok = false; }
    if (!password)                { errors.password = "Mật khẩu không được để trống"; ok = false; }
    setLoginErrors(errors);
    return ok;
  };

  // ── Register step 1 validation ─────────────────────────────────────────
  const validateStep1 = (): boolean => {
    const errors: Record<string, string> = {};
    let ok = true;
    if (!reg.name)                      { errors.name  = "Họ tên không được để trống"; ok = false; }
    if (!reg.email)                     { errors.email = "Email không được để trống";  ok = false; }
    else if (!validateEmail(reg.email)) { errors.email = "Email không hợp lệ";         ok = false; }
    if (!reg.phone)                       { errors.phone = "Số điện thoại không được để trống"; ok = false; }
    else if (!validatePhone(reg.phone))   { errors.phone = "Số điện thoại không hợp lệ (VD: 0912345678)"; ok = false; }
    setRegErrors(errors);
    return ok;
  };

  // ── Register step 2 validation — khớp BE ──────────────────────────────
  const validateStep2 = (): boolean => {
    const errors: Record<string, string> = {};
    let ok = true;
    if (!reg.password) {
      errors.password = "Mật khẩu không được để trống"; ok = false;
    } else if (!validatePassword(reg.password)) {
      errors.password = "Mật khẩu phải từ 8 ký tự, bao gồm chữ hoa, chữ thường và số"; ok = false;
    }
    if (!reg.confirmPassword) {
      errors.confirmPassword = "Vui lòng xác nhận mật khẩu"; ok = false;
    } else if (reg.password !== reg.confirmPassword) {
      errors.confirmPassword = "Mật khẩu xác nhận không khớp"; ok = false;
    }
    setRegErrors(errors);
    return ok;
  };

  // ── Handlers ───────────────────────────────────────────────────────────

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateLogin()) return;
    try {
      const res = await doLogin({ email, password });
      if (rememberMe) localStorage.setItem("rememberedEmail", email);
      else            localStorage.removeItem("rememberedEmail");

      // Thông báo TopBar cập nhật trạng thái đăng nhập
      window.dispatchEvent(new Event("login"));

      const dest =
        res.user.profileComplete === false ? "/profile-complete" : "/";
      if (res.user.emailVerified === false) {
        showToast(
          "Vui lòng xác thực email để sử dụng đầy đủ tính năng.",
          "info",
          "Đăng nhập thành công",
        );
      } else {
        showToast(
          `Chào mừng bạn trở lại, ${res.user.name || res.user.username || res.user.email}!`,
          "success",
          "Đăng nhập thành công",
        );
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

  // ── Restore remembered email ───────────────────────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem("rememberedEmail");
    if (saved) { setEmail(saved); setRememberMe(true); }
  }, []);

  // ── OAuth handlers ─────────────────────────────────────────────────────
  const handleGoogleLogin   = () => { window.location.href = `${BE_URL}/oauth2/authorization/google`; };
  const handleFacebookLogin = () => { window.location.href = `${BE_URL}/oauth2/authorization/facebook`; };

  // ── Register success screen ────────────────────────────────────────────
  if (registerSuccess) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8, textAlign: "center" }}>
        <motion.div initial={{ opacity: 0, scale: .8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .5 }}>
          <CheckCircleIcon sx={{ fontSize: 80, color: "#4caf50", mb: 2 }} />
          <Typography variant="h5" fontWeight={800} gutterBottom>Đăng ký thành công! 🎉</Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Chúng tôi đã gửi email xác thực tới <strong>{reg.email}</strong>.<br/>
            Vui lòng kiểm tra hộp thư (kể cả thư mục Spam) và nhấn link xác thực trước khi đăng nhập.
          </Typography>
          <Button variant="contained" onClick={() => { setTab(0); setRegisterSuccess(false); router.replace("/login"); }}
            sx={{ bgcolor: "#f25c05", "&:hover": { bgcolor: "#e64a19" }, fontWeight: 700, px: 4 }}>
            Đi tới trang đăng nhập
          </Button>
        </motion.div>
      </Container>
    );
  }

  // ── Main render ────────────────────────────────────────────────────────
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={4} alignItems="center">
        {/* Left — Hero */}
        <Grid size={{ xs: 12, md: 6 }}>
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .6 }}>
            <Box sx={{ p: 4, textAlign: "center" }}>
              <Image src="/images/banner/istockphoto-1639694829-612x612.jpg" alt="Login illustration"
                width={400} height={300} style={{ maxWidth: "100%", height: "auto" }} />
              <Typography variant="h4" fontWeight={800} sx={{ mt: 4, color: "#333" }}>Chào mừng bạn đến với</Typography>
              <Typography variant="h3" fontWeight={900} sx={{ color: "#f25c05", mb: 3 }}>DolaTool</Typography>
              <Stack spacing={2} sx={{ maxWidth: 400, mx: "auto" }}>
                {["✅ Hàng chính hãng 100%","🚚 Miễn phí vận chuyển toàn quốc","🔧 Bảo hành lên đến 12 tháng","🎁 Ưu đãi thành viên hấp dẫn"]
                  .map((b, i) => <Typography key={i} variant="body1">{b}</Typography>)}
              </Stack>
            </Box>
          </motion.div>
        </Grid>

        {/* Right — Form */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Fade in timeout={500}>
            <Paper elevation={3} sx={{ borderRadius: 4, overflow: "hidden", maxWidth: 500, mx: "auto" }}>
              <Tabs value={tab} onChange={handleChangeTab} variant="fullWidth"
                sx={{ "& .MuiTab-root": { fontWeight: 700, py: 2, fontSize: "1rem" },
                      "& .Mui-selected": { color: "#f25c05" },
                      "& .MuiTabs-indicator": { backgroundColor: "#f25c05", height: 3 } }}>
                <Tab label="ĐĂNG NHẬP" />
                <Tab label="ĐĂNG KÝ" />
              </Tabs>

              <Box sx={{ p: 4, bgcolor: "#fff" }}>
                {/* ── ĐĂNG NHẬP ── */}
                {tab === 0 ? (
                  <form onSubmit={onLogin}>
                    <Stack spacing={3}>
                      <TextField fullWidth label="Email" value={email} onChange={(e) => setEmail(e.target.value)}
                        onBlur={() => handleBlur("loginEmail")} error={!!loginErrors.email} helperText={loginErrors.email}
                        slotProps={{
                          input: { startAdornment: <InputAdornment position="start"><EmailIcon sx={{ color: "#999" }} /></InputAdornment>   },
                        }} />

                      <TextField fullWidth label="Mật khẩu" type={showPw ? "text" : "password"}
                        value={password} onChange={(e) => setPassword(e.target.value)}
                        onBlur={() => handleBlur("loginPassword")} error={!!loginErrors.password} helperText={loginErrors.password}
                        slotProps={{
                          input: {
                            startAdornment: <InputAdornment position="start"><LockIcon sx={{ color: "#999" }} /></InputAdornment>,
                            endAdornment: <InputAdornment position="end">
                              <IconButton onClick={() => setShowPw(!showPw)} edge="end">
                                {showPw ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>,
                            },
                        }} />

                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <FormControlLabel control={<Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} sx={{ color: "#f25c05" }} />}
                          label="Ghi nhớ đăng nhập" />
                        <Link href="/forgot-password" sx={{ color: "#f25c05", textDecoration: "none", fontWeight: 500, "&:hover": { textDecoration: "underline" } }}>
                          Quên mật khẩu?
                        </Link>
                      </Stack>

                      <Button type="submit" fullWidth variant="contained" disabled={loggingIn}
                        sx={{ bgcolor: "#f25c05", color: "#fff", fontWeight: 700, py: 1.5, fontSize: "1rem", "&:hover": { bgcolor: "#e64a19" } }}>
                        {loggingIn ? <CircularProgress size={24} color="inherit" /> : "Đăng nhập"}
                      </Button>

                      {/* ── OAuth ── */}
                      <Divider><Chip label="Hoặc đăng nhập với" size="small" sx={{ fontSize: "0.75rem" }} /></Divider>

                      <Stack direction="row" spacing={2}>
                        <Button fullWidth variant="outlined" onClick={handleGoogleLogin}
                          startIcon={
                            <Box component="span" sx={{ fontSize: 18, lineHeight: 1 }}>G</Box>
                          }
                          sx={{ borderColor: "#DB4437", color: "#DB4437", fontWeight: 600,
                                "&:hover": { bgcolor: "#fff3f2", borderColor: "#DB4437" } }}>
                          Google
                        </Button>
                        <Button fullWidth variant="outlined" onClick={handleFacebookLogin}
                          startIcon={
                            <Box component="span" sx={{ fontSize: 18, lineHeight: 1 }}>f</Box>
                          }
                          sx={{ borderColor: "#1877F2", color: "#1877F2", fontWeight: 600,
                                "&:hover": { bgcolor: "#f0f4ff", borderColor: "#1877F2" } }}>
                          Facebook
                        </Button>
                      </Stack>
                    </Stack>
                  </form>

                ) : (
                  /* ── ĐĂNG KÝ ── */
                  <form onSubmit={onRegister}>
                    <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                      <Step><StepLabel>Thông tin cơ bản</StepLabel></Step>
                      <Step><StepLabel>Mật khẩu</StepLabel></Step>
                    </Stepper>

                    <AnimatePresence mode="wait">
                      {activeStep === 0 ? (
                        <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }} transition={{ duration: .3 }}>
                          <Stack spacing={2.5}>
                            <TextField fullWidth label="Họ và tên *" value={reg.name}
                              onChange={(e) => setReg({ ...reg, name: e.target.value })}
                              onBlur={() => handleBlur("name")} error={touched.name && !!regErrors.name}
                              helperText={touched.name && regErrors.name}
                              slotProps={{
                                input: { startAdornment: <InputAdornment position="start"><PersonIcon sx={{ color: "#999" }} /></InputAdornment>   },
                              }} />

                            <TextField fullWidth label="Email *" type="email" value={reg.email}
                              onChange={(e) => setReg({ ...reg, email: e.target.value })}
                              onBlur={() => handleBlur("email")} error={touched.email && !!regErrors.email}
                              helperText={touched.email && regErrors.email}
                              slotProps={{
                                input: { startAdornment: <InputAdornment position="start"><EmailIcon sx={{ color: "#999" }} /></InputAdornment>   },
                              }} />

                            <TextField fullWidth label="Số điện thoại *" value={reg.phone}
                              onChange={(e) => setReg({ ...reg, phone: e.target.value })}
                              onBlur={() => handleBlur("phone")} error={touched.phone && !!regErrors.phone}
                              helperText={touched.phone && regErrors.phone}
                              slotProps={{
                                input: { startAdornment: <InputAdornment position="start"><PhoneIcon sx={{ color: "#999" }} /></InputAdornment>   },
                              }} />

                            <Grid container spacing={2}>
                              <Grid size={{ xs: 12, sm: 6 }}>
                                <FormControl fullWidth>
                                  <InputLabel>Tỉnh/Thành phố</InputLabel>
                                  <Select value={reg.province} label="Tỉnh/Thành phố"
                                    onChange={(e) => setReg({ ...reg, province: e.target.value, district: "" })}>
                                    <MenuItem value="">Chọn tỉnh/thành</MenuItem>
                                    {provinces.map((p) => <MenuItem key={p.code} value={p.name}>{p.name}</MenuItem>)}
                                  </Select>
                                </FormControl>
                              </Grid>
                              <Grid size={{ xs: 12, sm: 6 }}>
                                <FormControl fullWidth>
                                  <InputLabel>Quận/Huyện</InputLabel>
                                  <Select value={reg.district} label="Quận/Huyện" disabled={!reg.province}
                                    onChange={(e) => setReg({ ...reg, district: e.target.value })}>
                                    <MenuItem value="">Chọn quận/huyện</MenuItem>
                                    {(selectedProvince?.districts ?? []).map((d) => <MenuItem key={d.code} value={d.name}>{d.name}</MenuItem>)}
                                  </Select>
                                </FormControl>
                              </Grid>
                            </Grid>

                            <FormControl fullWidth>
                              <InputLabel>Giới tính</InputLabel>
                              <Select value={reg.gender} label="Giới tính" onChange={(e) => setReg({ ...reg, gender: e.target.value })}>
                                <MenuItem value="Nam">Nam</MenuItem>
                                <MenuItem value="Nữ">Nữ</MenuItem>
                                <MenuItem value="Khác">Khác</MenuItem>
                              </Select>
                            </FormControl>

                            <Button fullWidth variant="contained" onClick={() => { if (validateStep1()) setActiveStep(1); }}
                              sx={{ bgcolor: "#f25c05", color: "#fff", fontWeight: 600, py: 1.5 }}>
                              Tiếp tục
                            </Button>

                            {/* OAuth trong tab đăng ký */}
                            <Divider><Chip label="Hoặc đăng ký với" size="small" sx={{ fontSize: "0.75rem" }} /></Divider>
                            <Stack direction="row" spacing={2}>
                              <Button fullWidth variant="outlined" onClick={handleGoogleLogin}
                                sx={{ borderColor: "#DB4437", color: "#DB4437", fontWeight: 600 }}>G  Google</Button>
                              <Button fullWidth variant="outlined" onClick={handleFacebookLogin}
                                sx={{ borderColor: "#1877F2", color: "#1877F2", fontWeight: 600 }}>f  Facebook</Button>
                            </Stack>
                          </Stack>
                        </motion.div>

                      ) : (
                        <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }} transition={{ duration: .3 }}>
                          <Stack spacing={2.5}>
                            <TextField fullWidth label="Mật khẩu *" type={showRegPw ? "text" : "password"}
                              value={reg.password} onChange={(e) => setReg({ ...reg, password: e.target.value })}
                              onBlur={() => handleBlur("password")} error={touched.password && !!regErrors.password}
                              helperText={touched.password ? regErrors.password : "Ít nhất 8 ký tự, chữ hoa, chữ thường và số"}
                              slotProps={{
                                input: {
                                  startAdornment: <InputAdornment position="start"><LockIcon sx={{ color: "#999" }} /></InputAdornment>,
                                  endAdornment: <InputAdornment position="end">
                                    <IconButton onClick={() => setShowRegPw(!showRegPw)} edge="end">
                                      {showRegPw ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                  </InputAdornment>,
                                  },
                              }} />

                            {reg.password && (
                              <Box>
                                <Stack direction="row" justifyContent="space-between" sx={{ mb: .5 }}>
                                  <Typography variant="caption">Độ mạnh:</Typography>
                                  <Chip label={passwordStrength.label} size="small"
                                    sx={{ bgcolor: passwordStrength.color, color: "#fff", height: 20, fontSize: "0.65rem" }} />
                                </Stack>
                                <Box sx={{ height: 4, bgcolor: "#f0f0f0", borderRadius: 2, overflow: "hidden" }}>
                                  <Box sx={{ width: `${(passwordStrength.score / 5) * 100}%`, height: "100%",
                                    bgcolor: passwordStrength.color, transition: "width .3s" }} />
                                </Box>
                              </Box>
                            )}

                            <TextField fullWidth label="Xác nhận mật khẩu *" type={showRegConfirm ? "text" : "password"}
                              value={reg.confirmPassword} onChange={(e) => setReg({ ...reg, confirmPassword: e.target.value })}
                              onBlur={() => handleBlur("confirmPassword")}
                              error={touched.confirmPassword && !!regErrors.confirmPassword}
                              helperText={touched.confirmPassword && regErrors.confirmPassword}
                              slotProps={{
                                input: {
                                  startAdornment: <InputAdornment position="start"><LockIcon sx={{ color: "#999" }} /></InputAdornment>,
                                  endAdornment: <InputAdornment position="end">
                                    <IconButton onClick={() => setShowRegConfirm(!showRegConfirm)} edge="end">
                                      {showRegConfirm ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                  </InputAdornment>,
                                  },
                              }} />

                            <FormControlLabel control={<Checkbox checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} sx={{ color: "#f25c05" }} />}
                              label={<Typography variant="body2">
                                Tôi đồng ý với <Link href="/terms" sx={{ color: "#f25c05" }}>điều khoản sử dụng</Link>{" "}
                                và <Link href="/privacy" sx={{ color: "#f25c05" }}>chính sách bảo mật</Link>
                              </Typography>} />

                            <Stack direction="row" spacing={2}>
                              <Button fullWidth variant="outlined" onClick={() => setActiveStep(0)} startIcon={<ArrowBackIcon />}>Quay lại</Button>
                              <Button fullWidth type="submit" variant="contained" disabled={registering}
                                sx={{ bgcolor: "#f25c05", color: "#fff", fontWeight: 600, py: 1.5 }}>
                                {registering ? <CircularProgress size={24} color="inherit" /> : "Đăng ký"}
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

    </Container>
  );
}
