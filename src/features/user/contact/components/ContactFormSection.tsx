"use client";

import {
  Box,
  TextField,
  Button,
  MenuItem,
  Paper,
  Typography,
  InputAdornment,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Stack,
  Chip,
  FormHelperText,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  EmailOutlined,
  Phone,
  Person,
  Subject,
  MessageOutlined,
  AttachFile,
  CheckCircle,
} from "@mui/icons-material";
import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GlobalSnackbar from "@/components/alert/GlobalSnackbar";
import { useSendContact } from "../queries";
import type { ContactPayload } from "../types";

const topics = [
  "Báo giá",
  "Bảo hành",
  "Kỹ thuật",
  "Hợp tác đại lý",
  "Khiếu nại",
] as const;

const initialForm: ContactPayload = {
  fullName: "",
  email: "",
  phone: "",
  subject: topics[0],
  messageContent: "",
};

// Auto-save to localStorage
const STORAGE_KEY = "contact_form_draft";

export default function ContactFormSection() {
  const [formData, setFormData] = useState<ContactPayload>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialForm;
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof ContactPayload, string>>
  >({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    type: "success" as "success" | "error",
    message: "",
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { mutateAsync, isPending } = useSendContact();

  // Auto-save
  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    }, 1000);
    return () => clearTimeout(timeout);
  }, [formData]);

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Vui lòng nhập họ tên";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (
      !/(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(formData.phone)
    ) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }
    if (!formData.messageContent.trim()) {
      newErrors.messageContent = "Vui lòng nhập nội dung";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      // Clear error for this field
      if (errors[name as keyof ContactPayload]) {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    },
    [errors],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const res = await mutateAsync(formData);
      setSnackbar({
        open: true,
        type: "success",
        message: res?.message || "Đã gửi liên hệ thành công!",
      });
      setFormData(initialForm);
      localStorage.removeItem(STORAGE_KEY);
    } catch (error: any) {
      setSnackbar({
        open: true,
        type: "error",
        message: error?.message || "Đã xảy ra lỗi khi gửi liên hệ.",
      });
    }
  };

  return (
    <Box py={8} px={isMobile ? 2 : 4} bgcolor="#f5f5f5" id="contact-form">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <Paper
          elevation={5}
          sx={{
            maxWidth: 900,
            mx: "auto",
            p: { xs: 3, sm: 5 },
            borderRadius: 4,
            bgcolor: "white",
          }}
        >
          {/* Header */}
          <Box textAlign="center" mb={4}>
            <Typography variant="h4" fontWeight={800} color="#333" gutterBottom>
              Liên hệ với chúng tôi
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Điền form dưới đây, chúng tôi sẽ phản hồi trong 24h
            </Typography>
            <Stack direction="row" justifyContent="center" spacing={1} mt={2}>
              <Chip
                icon={<CheckCircle />}
                label="Tư vấn miễn phí"
                size="small"
                sx={{ bgcolor: "#4caf50", color: "#fff" }}
              />
              <Chip
                icon={<CheckCircle />}
                label="Bảo mật thông tin"
                size="small"
                sx={{ bgcolor: "#4caf50", color: "#fff" }}
              />
            </Stack>
          </Box>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  name="fullName"
                  label="Họ và tên *"
                  value={formData.fullName}
                  onChange={handleChange}
                  error={!!errors.fullName}
                  helperText={errors.fullName}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  name="email"
                  label="Email *"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlined />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  name="phone"
                  label="Số điện thoại *"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  error={!!errors.phone}
                  helperText={errors.phone}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone />
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
                  label="Chủ đề *"
                  value={formData.subject}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Subject />
                      </InputAdornment>
                    ),
                  }}
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
                  fullWidth
                  name="messageContent"
                  label="Nội dung *"
                  value={formData.messageContent}
                  onChange={handleChange}
                  error={!!errors.messageContent}
                  helperText={errors.messageContent}
                  multiline
                  rows={4}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MessageOutlined />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Stack direction="row" spacing={2} justifyContent="center">
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={isPending}
                    sx={{
                      bgcolor: "#f25c05",
                      color: "#fff",
                      fontWeight: 700,
                      px: 5,
                      py: 1.5,
                      "&:hover": {
                        bgcolor: "#e64a19",
                      },
                    }}
                  >
                    {isPending ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Gửi liên hệ"
                    )}
                  </Button>

                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<AttachFile />}
                    component="label"
                    sx={{
                      borderColor: "#ffb700",
                      color: "#f25c05",
                    }}
                  >
                    Đính kèm file
                    <input type="file" hidden multiple />
                  </Button>
                </Stack>

                <FormHelperText sx={{ textAlign: "center", mt: 2 }}>
                  * Thông tin của bạn sẽ được bảo mật
                </FormHelperText>
              </Grid>
            </Grid>
          </form>

          {/* Draft indicator */}
          {formData !== initialForm && (
            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Typography variant="caption" color="text.secondary">
                ⚡ Đã lưu nháp tự động
              </Typography>
            </Box>
          )}
        </Paper>
      </motion.div>

      <GlobalSnackbar
        type={snackbar.type}
        message={snackbar.message}
        open={snackbar.open}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
      />
    </Box>
  );
}
