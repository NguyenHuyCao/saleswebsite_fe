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
import { useState } from "react";

const genders = ["Nam", "Nữ", "Khác"];

export default function AccountPage() {
  const [formData, setFormData] = useState({
    username: "user",
    email: "user@gmail.com",
    phone: "0813421432",
    address: "1234 Maple St, Springfield, IL 62701",
    gender: "Nam",
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Updated Data:", formData);
    setSnackbarMessage("Cập nhật thông tin thành công!");
    setSnackbarOpen(true);
  };

  return (
    <Box px={{ xs: 2, sm: 4 }} py={4}>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Fade in timeout={500}>
        <Paper
          component={motion.div}
          elevation={4}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          sx={{ maxWidth: 600, mx: "auto", p: 4, borderRadius: 3 }}
        >
          <Typography variant="h5" fontWeight="bold" mb={3} textAlign="center">
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
                    {genders.map((option) => (
                      <FormControlLabel
                        key={option}
                        value={option}
                        control={<Radio />}
                        label={option}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ bgcolor: "#ffb700", color: "black", fontWeight: 600 }}
                  type="submit"
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
