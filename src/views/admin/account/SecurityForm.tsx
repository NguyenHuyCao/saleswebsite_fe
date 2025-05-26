"use client";

import { useState, ChangeEvent, MouseEvent } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";

import KeyOutline from "mdi-material-ui/KeyOutline";
import EyeOutline from "mdi-material-ui/EyeOutline";
import EyeOffOutline from "mdi-material-ui/EyeOffOutline";

const SecurityForm = ({ onBack }: { onBack: () => void }) => {
  const [values, setValues] = useState({
    newPassword: "",
    currentPassword: "",
    confirmNewPassword: "",
    showNewPassword: false,
    showCurrentPassword: false,
    showConfirmNewPassword: false,
  });

  const handleChange =
    (prop: keyof typeof values) => (event: ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });
    };

  const toggleVisibility = (prop: keyof typeof values) => () => {
    setValues({ ...values, [prop]: !values[prop] });
  };

  const handleMouseDown = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleSave = () => {
    console.log("Đã lưu mật khẩu mới", values);
  };

  return (
    <Box display="flex" flexDirection="column" gap={6}>
      <Typography variant="h6" fontWeight={600}>
        Bảo mật tài khoản
      </Typography>

      <Grid container spacing={4}>
        {[
          { key: "currentPassword", label: "Mật khẩu hiện tại" },
          { key: "newPassword", label: "Mật khẩu mới" },
          { key: "confirmNewPassword", label: "Xác nhận mật khẩu mới" },
        ].map(({ key, label }) => (
          <Grid item xs={12} md={6} key={key}>
            <InputLabel htmlFor={key}>{label}</InputLabel>
            <OutlinedInput
              fullWidth
              id={key}
              type={
                values[
                  `show${
                    key.charAt(0).toUpperCase() + key.slice(1)
                  }` as keyof typeof values
                ]
                  ? "text"
                  : "password"
              }
              value={values[key as keyof typeof values]}
              onChange={handleChange(key as keyof typeof values)}
              startAdornment={
                <InputAdornment position="start">
                  <KeyOutline />
                </InputAdornment>
              }
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={toggleVisibility(
                      `show${
                        key.charAt(0).toUpperCase() + key.slice(1)
                      }` as keyof typeof values
                    )}
                    onMouseDown={handleMouseDown}
                    edge="end"
                  >
                    {values[
                      `show${
                        key.charAt(0).toUpperCase() + key.slice(1)
                      }` as keyof typeof values
                    ] ? (
                      <EyeOutline />
                    ) : (
                      <EyeOffOutline />
                    )}
                  </IconButton>
                </InputAdornment>
              }
            />
          </Grid>
        ))}
      </Grid>

      <Box display="flex" gap={2} justifyContent="flex-start">
        <Button variant="outlined" onClick={onBack}>
          Quay lại
        </Button>
        <Button variant="contained" onClick={handleSave}>
          Lưu thay đổi
        </Button>
      </Box>
    </Box>
  );
};

export default SecurityForm;
