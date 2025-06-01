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
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useRouter } from "next/navigation";

interface RegisterTabProps {
  showMessage: (severity: "success" | "error", message: string) => void;
}

const provincesData: Record<string, string[]> = {
  "Hà Nội": ["Ba Đình", "Hoàn Kiếm", "Đống Đa"],
  "Hồ Chí Minh": ["Quận 1", "Quận 3", "Quận 5"],
  "Đà Nẵng": ["Hải Châu", "Thanh Khê", "Liên Chiểu"],
};

const RegisterTab: React.FC<RegisterTabProps> = ({ showMessage }) => {
  const [name, setName] = useState("");
  const [emailRegister, setEmailRegister] = useState("");
  const [passwordRegister, setPasswordRegister] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [gender, setGender] = useState("");
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const canRegister =
    name.trim() &&
    emailRegister.trim() &&
    passwordRegister.trim() &&
    confirmPassword.trim() &&
    phone.trim() &&
    province.trim() &&
    district.trim() &&
    gender.trim();

  const resetForm = () => {
    setName("");
    setEmailRegister("");
    setPasswordRegister("");
    setConfirmPassword("");
    setPhone("");
    setProvince("");
    setDistrict("");
    setGender("");
  };

  const router = useRouter();

  const handleRegister = async () => {
    if (passwordRegister !== confirmPassword) {
      showMessage("error", "Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/v1/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: name.trim(),
          email: emailRegister.trim(),
          password: passwordRegister.trim(),
          phone: phone.trim(),
          address: `${district}, ${province}`,
          gender,
        }),
      });

      const data = await res.json();
      if (res.status === 201) {
        showMessage("success", "Đăng ký thành công!");
        resetForm();
        router.push("/login?page=login"); // Điều hướng về đăng nhập
      } else {
        throw new Error(data.message || "Đăng ký thất bại");
      }
    } catch (err: any) {
      showMessage("error", err.message);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (canRegister) handleRegister();
      }}
    >
      <Stack spacing={2}>
        <TextField
          label="Họ tên"
          fullWidth
          size="small"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Số điện thoại"
          fullWidth
          size="small"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <Grid container spacing={2}>
          <Grid size={{ xs: 6 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="province-label">Tỉnh/Thành phố</InputLabel>
              <Select
                labelId="province-label"
                label="Tỉnh/Thành phố"
                value={province}
                onChange={(e) => {
                  setProvince(e.target.value);
                  setDistrict("");
                }}
              >
                {Object.keys(provincesData).map((provinceName) => (
                  <MenuItem key={provinceName} value={provinceName}>
                    {provinceName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 6 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="district-label">Xã/Quận</InputLabel>
              <Select
                labelId="district-label"
                label="Xã/Quận"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                disabled={!province}
              >
                {province &&
                  provincesData[province]?.map((districtName) => (
                    <MenuItem key={districtName} value={districtName}>
                      {districtName}
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
            label="Giới tính"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
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
          value={emailRegister}
          onChange={(e) => setEmailRegister(e.target.value)}
        />
        <TextField
          label="Mật khẩu"
          type={showRegisterPassword ? "text" : "password"}
          fullWidth
          size="small"
          value={passwordRegister}
          onChange={(e) => setPasswordRegister(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                  edge="end"
                >
                  {showRegisterPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="Xác nhận mật khẩu"
          type={showConfirmPassword ? "text" : "password"}
          fullWidth
          size="small"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  edge="end"
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          fullWidth
          type="submit"
          variant="contained"
          sx={{ bgcolor: "#ffb700", color: "#fff", fontWeight: 600 }}
          disabled={!canRegister}
        >
          Đăng ký
        </Button>
      </Stack>
    </form>
  );
};

export default RegisterTab;
