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
import { useUpdateUser, useUserProfile } from "../queries";

const GENDERS: Gender[] = ["Nam", "Nữ", "Khác"];

function getLocalUserId(): number | null {
  try {
    const u = JSON.parse(localStorage.getItem("user") || "{}");
    return Number(u?.id) || null;
  } catch {
    return null;
  }
}

export default function UserAccountPage() {
  const [userId, setUserId] = useState<number | null>(null);

  // đọc id 1 lần từ localStorage
  useEffect(() => setUserId(getLocalUserId), []);

  const { data, isLoading } = useUserProfile(userId ?? undefined);
  const { mutateAsync: mutateUpdate, isPending } = useUpdateUser(
    userId ?? undefined
  );

  const [formData, setFormData] = useState<UserProfile>({
    id: 0,
    username: "",
    email: "",
    phone: "",
    address: "",
    gender: "Nam",
  });

  useEffect(() => {
    if (data) setFormData(data);
  }, [data]);

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const formRef = useRef<HTMLDivElement>(null);
  const scrollToTop = () =>
    formRef.current?.scrollIntoView({ behavior: "smooth" });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    try {
      await mutateUpdate({
        username: formData.username,
        phone: formData.phone,
        address: formData.address,
        gender: formData.gender,
      });

      // đồng bộ lại localStorage (chỉ các field người dùng chỉnh)
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
        message: err?.message || "Lỗi kết nối máy chủ!",
        severity: "error",
      });
    } finally {
      scrollToTop();
    }
  };

  const loading = isLoading || !userId;

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
                  disabled={loading || isPending}
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
                  disabled={loading || isPending}
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
                  disabled={loading || isPending}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <FormControl
                  component="fieldset"
                  disabled={loading || isPending}
                >
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
                  disabled={loading || isPending}
                  sx={{
                    bgcolor: "#ffb700",
                    color: "#000",
                    fontWeight: 600,
                    textTransform: "none",
                    transition: "0.3s",
                    "&:hover": { bgcolor: "#e09e00" },
                  }}
                >
                  {isPending ? "Đang lưu..." : "Cập nhật"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Fade>
    </Box>
  );
}
