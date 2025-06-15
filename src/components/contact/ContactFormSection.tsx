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
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  EmailOutlined,
  Phone,
  Person,
  Subject,
  MessageOutlined,
} from "@mui/icons-material";
import { useState, useCallback, JSX } from "react";
import GlobalSnackbar from "../alert/GlobalSnackbar";

const topics = ["Báo giá", "Bảo hành", "Kỹ thuật", "Hợp tác đại lý"];

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  subject: topics[0],
  messageContent: "",
};

const ContactFormSection = () => {
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    type: "success" as "success" | "error",
    message: "",
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/contacts`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const result = await res.json();

      if (res.status === 201) {
        setSnackbar({
          open: true,
          type: "success",
          message: "Đã gửi liên hệ thành công!",
        });
        setFormData(initialForm);
      } else {
        throw new Error(result.message || "Gửi thất bại!");
      }
    } catch (error: any) {
      setSnackbar({
        open: true,
        type: "error",
        message: error.message || "Đã xảy ra lỗi khi gửi liên hệ.",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderInputAdornment = (icon: JSX.Element) => (
    <InputAdornment position="start">{icon}</InputAdornment>
  );

  const fieldStyle = {
    variant: "outlined" as const,
    fullWidth: true,
    onChange: handleChange,
    InputProps: { sx: { bgcolor: "white" } },
  };

  return (
    <Box py={8} px={isMobile ? 2 : 4} bgcolor="#f5f5f5">
      <Paper
        elevation={5}
        sx={{
          maxWidth: 850,
          mx: "auto",
          p: { xs: 3, sm: 5 },
          borderRadius: 3,
          bgcolor: "white",
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          mb={4}
          textAlign="center"
          color="primary"
        >
          Liên hệ với chúng tôi
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                {...fieldStyle}
                name="fullName"
                label="Họ và tên"
                value={formData.fullName}
                required
                autoComplete="name"
                InputProps={{
                  ...fieldStyle.InputProps,
                  startAdornment: renderInputAdornment(<Person />),
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                {...fieldStyle}
                name="email"
                label="Email"
                value={formData.email}
                required
                type="email"
                autoComplete="email"
                InputProps={{
                  ...fieldStyle.InputProps,
                  startAdornment: renderInputAdornment(<EmailOutlined />),
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                {...fieldStyle}
                name="phone"
                label="Số điện thoại"
                value={formData.phone}
                required
                type="tel"
                autoComplete="tel"
                InputProps={{
                  ...fieldStyle.InputProps,
                  startAdornment: renderInputAdornment(<Phone />),
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                {...fieldStyle}
                select
                name="subject"
                label="Chủ đề cần tư vấn"
                value={formData.subject}
                InputProps={{
                  ...fieldStyle.InputProps,
                  startAdornment: renderInputAdornment(<Subject />),
                }}
                SelectProps={{ MenuProps: { disableScrollLock: true } }}
              >
                {topics.map((topic) => (
                  <MenuItem key={topic} value={topic}>
                    {topic}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                {...fieldStyle}
                name="messageContent"
                label="Nội dung liên hệ"
                value={formData.messageContent}
                required
                multiline
                minRows={4}
                InputProps={{
                  ...fieldStyle.InputProps,
                  startAdornment: renderInputAdornment(<MessageOutlined />),
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
                sx={{
                  px: 5,
                  py: 1.5,
                  fontWeight: "bold",
                  fontSize: 16,
                  textTransform: "none",
                }}
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
