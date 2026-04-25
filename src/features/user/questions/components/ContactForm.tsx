"use client";

import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import {
  Paper,
  Typography,
  TextField,
  InputAdornment,
  Button,
  CircularProgress,
  Stack,
  Chip,
  FormHelperText,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import MessageIcon from "@mui/icons-material/Message";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SendIcon from "@mui/icons-material/Send";
import LabelIcon from "@mui/icons-material/Label";
import GlobalSnackbar from "@/components/feedback/GlobalSnackbar";
import { createContact } from "../api";

const STORAGE_KEY = "question_form_draft";
const PHONE_RE = /^0[35789][0-9]{8}$/;
const MAX_MESSAGE = 5000;

const SUBJECTS = [
  "Giải đáp thắc mắc",
  "Hỏi về sản phẩm",
  "Hỏi về đơn hàng",
  "Hỏi về bảo hành",
  "Hỏi về giao hàng",
  "Hỏi về thanh toán",
  "Phản hồi / Góp ý",
  "Khác",
];

const emptyForm = {
  fullName: "",
  email: "",
  phone: "",
  subject: "Giải đáp thắc mắc",
  messageContent: "",
};

type FormState = typeof emptyForm;

export default function ContactForm() {
  const [mounted, setMounted] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    type: "success" as "success" | "error",
    message: "",
  });

  // Hydrate from localStorage — client only
  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: FormState = JSON.parse(saved);
        setForm(parsed);
        setHasDraft(Object.entries(parsed).some(([k, v]) => k !== "subject" && typeof v === "string" && v.trim()));
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Auto-save draft
  useEffect(() => {
    if (!mounted) return;
    const hasContent = Object.entries(form).some(([k, v]) => k !== "subject" && typeof v === "string" && v.trim());
    const t = setTimeout(() => {
      if (hasContent) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
        setHasDraft(true);
      }
    }, 800);
    return () => clearTimeout(t);
  }, [form, mounted]);

  const setField = (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.fullName.trim()) errs.fullName = "Vui lòng nhập họ tên";
    else if (form.fullName.trim().length > 255) errs.fullName = "Tên quá dài";

    if (!form.email.trim()) errs.email = "Vui lòng nhập email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Email không hợp lệ";

    if (!form.phone.trim()) errs.phone = "Vui lòng nhập số điện thoại";
    else if (!PHONE_RE.test(form.phone.replace(/\s/g, ""))) errs.phone = "Số điện thoại không hợp lệ (VD: 0392923392)";

    if (!form.messageContent.trim()) errs.messageContent = "Vui lòng nhập nội dung thắc mắc";
    else if (form.messageContent.trim().length < 10) errs.messageContent = "Nội dung quá ngắn (ít nhất 10 ký tự)";
    else if (form.messageContent.length > MAX_MESSAGE) errs.messageContent = `Nội dung quá dài (tối đa ${MAX_MESSAGE} ký tự)`;

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const onSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const ok = await createContact(form);
      if (ok) {
        setSnackbar({ open: true, type: "success", message: "Gửi thắc mắc thành công! Chúng tôi sẽ phản hồi trong 24h." });
        setForm(emptyForm);
        setHasDraft(false);
        localStorage.removeItem(STORAGE_KEY);
      } else {
        throw new Error("failed");
      }
    } catch {
      setSnackbar({ open: true, type: "error", message: "Lỗi kết nối. Vui lòng thử lại sau." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4, md: 5 },
          borderRadius: 4,
          border: "1px solid #f0f0f0",
          background: "linear-gradient(135deg, #fff 0%, #fffaf7 100%)",
        }}
      >
        {/* Header */}
        <Stack direction="row" alignItems="flex-start" spacing={2} sx={{ mb: 4 }}>
          <Box
            sx={{
              width: 48, height: 48, borderRadius: 2, bgcolor: "#f25c05",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}
          >
            <MessageIcon sx={{ color: "#fff", fontSize: 26 }} />
          </Box>
          <Box>
            <Typography variant="h5" fontWeight={800} gutterBottom sx={{ lineHeight: 1.2 }}>
              Gửi câu hỏi cho chúng tôi
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Điền thông tin bên dưới — đội ngũ Cường Hoa sẽ phản hồi trong vòng{" "}
              <Box component="span" fontWeight={700} color="#f25c05">24 giờ làm việc</Box>
            </Typography>
          </Box>
        </Stack>

        <Stack spacing={2.5}>
          {/* Row 1: Name + Email */}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth size="small"
                label="Họ và tên *"
                value={form.fullName}
                onChange={setField("fullName")}
                error={!!errors.fullName}
                helperText={errors.fullName}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: "#f25c05", fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth size="small"
                label="Email *"
                type="email"
                value={form.email}
                onChange={setField("email")}
                error={!!errors.email}
                helperText={errors.email}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: "#f25c05", fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>
          </Grid>

          {/* Row 2: Phone + Subject */}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth size="small"
                label="Điện thoại *"
                placeholder="0392923392"
                value={form.phone}
                onChange={setField("phone")}
                error={!!errors.phone}
                helperText={errors.phone}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon sx={{ color: "#f25c05", fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Chủ đề</InputLabel>
                <Select
                  value={form.subject}
                  label="Chủ đề"
                  startAdornment={
                    <InputAdornment position="start">
                      <LabelIcon sx={{ color: "#f25c05", fontSize: 20 }} />
                    </InputAdornment>
                  }
                  onChange={(e) => setForm((prev) => ({ ...prev, subject: e.target.value }))}
                >
                  {SUBJECTS.map((s) => (
                    <MenuItem key={s} value={s}>{s}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Box>
            <TextField
              label="Nội dung thắc mắc *"
              fullWidth multiline rows={4} size="small"
              value={form.messageContent}
              onChange={setField("messageContent")}
              error={!!errors.messageContent}
              helperText={errors.messageContent}
              inputProps={{ maxLength: MAX_MESSAGE }}
            />
            <Typography
              variant="caption"
              sx={{
                display: "block", textAlign: "right", mt: 0.5,
                color: form.messageContent.length > MAX_MESSAGE * 0.9 ? "#f25c05" : "text.secondary",
              }}
            >
              {form.messageContent.length}/{MAX_MESSAGE}
            </Typography>
          </Box>

          <Button
            variant="contained" fullWidth size="large"
            onClick={onSubmit} disabled={loading}
            startIcon={loading ? undefined : <SendIcon />}
            sx={{
              bgcolor: "#f25c05", color: "#fff", fontWeight: 700, py: 1.5,
              borderRadius: 2, "&:hover": { bgcolor: "#e64a19" },
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Gửi câu hỏi"}
          </Button>

          <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap" sx={{ gap: 1 }}>
            <Chip icon={<CheckCircleIcon />} label="Phản hồi trong 24h" size="small" sx={{ bgcolor: "#f5f5f5" }} />
            <Chip icon={<CheckCircleIcon />} label="Bảo mật thông tin" size="small" sx={{ bgcolor: "#f5f5f5" }} />
          </Stack>

          {hasDraft && (
            <FormHelperText sx={{ textAlign: "center", color: "#4caf50" }}>
              ⚡ Đã lưu nháp tự động
            </FormHelperText>
          )}
        </Stack>
      </Paper>

      <GlobalSnackbar
        type={snackbar.type}
        message={snackbar.message}
        open={snackbar.open}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
      />
    </>
  );
}
