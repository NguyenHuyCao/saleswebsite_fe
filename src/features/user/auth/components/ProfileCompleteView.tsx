"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Box, Paper, Typography, TextField, Button, Stack,
  InputAdornment, CircularProgress, Alert, Fade,
  FormControl, InputLabel, Select, MenuItem, Avatar,
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import HomeIcon from "@mui/icons-material/Home";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCompleteProfile, useMeQuery } from "../queries";
import type { Gender } from "../types";

const phoneRegex = /^(03|05|07|08|09)[0-9]{8}$/;

export default function ProfileCompleteView() {
  const router = useRouter();
  const { data: me, isLoading } = useMeQuery();

  const [form, setForm] = useState({ phone: "", address: "", gender: "" as Gender | "" });
  const [touched, setTouched] = useState({ phone: false, address: false });
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const { mutateAsync, isPending } = useCompleteProfile();

  // Redirect if profile already complete
  useEffect(() => {
    if (me && me.profileComplete) {
      router.replace("/");
    }
  }, [me, router]);

  const phoneError = touched.phone && !phoneRegex.test(form.phone)
    ? "Số điện thoại không hợp lệ (bắt đầu 03/05/07/08/09, 10 số)"
    : "";

  const canSubmit = phoneRegex.test(form.phone);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ phone: true, address: true });
    if (!canSubmit) return;

    setError("");
    try {
      await mutateAsync({
        phone: form.phone,
        address: form.address || undefined,
        gender: (form.gender || undefined) as Gender | undefined,
      });
      setDone(true);
      setTimeout(() => router.replace("/"), 1800);
    } catch (err: any) {
      setError(err?.message || "Đã xảy ra lỗi, vui lòng thử lại.");
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (done) {
    return (
      <Box sx={{ maxWidth: 460, mx: "auto", px: 2, py: 6 }}>
        <Paper
          component={motion.div}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          elevation={4}
          sx={{ p: { xs: 3, sm: 4 }, borderRadius: 3, textAlign: "center" }}
        >
          <Box
            sx={{
              width: 72, height: 72, borderRadius: "50%",
              bgcolor: "#e8f5e9", display: "flex",
              alignItems: "center", justifyContent: "center",
              mx: "auto", mb: 2,
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 40, color: "#4caf50" }} />
          </Box>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Hồ sơ đã hoàn thiện!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Đang chuyển hướng về trang chủ...
          </Typography>
          <CircularProgress size={24} sx={{ mt: 2, color: "#f25c05" }} />
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", px: 2, py: 6 }}>
      <Paper
        component={motion.div}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        elevation={4}
        sx={{ p: { xs: 3, sm: 4 }, borderRadius: 3 }}
      >
        <Stack spacing={3}>
          {/* Header with avatar */}
          <Box sx={{ textAlign: "center" }}>
            {me?.picture ? (
              <Avatar
                src={me.picture}
                sx={{ width: 72, height: 72, mx: "auto", mb: 1.5 }}
              />
            ) : (
              <Box
                sx={{
                  width: 72, height: 72, borderRadius: "50%",
                  bgcolor: "#fff3e0", display: "flex",
                  alignItems: "center", justifyContent: "center",
                  mx: "auto", mb: 1.5,
                }}
              >
                <AccountCircleIcon sx={{ fontSize: 40, color: "#f25c05" }} />
              </Box>
            )}
            <Typography variant="h5" fontWeight={700} gutterBottom>
              Hoàn thiện hồ sơ
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Chào mừng <strong>{me?.username ?? me?.email}</strong>! Vui lòng cung cấp thêm
              thông tin để hoàn tất tài khoản.
            </Typography>
          </Box>

          <Alert severity="info" sx={{ borderRadius: 2 }}>
            Bạn đã đăng nhập qua {me?.provider === "GOOGLE" ? "Google" : "Facebook"}.
            Chúng tôi cần số điện thoại để xử lý đơn hàng và hỗ trợ bạn.
          </Alert>

          {error && (
            <Alert severity="error" sx={{ borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              {/* Phone — required */}
              <TextField
                fullWidth
                label="Số điện thoại *"
                type="tel"
                value={form.phone}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
                error={!!phoneError}
                helperText={phoneError || "Ví dụ: 0912345678"}
                autoFocus
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon sx={{ color: "#999" }} />
                      </InputAdornment>
                    ),
                    },
                }}
              />

              {/* Gender — optional */}
              <FormControl fullWidth>
                <InputLabel>Giới tính (tùy chọn)</InputLabel>
                <Select
                  value={form.gender}
                  label="Giới tính (tùy chọn)"
                  onChange={(e) => setForm((p) => ({ ...p, gender: e.target.value as Gender | "" }))}
                >
                  <MenuItem value="">Không muốn cung cấp</MenuItem>
                  <MenuItem value="Nam">Nam</MenuItem>
                  <MenuItem value="Nữ">Nữ</MenuItem>
                  <MenuItem value="Khác">Khác</MenuItem>
                </Select>
              </FormControl>

              {/* Address — optional */}
              <TextField
                fullWidth
                label="Địa chỉ (tùy chọn)"
                multiline
                rows={2}
                value={form.address}
                onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <HomeIcon sx={{ color: "#999", alignSelf: "flex-start", mt: 1 }} />
                      </InputAdornment>
                    ),
                    },
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isPending || !canSubmit}
                sx={{
                  bgcolor: "#f25c05", color: "#fff", fontWeight: 700,
                  textTransform: "none", py: 1.5, borderRadius: 2,
                  "&:hover": { bgcolor: "#e64a19" },
                  "&.Mui-disabled": { bgcolor: "#f0f0f0", color: "#999" },
                }}
              >
                {isPending ? <CircularProgress size={22} color="inherit" /> : "Hoàn thiện hồ sơ"}
              </Button>

              <Typography variant="caption" color="text.secondary" textAlign="center">
                Bạn có thể cập nhật thông tin này sau trong trang tài khoản.
              </Typography>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Box>
  );
}
