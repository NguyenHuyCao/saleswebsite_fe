"use client";

import React, { useState } from "react";
import {
  TextField,
  Button,
  Stack,
  InputAdornment,
  IconButton,
  MenuItem,
  Grid,
  Select,
  FormControl,
  InputLabel,
  Fade,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface RegisterTabProps {
  showMessage: (severity: "success" | "error", message: string) => void;
}

const provincesData: Record<string, string[]> = {
  "Hà Nội": ["Ba Đình", "Hoàn Kiếm", "Đống Đa"],
  "Hồ Chí Minh": ["Quận 1", "Quận 3", "Quận 5"],
  "Đà Nẵng": ["Hải Châu", "Thanh Khê", "Liên Chiểu"],
};

const RegisterTab: React.FC<RegisterTabProps> = ({ showMessage }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    province: "",
    district: "",
    gender: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "province" && { district: "" }),
    }));
  };

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      province: "",
      district: "",
      gender: "",
    });
  };

  const canRegister = Object.values(form).every((val) => val.trim() !== "");

  const handleRegister = async () => {
    if (form.password !== form.confirmPassword) {
      showMessage("error", "Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/v1/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone,
          address: `${form.district}, ${form.province}`,
          gender: form.gender,
        }),
      });

      const data = await res.json();
      if (res.status === 201) {
        showMessage("success", "Đăng ký thành công!");
        resetForm();
        router.push("/login?page=login");
      } else {
        throw new Error(data.message || "Đăng ký thất bại");
      }
    } catch (err: any) {
      showMessage("error", err.message || "Lỗi không xác định");
    }
  };

  return (
    <Fade in timeout={500}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (canRegister) handleRegister();
        }}
      >
        <Stack
          spacing={2}
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <TextField
            label="Họ tên"
            fullWidth
            size="small"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />

          <TextField
            label="Số điện thoại"
            fullWidth
            size="small"
            value={form.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
          />

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth size="small">
                <InputLabel id="province-label">Tỉnh/Thành phố</InputLabel>
                <Select
                  labelId="province-label"
                  value={form.province}
                  label="Tỉnh/Thành phố"
                  onChange={(e) => handleChange("province", e.target.value)}
                  MenuProps={{ disableScrollLock: true }}
                >
                  {Object.keys(provincesData).map((prov) => (
                    <MenuItem key={prov} value={prov}>
                      {prov}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth size="small">
                <InputLabel id="district-label">Xã/Quận</InputLabel>
                <Select
                  labelId="district-label"
                  value={form.district}
                  label="Xã/Quận"
                  onChange={(e) => handleChange("district", e.target.value)}
                  disabled={!form.province}
                  MenuProps={{ disableScrollLock: true }}
                >
                  {(provincesData[form.province] || []).map((dist) => (
                    <MenuItem key={dist} value={dist}>
                      {dist}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <FormControl fullWidth size="small">
            <InputLabel id="gender-label">Giới tính</InputLabel>
            <Select
              labelId="gender-label"
              value={form.gender}
              label="Giới tính"
              onChange={(e) => handleChange("gender", e.target.value)}
              MenuProps={{ disableScrollLock: true }}
            >
              <MenuItem value="Nam">Nam</MenuItem>
              <MenuItem value="Nữ">Nữ</MenuItem>
              <MenuItem value="Khác">Khác</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Email"
            fullWidth
            size="small"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />

          <TextField
            label="Mật khẩu"
            type={showPassword ? "text" : "password"}
            fullWidth
            size="small"
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Xác nhận mật khẩu"
            type={showConfirm ? "text" : "password"}
            fullWidth
            size="small"
            value={form.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirm((prev) => !prev)}
                    edge="end"
                  >
                    {showConfirm ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              bgcolor: "#ffb700",
              color: "#fff",
              fontWeight: 600,
              textTransform: "none",
              "&:hover": { bgcolor: "#f5a000" },
            }}
            disabled={!canRegister}
          >
            Đăng ký
          </Button>
        </Stack>
      </form>
    </Fade>
  );
};

export default RegisterTab;
