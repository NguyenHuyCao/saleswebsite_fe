"use client";

import { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Radio,
  RadioGroup,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import CameraOutline from "mdi-material-ui/CameraOutline";
import KeyOutline from "mdi-material-ui/KeyOutline";
import EyeOutline from "mdi-material-ui/EyeOutline";
import EyeOffOutline from "mdi-material-ui/EyeOffOutline";
import AccountCircleOutline from "mdi-material-ui/AccountCircleOutline";
import ShieldCheckOutline from "mdi-material-ui/ShieldCheckOutline";
import EmailCheckOutline from "mdi-material-ui/EmailCheckOutline";

import AlertSnackbar from "@/components/feedback/AlertSnackbar";
import { api, http } from "@/lib/api/http";

// ─── types ───────────────────────────────────────────────────────────────────
interface UserProfile {
  id: number;
  username: string;
  email: string;
  phone: string | null;
  address: string | null;
  gender: string | null;
  picture: string | null;
  provider: string;
  emailVerified: boolean;
  profileComplete: boolean;
}

type Snack = { open: boolean; message: string; type: "success" | "error" | "info" | "warning" };
const INIT_SNACK: Snack = { open: false, message: "", type: "success" };

// ─── validation schemas ───────────────────────────────────────────────────────
const infoSchema = z.object({
  username: z.string().min(2, "Tên phải ít nhất 2 ký tự"),
  phone: z.string().min(9, "Số điện thoại không hợp lệ"),
  address: z.string().min(3, "Địa chỉ quá ngắn"),
  gender: z.string().min(1, "Vui lòng chọn giới tính"),
});
type InfoInput = z.infer<typeof infoSchema>;

const pwSchema = z
  .object({
    currentPassword: z.string().min(1, "Nhập mật khẩu hiện tại"),
    newPassword: z.string().min(6, "Mật khẩu mới ít nhất 6 ký tự"),
    confirmPassword: z.string().min(1, "Nhập lại mật khẩu mới"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });
type PwInput = z.infer<typeof pwSchema>;

// ─── helper ───────────────────────────────────────────────────────────────────
const BACKEND = (process.env.NEXT_PUBLIC_BACKEND_URL || "").replace(/\/$/, "");

function buildAvatarUrl(picture: string | null): string {
  if (!picture) return "/images/avatars/1.png";
  if (picture.startsWith("http")) return picture;
  return `${BACKEND}/storage/${picture}`;
}

// ─── main component ──────────────────────────────────────────────────────────
export default function AdminProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [tab, setTab] = useState(0);
  const [snack, setSnack] = useState<Snack>(INIT_SNACK);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState<string>("/images/avatars/1.png");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── fetch current user ──────────────────────────────────────────────────────
  useEffect(() => {
    api.get<UserProfile>("/api/v1/users/me").then((u) => {
      setUser(u);
      setAvatarSrc(buildAvatarUrl(u.picture));
    });
  }, []);

  // ── personal info form ──────────────────────────────────────────────────────
  const { control: infoCtrl, handleSubmit: handleInfoSubmit, reset: resetInfo } =
    useForm<InfoInput>({
      resolver: zodResolver(infoSchema),
      defaultValues: { username: "", phone: "", address: "", gender: "" },
    });

  useEffect(() => {
    if (user) {
      resetInfo({
        username: user.username,
        phone: user.phone ?? "",
        address: user.address ?? "",
        gender: user.gender ?? "",
      });
    }
  }, [user, resetInfo]);

  const onSaveInfo = async (data: InfoInput) => {
    try {
      const updated = await api.put<UserProfile>("/api/v1/users/me", data);
      setUser(updated);
      toast("Cập nhật thông tin thành công!", "success");
    } catch (e: any) {
      toast(e.message, "error");
    }
  };

  // ── avatar upload ───────────────────────────────────────────────────────────
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // preview ngay lập tức
    const objectUrl = URL.createObjectURL(file);
    setAvatarSrc(objectUrl);

    setAvatarLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "avatars");

      const uploadRes = await http.post<any>("/api/v1/files", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const fileName: string = uploadRes?.data?.data?.fileName;
      if (!fileName) throw new Error("Upload thất bại");

      const avatarUrl = `${BACKEND}/storage/avatars/${fileName}`;
      const updated = await api.put<UserProfile>("/api/v1/users/me/avatar", { avatarUrl });
      setUser(updated);
      setAvatarSrc(avatarUrl);
      toast("Cập nhật ảnh đại diện thành công!", "success");
    } catch (e: any) {
      setAvatarSrc(buildAvatarUrl(user?.picture ?? null));
      toast(e.message || "Tải ảnh lên thất bại", "error");
    } finally {
      setAvatarLoading(false);
      // reset input để có thể chọn lại cùng file
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // ── change password form ────────────────────────────────────────────────────
  const {
    control: pwCtrl,
    handleSubmit: handlePwSubmit,
    reset: resetPw,
  } = useForm<PwInput>({
    resolver: zodResolver(pwSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const [showPw, setShowPw] = useState({ current: false, next: false, confirm: false });

  const onChangePw = async (data: PwInput) => {
    if (!user) return;
    try {
      await api.post(`/api/v1/users/change_password?userId=${user.id}`, {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
      resetPw();
      toast("Đổi mật khẩu thành công!", "success");
    } catch (e: any) {
      toast(e.message, "error");
    }
  };

  const ToggleBtn = (k: keyof typeof showPw) => (
    <IconButton onClick={() => setShowPw((s) => ({ ...s, [k]: !s[k] }))} edge="end">
      {showPw[k] ? <EyeOutline /> : <EyeOffOutline />}
    </IconButton>
  );

  const toast = (message: string, type: Snack["type"]) =>
    setSnack({ open: true, message, type });

  // ── loading state ───────────────────────────────────────────────────────────
  if (!user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <CircularProgress />
      </Box>
    );
  }

  // ── render ──────────────────────────────────────────────────────────────────
  return (
    <Box p={{ xs: 2, md: 4 }}>
      <Typography variant="h4" fontWeight={700} mb={4}>
        Hồ sơ của tôi
      </Typography>

      <Grid container spacing={4}>
        {/* ── Profile card (left) ── */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card elevation={2} sx={{ borderRadius: 3 }}>
            <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, py: 4 }}>
              {/* Avatar + upload button */}
              <Box position="relative">
                <Avatar
                  src={avatarSrc}
                  alt={user.username}
                  sx={{ width: 110, height: 110, border: "3px solid", borderColor: "primary.main" }}
                />
                {avatarLoading && (
                  <Box
                    position="absolute" inset={0} borderRadius="50%"
                    display="flex" alignItems="center" justifyContent="center"
                    bgcolor="rgba(0,0,0,0.45)"
                  >
                    <CircularProgress size={32} sx={{ color: "#fff" }} />
                  </Box>
                )}
                <Tooltip title="Thay đổi ảnh đại diện">
                  <IconButton
                    size="small"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={avatarLoading}
                    sx={{
                      position: "absolute",
                      bottom: 4,
                      right: 4,
                      bgcolor: "primary.main",
                      color: "#fff",
                      "&:hover": { bgcolor: "primary.dark" },
                    }}
                  >
                    <CameraOutline fontSize="small" />
                  </IconButton>
                </Tooltip>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  hidden
                  onChange={handleAvatarChange}
                />
              </Box>

              <Typography variant="h6" fontWeight={600}>{user.username}</Typography>
              <Typography variant="body2" color="text.secondary">{user.email}</Typography>

              <Divider flexItem />

              {/* Info badges */}
              <Box width="100%" display="flex" flexDirection="column" gap={1.5}>
                <Box display="flex" alignItems="center" gap={1}>
                  <AccountCircleOutline fontSize="small" sx={{ color: "text.secondary" }} />
                  <Typography variant="body2" color="text.secondary" flex={1}>Vai trò</Typography>
                  <Chip label="Admin" size="small" color="primary" />
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <ShieldCheckOutline fontSize="small" sx={{ color: "text.secondary" }} />
                  <Typography variant="body2" color="text.secondary" flex={1}>Đăng nhập qua</Typography>
                  <Chip label={user.provider} size="small" variant="outlined" />
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <EmailCheckOutline fontSize="small" sx={{ color: "text.secondary" }} />
                  <Typography variant="body2" color="text.secondary" flex={1}>Email</Typography>
                  <Chip
                    label={user.emailVerified ? "Đã xác thực" : "Chưa xác thực"}
                    size="small"
                    color={user.emailVerified ? "success" : "warning"}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* ── Tabs (right) ── */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card elevation={2} sx={{ borderRadius: 3 }}>
            <Tabs
              value={tab}
              onChange={(_, v) => setTab(v)}
              sx={{ borderBottom: 1, borderColor: "divider", px: 3, pt: 2 }}
            >
              <Tab label="Thông tin cá nhân" />
              <Tab label="Bảo mật" />
            </Tabs>

            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              {/* ── Tab 0: Personal Info ── */}
              {tab === 0 && (
                <Box
                  component="form"
                  onSubmit={handleInfoSubmit(onSaveInfo)}
                  display="flex"
                  flexDirection="column"
                  gap={3}
                >
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name="username"
                        control={infoCtrl}
                        render={({ field, fieldState }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Họ và tên"
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                          />
                        )}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Email"
                        value={user.email}
                        disabled
                        helperText="Email không thể thay đổi"
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name="phone"
                        control={infoCtrl}
                        render={({ field, fieldState }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Số điện thoại"
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                          />
                        )}
                      />
                    </Grid>

                    <Grid size={12}>
                      <Controller
                        name="address"
                        control={infoCtrl}
                        render={({ field, fieldState }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Địa chỉ"
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                          />
                        )}
                      />
                    </Grid>

                    <Grid size={12}>
                      <Typography variant="body2" mb={1} color="text.secondary">Giới tính</Typography>
                      <Controller
                        name="gender"
                        control={infoCtrl}
                        render={({ field }) => (
                          <RadioGroup row {...field}>
                            <FormControlLabel value="Nam" control={<Radio />} label="Nam" />
                            <FormControlLabel value="Nữ" control={<Radio />} label="Nữ" />
                            <FormControlLabel value="Khác" control={<Radio />} label="Khác" />
                          </RadioGroup>
                        )}
                      />
                    </Grid>
                  </Grid>

                  <Box>
                    <Button type="submit" variant="contained" size="large">
                      Lưu thông tin
                    </Button>
                  </Box>
                </Box>
              )}

              {/* ── Tab 1: Change Password ── */}
              {tab === 1 && (
                <Box
                  component="form"
                  onSubmit={handlePwSubmit(onChangePw)}
                  display="flex"
                  flexDirection="column"
                  gap={3}
                >
                  {user.provider !== "LOCAL" && (
                    <Box
                      p={2}
                      borderRadius={2}
                      bgcolor="warning.light"
                      color="warning.dark"
                    >
                      <Typography variant="body2">
                        Tài khoản của bạn đăng nhập qua <strong>{user.provider}</strong>.
                        Tính năng đổi mật khẩu không áp dụng cho tài khoản liên kết bên ngoài.
                      </Typography>
                    </Box>
                  )}

                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <InputLabel htmlFor="currentPassword" sx={{ mb: 1 }}>Mật khẩu hiện tại</InputLabel>
                      <Controller
                        name="currentPassword"
                        control={pwCtrl}
                        render={({ field, fieldState }) => (
                          <OutlinedInput
                            {...field}
                            id="currentPassword"
                            fullWidth
                            disabled={user.provider !== "LOCAL"}
                            type={showPw.current ? "text" : "password"}
                            error={!!fieldState.error}
                            startAdornment={<InputAdornment position="start"><KeyOutline /></InputAdornment>}
                            endAdornment={<InputAdornment position="end">{ToggleBtn("current")}</InputAdornment>}
                          />
                        )}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <InputLabel htmlFor="newPassword" sx={{ mb: 1 }}>Mật khẩu mới</InputLabel>
                      <Controller
                        name="newPassword"
                        control={pwCtrl}
                        render={({ field, fieldState }) => (
                          <OutlinedInput
                            {...field}
                            id="newPassword"
                            fullWidth
                            disabled={user.provider !== "LOCAL"}
                            type={showPw.next ? "text" : "password"}
                            error={!!fieldState.error}
                            startAdornment={<InputAdornment position="start"><KeyOutline /></InputAdornment>}
                            endAdornment={<InputAdornment position="end">{ToggleBtn("next")}</InputAdornment>}
                          />
                        )}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <InputLabel htmlFor="confirmPassword" sx={{ mb: 1 }}>Xác nhận mật khẩu mới</InputLabel>
                      <Controller
                        name="confirmPassword"
                        control={pwCtrl}
                        render={({ field, fieldState }) => (
                          <OutlinedInput
                            {...field}
                            id="confirmPassword"
                            fullWidth
                            disabled={user.provider !== "LOCAL"}
                            type={showPw.confirm ? "text" : "password"}
                            error={!!fieldState.error}
                            startAdornment={<InputAdornment position="start"><KeyOutline /></InputAdornment>}
                            endAdornment={<InputAdornment position="end">{ToggleBtn("confirm")}</InputAdornment>}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>

                  <Box>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={user.provider !== "LOCAL"}
                    >
                      Đổi mật khẩu
                    </Button>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <AlertSnackbar
        open={snack.open}
        message={snack.message}
        type={snack.type}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
      />
    </Box>
  );
}
