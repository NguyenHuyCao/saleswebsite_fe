"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import CloseIcon from "@mui/icons-material/Close";
import KeyOutline from "mdi-material-ui/KeyOutline";
import EyeOutline from "mdi-material-ui/EyeOutline";
import EyeOffOutline from "mdi-material-ui/EyeOffOutline";

import AlertSnackbar from "@/components/feedback/AlertSnackbar";
import { useUpdateUser, useChangePassword } from "../queries";
import type { User } from "../types";

type SnackState = { open: boolean; message: string; type: "success" | "error" };

interface Props {
  user: User | null;
  open: boolean;
  onClose: () => void;
}

export default function UserEditDialog({ user, open, onClose }: Props) {
  const [tab, setTab] = useState(0);
  const [snack, setSnack] = useState<SnackState>({ open: false, message: "", type: "success" });

  // ── Personal info form ──────────────────────────────────────────────────────
  const [form, setForm] = useState({ username: "", phone: "", address: "", gender: "" });

  useEffect(() => {
    if (user) {
      setForm({
        username: user.username ?? "",
        phone: user.phone ?? "",
        address: user.address ?? "",
        gender: user.gender ?? "",
      });
    }
    setTab(0);
  }, [user]);

  const updateUser = useUpdateUser(user?.id ?? 0);

  const handleSaveInfo = async () => {
    try {
      await updateUser.mutateAsync(form);
      toast("Cập nhật thông tin thành công!", "success");
    } catch (e: any) {
      toast(e?.message ?? "Lỗi khi cập nhật", "error");
    }
  };

  // ── Password form ───────────────────────────────────────────────────────────
  const [pw, setPw] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [showPw, setShowPw] = useState({ current: false, next: false, confirm: false });

  const changePassword = useChangePassword(user?.id ?? 0);

  const handleChangePw = async () => {
    if (pw.newPassword !== pw.confirmPassword) {
      toast("Mật khẩu xác nhận không khớp", "error");
      return;
    }
    try {
      await changePassword.mutateAsync({
        currentPassword: pw.currentPassword,
        newPassword: pw.newPassword,
        confirmPassword: pw.confirmPassword,
      });
      setPw({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast("Đổi mật khẩu thành công!", "success");
    } catch (e: any) {
      toast(e?.message ?? "Đổi mật khẩu thất bại", "error");
    }
  };

  const toast = (message: string, type: SnackState["type"]) =>
    setSnack({ open: true, message, type });

  const ToggleBtn = (k: keyof typeof showPw) => (
    <IconButton onClick={() => setShowPw((s) => ({ ...s, [k]: !s[k] }))} edge="end" size="small">
      {showPw[k] ? <EyeOutline /> : <EyeOffOutline />}
    </IconButton>
  );

  if (!user) return null;

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pr: 1 }}>
          <Box>
            <Typography variant="h6" fontWeight={600}>Chỉnh sửa người dùng</Typography>
            <Typography variant="caption" color="text.secondary">{user.email}</Typography>
          </Box>
          <IconButton onClick={onClose} size="small"><CloseIcon fontSize="small" /></IconButton>
        </DialogTitle>

        <Divider />

        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ px: 3, pt: 1 }}>
          <Tab label="Thông tin cá nhân" />
          <Tab label="Đổi mật khẩu" disabled={user.provider !== "LOCAL"} />
        </Tabs>

        <DialogContent sx={{ pt: 2 }}>
          {/* Tab 0: personal info */}
          {tab === 0 && (
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth label="Họ và tên"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Email" value={user.email} disabled helperText="Email không thể thay đổi" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth label="Số điện thoại"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  fullWidth label="Địa chỉ"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                />
              </Grid>
              <Grid size={12}>
                <Typography variant="body2" color="text.secondary" mb={0.5}>Giới tính</Typography>
                <RadioGroup row value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                  <FormControlLabel value="Nam" control={<Radio size="small" />} label="Nam" />
                  <FormControlLabel value="Nữ" control={<Radio size="small" />} label="Nữ" />
                  <FormControlLabel value="Khác" control={<Radio size="small" />} label="Khác" />
                </RadioGroup>
              </Grid>
            </Grid>
          )}

          {/* Tab 1: change password */}
          {tab === 1 && (
            <Grid container spacing={2.5}>
              {(["currentPassword", "newPassword", "confirmPassword"] as const).map((key) => {
                const labels = { currentPassword: "Mật khẩu hiện tại", newPassword: "Mật khẩu mới", confirmPassword: "Xác nhận mật khẩu mới" };
                const showKey = key === "currentPassword" ? "current" : key === "newPassword" ? "next" : "confirm";
                return (
                  <Grid size={{ xs: 12, sm: 6 }} key={key}>
                    <InputLabel sx={{ mb: 0.5 }}>{labels[key]}</InputLabel>
                    <OutlinedInput
                      fullWidth
                      type={showPw[showKey as keyof typeof showPw] ? "text" : "password"}
                      value={pw[key]}
                      onChange={(e) => setPw({ ...pw, [key]: e.target.value })}
                      startAdornment={<InputAdornment position="start"><KeyOutline /></InputAdornment>}
                      endAdornment={<InputAdornment position="end">{ToggleBtn(showKey as keyof typeof showPw)}</InputAdornment>}
                    />
                  </Grid>
                );
              })}
            </Grid>
          )}
        </DialogContent>

        <Divider />

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} variant="outlined">Đóng</Button>
          <Button
            variant="contained"
            onClick={tab === 0 ? handleSaveInfo : handleChangePw}
            disabled={updateUser.isPending || changePassword.isPending}
          >
            {(updateUser.isPending || changePassword.isPending) ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </DialogActions>
      </Dialog>

      <AlertSnackbar
        open={snack.open}
        message={snack.message}
        type={snack.type}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
      />
    </>
  );
}
