"use client";

import {
  Box,
  Typography,
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
import Grid from "@mui/material/Grid";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useMeQuery, useUpdateMe } from "../hooks/useMe";

const GENDERS = ["Nam", "Nữ", "Khác"] as const;

export default function UserAccountPage() {
  const { data: me, isLoading, error } = useMeQuery();
  const { mutateAsync, isPending } = useUpdateMe();

  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
    gender: "Nam",
  });

  const [snack, setSnack] = useState({
    open: false,
    message: "",
    type: "success" as "success" | "error",
  });
  const ref = useRef<HTMLDivElement>(null);
  const scrollTop = () => ref.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    if (me) {
      setForm({
        username: me.username || "",
        email: me.email || "",
        phone: me.phone || "",
        address: me.address || "",
        gender: (me.gender as any) || "Nam",
      });
    }
  }, [me]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await mutateAsync({
        username: form.username,
        phone: form.phone,
        address: form.address,
        gender: form.gender as any,
      });
      setSnack({
        open: true,
        message: "Cập nhật thông tin thành công!",
        type: "success",
      });
    } catch (err: any) {
      setSnack({
        open: true,
        message: err?.message || "Cập nhật thất bại!",
        type: "error",
      });
    } finally {
      scrollTop();
    }
  };

  if (isLoading) return <Box p={4}>Đang tải…</Box>;
  if (error) return <Box p={4}>Lỗi: {(error as any).message}</Box>;

  return (
    <Box ref={ref} px={{ xs: 2, sm: 4 }} py={4}>
      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snack.type}
          onClose={() => setSnack((s) => ({ ...s, open: false }))}
          sx={{ width: "100%" }}
        >
          {snack.message}
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

          <form onSubmit={submit}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Họ và tên"
                  name="username"
                  value={form.username}
                  onChange={(e) =>
                    setForm({ ...form, username: e.target.value })
                  }
                  required
                  disabled={isPending}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={form.email}
                  disabled
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Số điện thoại"
                  name="phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  required
                  disabled={isPending}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Địa chỉ"
                  name="address"
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                  rows={2}
                  multiline
                  required
                  disabled={isPending}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <FormControl component="fieldset" disabled={isPending}>
                  <FormLabel component="legend">Giới tính</FormLabel>
                  <RadioGroup
                    row
                    name="gender"
                    value={form.gender}
                    onChange={(e) =>
                      setForm({ ...form, gender: e.target.value })
                    }
                  >
                    {GENDERS.map((g) => (
                      <FormControlLabel
                        key={g}
                        value={g}
                        control={<Radio />}
                        label={g}
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
                  disabled={isPending}
                  sx={{
                    bgcolor: "#ffb700",
                    color: "#000",
                    fontWeight: 600,
                    textTransform: "none",
                    "&:hover": { bgcolor: "#e09e00" },
                  }}
                >
                  {isPending ? "Đang lưu..." : "Cập nhật"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Fade>
    </Box>
  );
}
