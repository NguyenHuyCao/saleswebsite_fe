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
  Stack,
  Chip,
  FormHelperText,
  Container,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  EmailOutlined,
  Phone,
  Person,
  Subject,
  MessageOutlined,
  CheckCircle,
} from "@mui/icons-material";
import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import GlobalSnackbar from "@/components/feedback/GlobalSnackbar";
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

const STORAGE_KEY = "contact_form_draft";
const MAX_MESSAGE_LENGTH = 5000;

const hasContent = (form: ContactPayload) =>
  !!form.fullName.trim() ||
  !!form.email.trim() ||
  !!form.phone.trim() ||
  !!form.messageContent.trim();

export default function ContactFormSection() {
  const [formData, setFormData] = useState<ContactPayload>(initialForm);
  const [errors, setErrors] = useState<
    Partial<Record<keyof ContactPayload, string>>
  >({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    type: "success" as "success" | "error",
    message: "",
  });

  const { mutateAsync, isPending } = useSendContact();

  // Load draft from localStorage on mount (client-only, avoids SSR crash)
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setFormData(JSON.parse(saved) as ContactPayload);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Auto-save draft
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (hasContent(formData)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    }, 800);
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

    const cleanPhone = formData.phone.replace(/\s/g, "");
    if (!cleanPhone) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^0[35789][0-9]{8}$/.test(cleanPhone)) {
      newErrors.phone = "Số điện thoại không hợp lệ (VD: 0392 923 392)";
    }

    if (!formData.messageContent.trim()) {
      newErrors.messageContent = "Vui lòng nhập nội dung";
    } else if (formData.messageContent.length > MAX_MESSAGE_LENGTH) {
      newErrors.messageContent = `Nội dung quá dài (tối đa ${MAX_MESSAGE_LENGTH.toLocaleString()} ký tự)`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (errors[name as keyof ContactPayload]) {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    },
    [errors],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const cleanedPayload: ContactPayload = {
      ...formData,
      fullName: formData.fullName.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.replace(/\s/g, ""),
      subject: formData.subject.trim(),
      messageContent: formData.messageContent.trim(),
    };

    try {
      const res = await mutateAsync(cleanedPayload);
      setSnackbar({
        open: true,
        type: "success",
        message: res?.message || "Đã gửi liên hệ thành công! Chúng tôi sẽ phản hồi trong 24h.",
      });
      setFormData(initialForm);
      localStorage.removeItem(STORAGE_KEY);
    } catch (error: any) {
      setSnackbar({
        open: true,
        type: "error",
        message: error?.message || "Đã xảy ra lỗi khi gửi liên hệ. Vui lòng thử lại.",
      });
    }
  };

  const msgLength = formData.messageContent.length;
  const isDraft = hasContent(formData);

  return (
    <Box
      component="section"
      id="contact-form"
      sx={{
        bgcolor: "#f5f5f5",
        py: { xs: 6, md: 8 },
        scrollMarginTop: "80px",
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Paper
            elevation={5}
            sx={{
              maxWidth: 860,
              mx: "auto",
              p: { xs: 3, sm: 5 },
              borderRadius: 4,
              bgcolor: "white",
            }}
          >
            {/* Header */}
            <Box textAlign="center" mb={4}>
              <Typography
                variant="h4"
                fontWeight={800}
                color="#333"
                gutterBottom
              >
                Gửi yêu cầu tư vấn
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Điền thông tin bên dưới, chúng tôi sẽ phản hồi trong 24h
              </Typography>
              <Stack
                direction="row"
                justifyContent="center"
                spacing={1}
                mt={2}
                flexWrap="wrap"
              >
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

            <form onSubmit={handleSubmit} noValidate>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    required
                    name="fullName"
                    label="Họ và tên"
                    value={formData.fullName}
                    onChange={handleChange}
                    error={!!errors.fullName}
                    helperText={errors.fullName}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    required
                    name="email"
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailOutlined />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    required
                    name="phone"
                    label="Số điện thoại"
                    type="tel"
                    inputMode="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    error={!!errors.phone}
                    helperText={errors.phone || "VD: 0392 923 392"}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Phone />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    select
                    name="subject"
                    label="Chủ đề"
                    value={formData.subject}
                    onChange={handleChange}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Subject />
                          </InputAdornment>
                        ),
                      },
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
                    required
                    name="messageContent"
                    label="Nội dung"
                    placeholder="Mô tả chi tiết yêu cầu của bạn..."
                    value={formData.messageContent}
                    onChange={handleChange}
                    error={!!errors.messageContent}
                    helperText={errors.messageContent}
                    multiline
                    rows={5}
                    inputProps={{ maxLength: MAX_MESSAGE_LENGTH }}
                  />
                  <Box
                    sx={{ display: "flex", justifyContent: "flex-end", mt: 0.5 }}
                  >
                    <Typography
                      variant="caption"
                      color={
                        msgLength > MAX_MESSAGE_LENGTH * 0.9
                          ? "error"
                          : "text.secondary"
                      }
                    >
                      {msgLength.toLocaleString()}/{MAX_MESSAGE_LENGTH.toLocaleString()} ký tự
                    </Typography>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12 }} sx={{ textAlign: "center" }}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={isPending}
                    sx={{
                      bgcolor: "#f25c05",
                      color: "#fff",
                      fontWeight: 700,
                      px: 6,
                      py: 1.5,
                      fontSize: "1rem",
                      borderRadius: 2,
                      "&:hover": {
                        bgcolor: "#e64a19",
                        transform: "scale(1.03)",
                      },
                      transition: "all 0.2s ease",
                    }}
                  >
                    {isPending ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Gửi liên hệ"
                    )}
                  </Button>

                  <FormHelperText sx={{ textAlign: "center", mt: 1.5 }}>
                    * Thông tin của bạn được bảo mật tuyệt đối
                  </FormHelperText>
                </Grid>
              </Grid>
            </form>

            {isDraft && (
              <Box sx={{ mt: 2, textAlign: "center" }}>
                <Typography variant="caption" color="text.secondary">
                  ⚡ Đã lưu nháp tự động
                </Typography>
              </Box>
            )}
          </Paper>
        </motion.div>
      </Container>

      <GlobalSnackbar
        type={snackbar.type}
        message={snackbar.message}
        open={snackbar.open}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
      />
    </Box>
  );
}
