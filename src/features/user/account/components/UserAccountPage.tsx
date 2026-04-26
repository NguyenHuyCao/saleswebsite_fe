"use client";

import {
  Box,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  Fade,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Avatar,
  Stack,
  Divider,
  Tabs,
  Tab,
  IconButton,
  InputAdornment,
  Tooltip,
  Card,
  CardContent,
  CircularProgress,
  LinearProgress,
  Chip,
  Alert,
} from "@mui/material";
import { useEffect, useRef, useState, useMemo } from "react";
import type { Gender, UserProfile } from "../types";
import { useUpdateUser, useUserProfile, useUserStats } from "../queries";
import { useMeQuery } from "@/features/user/auth/queries";
import { useChangePasswordMe } from "@/features/user/auth/queries";
import { useToast } from "@/lib/toast/ToastContext";
import {
  Person,
  Email,
  Phone,
  LocationOn,
  Cake,
  Edit,
  Save,
  LockOutlined,
  History,
  ShoppingBag,
  Favorite,
  Visibility,
  VisibilityOff,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";

const GENDERS: Gender[] = ["Nam", "Nữ", "Khác"];

const checkPasswordStrength = (password: string) => {
  const requirements = [
    { met: password.length >= 8, text: "Ít nhất 8 ký tự" },
    { met: /[A-Z]/.test(password), text: "Ít nhất 1 chữ hoa" },
    { met: /[a-z]/.test(password), text: "Ít nhất 1 chữ thường" },
    { met: /[0-9]/.test(password), text: "Ít nhất 1 số" },
    { met: /[^A-Za-z0-9]/.test(password), text: "Ít nhất 1 ký tự đặc biệt" },
  ];
  const metCount = requirements.filter((r) => r.met).length;
  const labels = ["Rất yếu", "Rất yếu", "Yếu", "Trung bình", "Mạnh", "Rất mạnh"];
  const colors = ["#f44336", "#f44336", "#ff9800", "#ffc107", "#8bc34a", "#4caf50"];
  return { score: metCount, label: labels[metCount], color: colors[metCount], requirements };
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <Card variant="outlined" sx={{ borderRadius: 2, borderColor: "#f0f0f0" }}>
      <CardContent sx={{ py: 1.5, px: 2, "&:last-child": { pb: 1.5 } }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={1} alignItems="center">
            {icon}
            <Typography variant="body2" color="text.secondary">{label}</Typography>
          </Stack>
          <Typography fontWeight={700} color="#f25c05" variant="body2">{value}</Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function UserAccountPage() {
  const { showToast } = useToast();
  const [tabValue, setTabValue] = useState(0);
  const [editing, setEditing] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const { data: me } = useMeQuery();
  const userId = me?.id ?? undefined;

  const { data, isLoading } = useUserProfile(userId);
  const { data: userStats } = useUserStats(userId ?? undefined);
  const { mutateAsync: mutateUpdate, isPending } = useUpdateUser(userId ?? undefined);
  const { mutateAsync: mutateChangePassword, isPending: isChangingPassword } = useChangePasswordMe();

  const [formData, setFormData] = useState<UserProfile>({
    id: 0,
    username: "",
    email: "",
    phone: "",
    address: "",
    gender: "Nam",
    birthDate: "",
    avatar: "",
    createdAt: "",
  });

  // Change password form state
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [pwShow, setPwShow] = useState({ current: false, new: false, confirm: false });
  const [pwTouched, setPwTouched] = useState({ current: false, new: false, confirm: false });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (data) setFormData(data);
  }, [data]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setEditing(false);
  };

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    try {
      const updateData: any = {
        username: formData.username,
        phone: formData.phone,
        address: formData.address,
        gender: formData.gender,
      };
      if (formData.birthDate) updateData.birthDate = formData.birthDate;
      await mutateUpdate(updateData);
      const localUser = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({ ...localUser, ...formData }));
      showToast("Thông tin tài khoản đã được cập nhật.", "success", "Cập nhật thành công");
      setEditing(false);
    } catch (err: any) {
      showToast(err?.message || "Lỗi kết nối máy chủ!", "error");
    }
  };

  // Password strength
  const passwordStrength = useMemo(() => checkPasswordStrength(pwForm.newPassword), [pwForm.newPassword]);

  const pwErrors = useMemo(() => {
    const err: { current?: string; new?: string; confirm?: string } = {};
    if (pwTouched.current && !pwForm.currentPassword) err.current = "Vui lòng nhập mật khẩu hiện tại";
    if (pwTouched.new) {
      if (!pwForm.newPassword) err.new = "Vui lòng nhập mật khẩu mới";
      else if (pwForm.newPassword.length < 6) err.new = "Mật khẩu phải có ít nhất 6 ký tự";
      else if (pwTouched.current && pwForm.currentPassword === pwForm.newPassword)
        err.new = "Mật khẩu mới không được giống mật khẩu hiện tại";
    }
    if (pwTouched.confirm) {
      if (!pwForm.confirmPassword) err.confirm = "Vui lòng xác nhận mật khẩu";
      else if (pwForm.newPassword !== pwForm.confirmPassword) err.confirm = "Mật khẩu xác nhận không khớp";
    }
    return err;
  }, [pwForm, pwTouched]);

  const canSubmitPassword = useMemo(() =>
    pwForm.currentPassword &&
    pwForm.newPassword &&
    pwForm.confirmPassword &&
    pwForm.newPassword === pwForm.confirmPassword &&
    pwForm.newPassword.length >= 6 &&
    pwForm.currentPassword !== pwForm.newPassword &&
    passwordStrength.score >= 3,
    [pwForm, passwordStrength.score]
  );

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwTouched({ current: true, new: true, confirm: true });
    if (!canSubmitPassword) {
      showToast("Vui lòng kiểm tra lại thông tin và đảm bảo mật khẩu đủ mạnh", "warning");
      return;
    }
    try {
      await mutateChangePassword({
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
        confirmPassword: pwForm.confirmPassword,
      });
      showToast("Đổi mật khẩu thành công!", "success", "Đổi mật khẩu");
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setPwTouched({ current: false, new: false, confirm: false });
    } catch (err: any) {
      showToast(err?.message || "Lỗi kết nối tới máy chủ!", "error");
    }
  };

  const loading = isLoading || !userId;

  return (
    <Box sx={{ px: { xs: 1, sm: 2, md: 0 }, py: { xs: 2, md: 4 } }}>
      <style>{`
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-16px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(16px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .anim-left  { animation: slideInLeft  0.5s ease both; }
        .anim-right { animation: slideInRight 0.5s ease both; }
      `}</style>

      <Grid container spacing={{ xs: 2, md: 3 }}>
        {/* Left: Profile sidebar */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper className="anim-left" elevation={0} sx={{ p: { xs: 2.5, sm: 3 }, borderRadius: 3, border: "1px solid #f0f0f0", height: "100%" }}>
            {/* Avatar */}
            <Box sx={{ textAlign: "center", mb: 2.5 }}>
              <Box sx={{ position: "relative", display: "inline-block" }}>
                <Avatar
                  src={avatarPreview || formData.avatar || undefined}
                  sx={{
                    width: { xs: 96, sm: 110 },
                    height: { xs: 96, sm: 110 },
                    mx: "auto",
                    border: "3px solid #ffb700",
                    fontSize: 40,
                    bgcolor: "#f25c05",
                    cursor: "pointer",
                  }}
                  onClick={handleAvatarClick}
                >
                  {formData.username?.[0]?.toUpperCase() || "U"}
                </Avatar>
                <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleAvatarChange} />
                <Tooltip title="Đổi ảnh đại diện">
                  <IconButton
                    size="small"
                    onClick={handleAvatarClick}
                    sx={{
                      position: "absolute",
                      bottom: 4,
                      right: 4,
                      bgcolor: "#ffb700",
                      width: 28,
                      height: 28,
                      "&:hover": { bgcolor: "#ffa000" },
                    }}
                  >
                    <Edit sx={{ fontSize: 14 }} />
                  </IconButton>
                </Tooltip>
              </Box>

              <Typography variant="h6" fontWeight={700} sx={{ mt: 1.5 }}>
                {formData.username || "—"}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5, mt: 0.5 }}>
                <Email sx={{ fontSize: 14 }} />
                {formData.email || "—"}
              </Typography>
              {formData.birthDate && (
                <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5, mt: 0.5 }}>
                  <Cake sx={{ fontSize: 14 }} />
                  {new Date(formData.birthDate).toLocaleDateString("vi-VN")}
                </Typography>
              )}
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* Stats */}
            <Stack spacing={1.5}>
              <StatCard
                icon={<ShoppingBag sx={{ fontSize: 18, color: "#f25c05" }} />}
                label="Đơn hàng"
                value={userStats?.totalOrders ?? 0}
              />
              <StatCard
                icon={<Favorite sx={{ fontSize: 18, color: "#f25c05" }} />}
                label="Yêu thích"
                value={userStats?.wishlistCount ?? 0}
              />
              <StatCard
                icon={<History sx={{ fontSize: 18, color: "#f25c05" }} />}
                label="Tham gia"
                value={
                  formData.createdAt
                    ? new Date(formData.createdAt).toLocaleDateString("vi-VN")
                    : "N/A"
                }
              />
            </Stack>
          </Paper>
        </Grid>

        {/* Right: Tabs */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper className="anim-right" elevation={0} sx={{ borderRadius: 3, border: "1px solid #f0f0f0", overflow: "hidden" }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{
                borderBottom: "1px solid #f0f0f0",
                "& .MuiTab-root": { fontWeight: 600, fontSize: { xs: "0.75rem", sm: "0.875rem" }, textTransform: "none", py: 1.5 },
                "& .Mui-selected": { color: "#f25c05" },
                "& .MuiTabs-indicator": { bgcolor: "#f25c05", height: 3 },
              }}
            >
              <Tab label="Thông tin cá nhân" />
              <Tab label="Đổi mật khẩu" />
              <Tab label="Địa chỉ giao hàng" />
            </Tabs>

            <Box sx={{ px: { xs: 2, sm: 3 }, pb: 3 }}>
              {/* Tab 0: Personal Info */}
              <TabPanel value={tabValue} index={0}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
                  <Typography variant="subtitle1" fontWeight={700}>Thông tin cá nhân</Typography>
                  <Button
                    size="small"
                    variant={editing ? "outlined" : "contained"}
                    startIcon={<Edit sx={{ fontSize: 16 }} />}
                    onClick={() => setEditing(!editing)}
                    sx={{
                      textTransform: "none",
                      fontWeight: 600,
                      borderRadius: 2,
                      ...(editing
                        ? { borderColor: "#ccc", color: "#666" }
                        : { bgcolor: "#f25c05", "&:hover": { bgcolor: "#e64a19" } }),
                    }}
                  >
                    {editing ? "Hủy" : "Chỉnh sửa"}
                  </Button>
                </Stack>

                <form onSubmit={handleSubmit}>
                  <Grid container spacing={2.5}>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Họ và tên"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        disabled={!editing || loading || isPending}
                        autoComplete="name"
                        slotProps={{ input: { startAdornment: <InputAdornment position="start"><Person sx={{ fontSize: 18, color: "#999" }} /></InputAdornment> } }}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Email"
                        name="email"
                        value={formData.email}
                        disabled
                        autoComplete="email"
                        slotProps={{ input: { startAdornment: <InputAdornment position="start"><Email sx={{ fontSize: 18, color: "#999" }} /></InputAdornment> } }}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Số điện thoại"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={!editing || loading || isPending}
                        autoComplete="tel"
                        slotProps={{ input: { startAdornment: <InputAdornment position="start"><Phone sx={{ fontSize: 18, color: "#999" }} /></InputAdornment> } }}
                      />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Địa chỉ"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        multiline
                        rows={2}
                        disabled={!editing || loading || isPending}
                        autoComplete="street-address"
                        slotProps={{ input: { startAdornment: <InputAdornment position="start"><LocationOn sx={{ fontSize: 18, color: "#999", alignSelf: "flex-start", mt: 0.5 }} /></InputAdornment> } }}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Ngày sinh"
                        name="birthDate"
                        type="date"
                        value={formData.birthDate || ""}
                        onChange={handleChange}
                        disabled={!editing || loading || isPending}
                        slotProps={{ inputLabel: { shrink: true }, input: { startAdornment: <InputAdornment position="start"><Cake sx={{ fontSize: 18, color: "#999" }} /></InputAdornment> } }}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormControl component="fieldset" disabled={!editing || loading || isPending}>
                        <FormLabel component="legend" sx={{ fontSize: "0.8rem" }}>Giới tính</FormLabel>
                        <RadioGroup row name="gender" value={formData.gender} onChange={handleChange}>
                          {GENDERS.map((g) => (
                            <FormControlLabel
                              key={g}
                              value={g}
                              control={<Radio size="small" sx={{ "&.Mui-checked": { color: "#f25c05" } }} />}
                              label={<Typography variant="body2">{g}</Typography>}
                            />
                          ))}
                        </RadioGroup>
                      </FormControl>
                    </Grid>

                    {editing && (
                      <Grid size={{ xs: 12 }}>
                        <Button
                          fullWidth
                          type="submit"
                          variant="contained"
                          disabled={loading || isPending}
                          startIcon={isPending ? <CircularProgress size={16} color="inherit" /> : <Save />}
                          sx={{
                            bgcolor: "#f25c05",
                            color: "#fff",
                            fontWeight: 700,
                            textTransform: "none",
                            py: 1.25,
                            borderRadius: 2,
                            "&:hover": { bgcolor: "#e64a19" },
                            "&.Mui-disabled": { bgcolor: "#f0f0f0", color: "#999" },
                          }}
                        >
                          {isPending ? "Đang lưu..." : "Lưu thay đổi"}
                        </Button>
                      </Grid>
                    )}
                  </Grid>
                </form>
              </TabPanel>

              {/* Tab 1: Change Password */}
              <TabPanel value={tabValue} index={1}>
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2.5 }}>Đổi mật khẩu</Typography>

                <form onSubmit={handlePasswordSubmit}>
                  <Stack spacing={2.5}>
                    {/* Current Password */}
                    <TextField
                      fullWidth
                      size="small"
                      label="Mật khẩu hiện tại"
                      type={pwShow.current ? "text" : "password"}
                      value={pwForm.currentPassword}
                      onChange={(e) => setPwForm((p) => ({ ...p, currentPassword: e.target.value }))}
                      onBlur={() => setPwTouched((p) => ({ ...p, current: true }))}
                      error={pwTouched.current && !!pwErrors.current}
                      helperText={pwTouched.current && pwErrors.current}
                      autoComplete="current-password"
                      slotProps={{
                        input: {
                          startAdornment: <InputAdornment position="start"><LockOutlined sx={{ fontSize: 18, color: "#999" }} /></InputAdornment>,
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton size="small" onClick={() => setPwShow((s) => ({ ...s, current: !s.current }))}>
                                {pwShow.current ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        },
                      }}
                    />

                    {/* New Password */}
                    <Box>
                      <TextField
                        fullWidth
                        size="small"
                        label="Mật khẩu mới"
                        type={pwShow.new ? "text" : "password"}
                        value={pwForm.newPassword}
                        onChange={(e) => setPwForm((p) => ({ ...p, newPassword: e.target.value }))}
                        onBlur={() => setPwTouched((p) => ({ ...p, new: true }))}
                        error={pwTouched.new && !!pwErrors.new}
                        helperText={pwTouched.new && pwErrors.new}
                        autoComplete="new-password"
                        slotProps={{
                          input: {
                            startAdornment: <InputAdornment position="start"><LockOutlined sx={{ fontSize: 18, color: "#999" }} /></InputAdornment>,
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton size="small" onClick={() => setPwShow((s) => ({ ...s, new: !s.new }))}>
                                  {pwShow.new ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          },
                        }}
                      />

                      {/* Strength meter */}
                      {pwForm.newPassword && (
                        <Box sx={{ mt: 1.5 }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                            <Typography variant="caption" fontWeight={600} color="text.secondary">Độ mạnh:</Typography>
                            <Chip label={passwordStrength.label} size="small" sx={{ bgcolor: passwordStrength.color, color: "#fff", height: 18, fontSize: "0.6rem", fontWeight: 700 }} />
                          </Stack>
                          <LinearProgress
                            variant="determinate"
                            value={(passwordStrength.score / 5) * 100}
                            sx={{ height: 5, borderRadius: 3, bgcolor: "#f0f0f0", "& .MuiLinearProgress-bar": { bgcolor: passwordStrength.color, borderRadius: 3 } }}
                          />
                          <Stack spacing={0.25} sx={{ mt: 1 }}>
                            {passwordStrength.requirements.map((req, i) => (
                              <Stack key={i} direction="row" alignItems="center" spacing={0.5}>
                                {req.met
                                  ? <CheckCircle sx={{ fontSize: 13, color: "#4caf50" }} />
                                  : <Cancel sx={{ fontSize: 13, color: "#f44336" }} />}
                                <Typography variant="caption" sx={{ color: req.met ? "#4caf50" : "#f44336" }}>{req.text}</Typography>
                              </Stack>
                            ))}
                          </Stack>
                        </Box>
                      )}
                    </Box>

                    {/* Confirm Password */}
                    <TextField
                      fullWidth
                      size="small"
                      label="Xác nhận mật khẩu mới"
                      type={pwShow.confirm ? "text" : "password"}
                      value={pwForm.confirmPassword}
                      onChange={(e) => setPwForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                      onBlur={() => setPwTouched((p) => ({ ...p, confirm: true }))}
                      error={pwTouched.confirm && !!pwErrors.confirm}
                      helperText={pwTouched.confirm && pwErrors.confirm}
                      autoComplete="new-password"
                      slotProps={{
                        input: {
                          startAdornment: <InputAdornment position="start"><LockOutlined sx={{ fontSize: 18, color: "#999" }} /></InputAdornment>,
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton size="small" onClick={() => setPwShow((s) => ({ ...s, confirm: !s.confirm }))}>
                                {pwShow.confirm ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        },
                      }}
                    />

                    <Alert severity="info" sx={{ borderRadius: 2, py: 0.5 }}>
                      <Typography variant="caption" display="block">• Không dùng mật khẩu dễ đoán như "123456"</Typography>
                      <Typography variant="caption" display="block">• Không chia sẻ mật khẩu với bất kỳ ai</Typography>
                    </Alert>

                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      disabled={isChangingPassword || !canSubmitPassword}
                      startIcon={isChangingPassword ? <CircularProgress size={16} color="inherit" /> : <LockOutlined />}
                      sx={{
                        bgcolor: "#f25c05",
                        color: "#fff",
                        fontWeight: 700,
                        textTransform: "none",
                        py: 1.25,
                        borderRadius: 2,
                        "&:hover": { bgcolor: "#e64a19" },
                        "&.Mui-disabled": { bgcolor: "#f0f0f0", color: "#999" },
                      }}
                    >
                      {isChangingPassword ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
                    </Button>
                  </Stack>
                </form>
              </TabPanel>

              {/* Tab 2: Shipping Address */}
              <TabPanel value={tabValue} index={2}>
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>Sổ địa chỉ</Typography>
                <Alert severity="info" sx={{ borderRadius: 2 }}>
                  Tính năng quản lý địa chỉ giao hàng đang được phát triển. Vui lòng quay lại sau.
                </Alert>
              </TabPanel>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
