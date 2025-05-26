"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import AlertSnackbar from "@/model/notify/AlertSnackbar";

interface Props {
  onNext: () => void;
  userData: {
    id: number;
    username: string;
    email: string;
    phone: string;
    address: string;
    gender: string;
  } | null;
}

const UserCombinedForm = ({ onNext, userData }: Props) => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
    gender: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  useEffect(() => {
    if (userData) {
      setForm({
        username: userData.username,
        email: userData.email,
        phone: userData.phone,
        address: userData.address,
        gender: userData.gender || "",
      });
    }
  }, [userData]);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/v1/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Cập nhật thất bại");

      setSnackbar({
        open: true,
        message: "Cập nhật thông tin thành công!",
        severity: "success",
      });
      onNext();
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message, severity: "error" });
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap={6}>
      <Typography variant="h6" mb={3}>
        Thông tin cá nhân
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Họ và tên"
            value={form.username}
            onChange={(e) => handleChange("username", e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            type="email"
            label="Email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Số điện thoại"
            value={form.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Địa chỉ"
            value={form.address}
            onChange={(e) => handleChange("address", e.target.value)}
          />
        </Grid>
      </Grid>

      <FormLabel>Giới tính</FormLabel>
      <RadioGroup
        row
        value={form.gender}
        onChange={(e) => handleChange("gender", e.target.value)}
      >
        <FormControlLabel value="Nam" control={<Radio />} label="Nam" />
        <FormControlLabel value="Nữ" control={<Radio />} label="Nữ" />
        <FormControlLabel value="Khác" control={<Radio />} label="Khác" />
      </RadioGroup>

      <Box>
        <Button variant="contained" onClick={handleSave}>
          Tiếp theo
        </Button>
      </Box>

      <AlertSnackbar
        open={snackbar.open}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </Box>
  );
};

export default UserCombinedForm;
