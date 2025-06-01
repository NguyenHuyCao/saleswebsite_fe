"use client";

import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Snackbar,
} from "@mui/material";
import { motion } from "framer-motion";
import { useState } from "react";
import MuiAlert from "@mui/material/Alert";

const Alert = (props) => <MuiAlert elevation={6} variant="filled" {...props} />;

export default function ChangePasswordPage() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = formData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      setSnackbar({
        open: true,
        message: "Vui lòng điền đầy đủ thông tin.",
        severity: "warning",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setSnackbar({
        open: true,
        message: "Mật khẩu mới không khớp.",
        severity: "error",
      });
      return;
    }

    // Simulate success
    setSnackbar({
      open: true,
      message: "Cập nhật mật khẩu thành công!",
      severity: "success",
    });
  };

  return (
    <Box px={2} py={4} display="flex" justifyContent="center">
      <Paper
        component={motion.div}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: 460,
          p: 4,
          borderRadius: 2,
          bgcolor: "#fff",
        }}
      >
        <Typography variant="h5" fontWeight={600} mb={3} textAlign="center">
          Đổi mật khẩu
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Mật khẩu hiện tại"
            name="currentPassword"
            type="password"
            value={formData.currentPassword}
            onChange={handleChange}
            sx={{ mb: 2 }}
            size="small"
            required
          />
          <TextField
            fullWidth
            label="Mật khẩu mới"
            name="newPassword"
            type="password"
            value={formData.newPassword}
            onChange={handleChange}
            sx={{ mb: 2 }}
            size="small"
            required
          />
          <TextField
            fullWidth
            label="Xác nhận mật khẩu mới"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            sx={{ mb: 3 }}
            size="small"
            required
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              bgcolor: "#000",
              color: "#fff",
              fontWeight: 600,
              borderRadius: 1,
              textTransform: "none",
            }}
          >
            Cập nhật mật khẩu
          </Button>
        </form>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
