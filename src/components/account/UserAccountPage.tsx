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
import { useState, useEffect, useRef } from "react";

const genders = ["Nam", "Nữ", "Khác"];

export default function AccountPage() {
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

  const scrollToTop = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!user?.id || !token) return;

    const fetchUserData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        if (res.ok && data.data) {
          setFormData(data.data);
        } else {
          throw new Error(
            data.message || "Không lấy được thông tin người dùng"
          );
        }
      } catch (err: any) {
        setSnackbar({
          open: true,
          message: err.message,
          severity: "error",
        });
        scrollToTop();
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!user?.id || !token) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();
      if (res.ok) {
        setSnackbar({
          open: true,
          message: "Cập nhật thông tin thành công!",
          severity: "success",
        });
        localStorage.setItem("user", JSON.stringify({ ...user, ...formData }));
      } else {
        throw new Error(data.message || "Cập nhật thất bại!");
      }
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.message || "Lỗi kết nối máy chủ!",
        severity: "error",
      });
    } finally {
      scrollToTop();
    }
  };

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
                    {genders.map((gender) => (
                      <FormControlLabel
                        key={gender}
                        value={gender}
                        control={<Radio />}
                        label={gender}
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
                  sx={{
                    bgcolor: "#ffb700",
                    color: "#000",
                    fontWeight: 600,
                    textTransform: "none",
                    transition: "0.3s",
                    "&:hover": {
                      bgcolor: "#e09e00",
                    },
                  }}
                >
                  Cập nhật
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Fade>
    </Box>
  );
}
