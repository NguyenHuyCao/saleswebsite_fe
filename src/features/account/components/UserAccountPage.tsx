"use client";

import {
  Box,
  Typography,
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
import Grid from "@mui/material/Grid"; 
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useMeQuery, useUpdateMe } from "@/features/account/hooks/useMe";

const genders = ["Nam", "Nữ", "Khác"];

export default function UserAccountPage() {
  const { data: me, isLoading, error } = useMeQuery();
  const { mutateAsync, isPending } = useUpdateMe();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
    gender: "Nam",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const formRef = useRef<HTMLDivElement>(null);
  const scrollToTop = () =>
    formRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    if (me) {
      setFormData({
        username: me.username || "",
        email: me.email || "",
        phone: me.phone || "",
        address: me.address || "",
        gender: me.gender || "Nam",
      });
    }
  }, [me]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await mutateAsync({
        username: formData.username,
        phone: formData.phone,
        address: formData.address,
        gender: formData.gender,
      });
      setSnackbar({
        open: true,
        message: "Cập nhật thông tin thành công!",
        severity: "success",
      });
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.message || "Cập nhật thất bại!",
        severity: "error",
      });
    } finally {
      scrollToTop();
    }
  };

  if (isLoading) return <Box p={4}>Đang tải…</Box>;
  if (error) return <Box p={4}>Lỗi: {(error as any).message}</Box>;

  return (
    <Box ref={formRef} px={{ xs: 2, sm: 4 }} py={4}>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
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
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Giới tính</FormLabel>
                  <RadioGroup
                    row
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    {genders.map((g) => (
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
                  disabled={isPending}
                  sx={{
                    bgcolor: "#ffb700",
                    color: "#000",
                    fontWeight: 600,
                    textTransform: "none",
                    transition: "0.3s",
                    "&:hover": { bgcolor: "#e09e00" },
                  }}
                >
                  {isPending ? "Đang cập nhật..." : "Cập nhật"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Fade>
    </Box>
  );
}
