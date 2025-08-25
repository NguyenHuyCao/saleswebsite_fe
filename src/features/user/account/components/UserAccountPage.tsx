// src/features/account/components/UserAccountPage.tsx
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
  Snackbar,
  Alert,
} from "@mui/material";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { Gender, UserProfile } from "../types";
import { getUserById, updateUser } from "../api";

const GENDERS: Gender[] = ["Nam", "Nữ", "Khác"];

export default function UserAccountPage() {
  const [formData, setFormData] = useState<UserProfile>({
    id: 0,
    username: "",
    email: "",
    phone: "",
    address: "",
    gender: "Nam",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const formRef = useRef<HTMLDivElement>(null);
  const scrollToTop = () =>
    formRef.current?.scrollIntoView({ behavior: "smooth" });

  // Load profile
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const id = Number(user?.id);
    if (!id) {
      setLoading(false);
      return;
    }
    getUserById(id)
      .then((u) => setFormData(u))
      .catch((e) =>
        setSnackbar({ open: true, message: e.message, severity: "error" })
      )
      .finally(() => {
        setLoading(false);
        scrollToTop();
      });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id) return;
    try {
      setSaving(true);
      await updateUser(formData.id, {
        username: formData.username,
        phone: formData.phone,
        address: formData.address,
        gender: formData.gender,
      });
      // đồng bộ localStorage
      const localUser = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem(
        "user",
        JSON.stringify({ ...localUser, ...formData })
      );
      setSnackbar({
        open: true,
        message: "Cập nhật thông tin thành công!",
        severity: "success",
      });
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.message || "Lỗi kết nối máy chủ!",
        severity: "error",
      });
    } finally {
      setSaving(false);
      scrollToTop();
    }
  };

  return (
    <Box ref={formRef} px={{ xs: 2, sm: 4 }} py={4}>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Fade in timeout={600}>
        <Paper
          component={motion.div}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          elevation={4}
          sx={{ maxWidth: 600, mx: "auto", p: 4, borderRadius: 3 }}
        >
          <Typography variant="h5" fontWeight={700} textAlign="center" mb={3}>
            Cập nhật thông tin tài khoản
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Họ và tên"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  disabled={loading || saving}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={formData.email}
                  disabled
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Số điện thoại"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  disabled={loading || saving}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Địa chỉ"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  multiline
                  rows={2}
                  required
                  disabled={loading || saving}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <FormControl component="fieldset" disabled={loading || saving}>
                  <FormLabel component="legend">Giới tính</FormLabel>
                  <RadioGroup
                    row
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    {GENDERS.map((g) => (
                      <FormControlLabel
                        key={g}
                        value={g}
                        control={<Radio />}
                        label={g}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  disabled={loading || saving}
                  sx={{
                    bgcolor: "#ffb700",
                    color: "#000",
                    fontWeight: 600,
                    textTransform: "none",
                    transition: "0.3s",
                    "&:hover": { bgcolor: "#e09e00" },
                  }}
                >
                  {saving ? "Đang lưu..." : "Cập nhật"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Fade>
    </Box>
  );
}
