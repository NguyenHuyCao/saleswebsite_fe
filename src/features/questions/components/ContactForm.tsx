"use client";

import React, { useRef, useState } from "react";
import {
  Paper,
  Typography,
  TextField,
  InputAdornment,
  Button,
  CircularProgress,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import MessageIcon from "@mui/icons-material/Message";
import GlobalSnackbar from "@/components/alert/GlobalSnackbar";
import { createContact } from "../api";

export default function ContactForm() {
  const formRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    messageContent: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    type: "success" as "success" | "error",
    message: "",
  });

  const onSubmit = async () => {
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
      } else {
        throw new Error("failed");
      }
    } catch {
      setSnackbar({
        open: true,
        type: "error",
        message: "Lỗi kết nối. Vui lòng thử lại.",
      });
      formRef.current?.scrollIntoView({ behavior: "smooth" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Paper ref={formRef} elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={700} mb={3}>
          Gửi thắc mắc cho chúng tôi
        </Typography>

        {[
          { label: "Họ và tên", name: "fullName", icon: <PersonIcon /> },
          { label: "Email", name: "email", icon: <EmailIcon /> },
          { label: "Điện thoại", name: "phone", icon: <PhoneIcon /> },
        ].map((f) => (
          <TextField
            key={f.name}
            fullWidth
            size="small"
            label={f.label}
            value={(form as any)[f.name]}
            onChange={(e) =>
              setForm((p) => ({ ...p, [f.name]: e.target.value }))
            }
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">{f.icon}</InputAdornment>
              ),
            }}
          />
        ))}

        <TextField
          label="Nội dung thắc mắc"
          fullWidth
          multiline
          minRows={4}
          size="small"
          sx={{ mb: 2 }}
          value={form.messageContent}
          onChange={(e) =>
            setForm((p) => ({ ...p, messageContent: e.target.value }))
          }
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <MessageIcon />
              </InputAdornment>
            ),
          }}
        />

        <Button
          variant="contained"
          color="warning"
          fullWidth
          size="large"
          onClick={onSubmit}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={22} color="inherit" />
          ) : (
            "Gửi thông tin"
          )}
        </Button>
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
