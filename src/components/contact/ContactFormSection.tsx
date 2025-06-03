"use client";

import {
  Box,
  Grid,
  TextField,
  Button,
  MenuItem,
  Paper,
  Typography,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneIcon from "@mui/icons-material/Phone";
import PersonIcon from "@mui/icons-material/Person";
import SubjectIcon from "@mui/icons-material/Subject";
import MessageOutlinedIcon from "@mui/icons-material/MessageOutlined";
import GlobalSnackbar from "../alert/GlobalSnackbar";

const topics = ["Báo giá", "Bảo hành", "Kỹ thuật", "Hợp tác đại lý"];

const ContactFormSection = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: topics[0],
    messageContent: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    type: "success" as "success" | "error",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/v1/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (res.status === 201) {
        setSnackbar({
          open: true,
          type: "success",
          message: "Đã gửi liên hệ thành công!",
        });
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          subject: topics[0],
          messageContent: "",
        });
      } else {
        throw new Error(result.message || "Gửi thất bại!");
      }
    } catch (error: any) {
      setSnackbar({
        open: true,
        type: "error",
        message: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box py={8} px={4} bgcolor="#f5f5f5">
      <Paper
        elevation={4}
        sx={{ maxWidth: 800, mx: "auto", p: 4, borderRadius: 3 }}
      >
        <Typography variant="h5" fontWeight="bold" mb={4} textAlign="center">
          Liên hệ với chúng tôi
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                label="Họ và tên"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                name="email"
                value={formData.email}
                onChange={handleChange}
                label="Email"
                required
                type="email"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlinedIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                label="Số điện thoại"
                required
                type="tel"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                label="Chủ đề cần tư vấn"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SubjectIcon />
                    </InputAdornment>
                  ),
                }}
                SelectProps={{
                  MenuProps: {
                    disablePortal: false, // ✅ Hiển thị menu ra ngoài layout gốc
                    disableScrollLock: true, // ✅ Không khóa scroll khi mở dropdown
                  },
                }}
              >
                {topics.map((topic, index) => (
                  <MenuItem key={index} value={topic}>
                    {topic}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                name="messageContent"
                value={formData.messageContent}
                onChange={handleChange}
                label="Nội dung liên hệ"
                required
                multiline
                minRows={4}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MessageOutlinedIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={{ xs: 12 }} textAlign="center">
              <Button
                type="submit"
                variant="contained"
                color="warning"
                size="large"
                disabled={loading}
                sx={{ px: 5, py: 1.5, fontWeight: "bold" }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Gửi liên hệ"
                )}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <GlobalSnackbar
        type={snackbar.type}
        message={snackbar.message}
        open={snackbar.open}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      />
    </Box>
  );
};

export default ContactFormSection;
