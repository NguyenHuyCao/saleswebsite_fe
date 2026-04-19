// questions/components/ContactForm.tsx
"use client";

import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import MessageIcon from "@mui/icons-material/Message";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import GlobalSnackbar from "@/components/feedback/GlobalSnackbar";
import { createContact } from "../api";

const STORAGE_KEY = "contact_form_draft";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved
      ? JSON.parse(saved)
      : {
          fullName: "",
          email: "",
          phone: "",
          messageContent: "",
        };
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    type: "success" as "success" | "error",
    message: "",
  });

  // Auto-save
  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    }, 1000);
    return () => clearTimeout(timeout);
  }, [form]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!form.fullName.trim()) {
      newErrors.fullName = "Vui lòng nhập họ tên";
    }

    if (!form.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!form.phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!/(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(form.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    if (!form.messageContent.trim()) {
      newErrors.messageContent = "Vui lòng nhập nội dung thắc mắc";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const ok = await createContact({ ...form, subject: "Giải đáp thắc mắc" });
      if (ok) {
        setSnackbar({
          open: true,
          type: "success",
          message: "Gửi thắc mắc thành công!",
        });
        setForm({ fullName: "", email: "", phone: "", messageContent: "" });
        localStorage.removeItem(STORAGE_KEY);
      } else {
        throw new Error("failed");
      }
    } catch {
      setSnackbar({
        open: true,
        type: "error",
        message: "Lỗi kết nối. Vui lòng thử lại.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
          <MessageIcon sx={{ color: "#f25c05" }} />
          <Typography variant="h6" fontWeight={700}>
            Gửi thắc mắc
          </Typography>
        </Stack>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Điền form bên dưới, chúng tôi sẽ phản hồi trong vòng 24h
        </Typography>

        <Stack spacing={2}>
          <TextField
            fullWidth
            size="small"
            label="Họ và tên *"
            value={form.fullName}
            onChange={(e) => {
              setForm((p: any) => ({ ...p, fullName: e.target.value }));
              if (errors.fullName) setErrors((p) => ({ ...p, fullName: "" }));
            }}
            error={!!errors.fullName}
            helperText={errors.fullName}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: "#f25c05" }} />
                  </InputAdornment>
                ),
                },
            }}
          />

          <TextField
            fullWidth
            size="small"
            label="Email *"
            type="email"
            value={form.email}
            onChange={(e) => {
              setForm((p: any) => ({ ...p, email: e.target.value }));
              if (errors.email) setErrors((p) => ({ ...p, email: "" }));
            }}
            error={!!errors.email}
            helperText={errors.email}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: "#f25c05" }} />
                  </InputAdornment>
                ),
                },
            }}
          />

          <TextField
            fullWidth
            size="small"
            label="Điện thoại *"
            value={form.phone}
            onChange={(e) => {
              setForm((p: any) => ({ ...p, phone: e.target.value }));
              if (errors.phone) setErrors((p) => ({ ...p, phone: "" }));
            }}
            error={!!errors.phone}
            helperText={errors.phone}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon sx={{ color: "#f25c05" }} />
                  </InputAdornment>
                ),
                },
            }}
          />

          <TextField
            label="Nội dung thắc mắc *"
            fullWidth
            multiline
            rows={4}
            size="small"
            value={form.messageContent}
            onChange={(e) => {
              setForm((p: any) => ({ ...p, messageContent: e.target.value }));
              if (errors.messageContent)
                setErrors((p) => ({ ...p, messageContent: "" }));
            }}
            error={!!errors.messageContent}
            helperText={errors.messageContent}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <MessageIcon sx={{ color: "#f25c05" }} />
                  </InputAdornment>
                ),
                },
            }}
          />

          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={onSubmit}
            disabled={loading}
            sx={{
              bgcolor: "#f25c05",
              color: "#fff",
              fontWeight: 700,
              py: 1.5,
              "&:hover": { bgcolor: "#e64a19" },
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Gửi thông tin"
            )}
          </Button>

          <Stack direction="row" spacing={1} justifyContent="center">
            <Chip
              icon={<CheckCircleIcon />}
              label="Phản hồi nhanh"
              size="small"
              sx={{ bgcolor: "#f5f5f5" }}
            />
            <Chip
              icon={<CheckCircleIcon />}
              label="Bảo mật thông tin"
              size="small"
              sx={{ bgcolor: "#f5f5f5" }}
            />
          </Stack>

          {form !== JSON.parse(localStorage.getItem(STORAGE_KEY) || "null") && (
            <FormHelperText sx={{ textAlign: "center" }}>
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
