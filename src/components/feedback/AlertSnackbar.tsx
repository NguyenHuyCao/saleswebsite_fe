"use client";

import { Snackbar, Alert as MuiAlert, AlertColor } from "@mui/material";
import React, { SyntheticEvent, forwardRef } from "react";

// Định nghĩa Alert chuẩn để dùng trong Snackbar
const Alert = forwardRef<HTMLDivElement, any>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

interface AlertSnackbarProps {
  open: boolean;
  message: string;
  type?: AlertColor;
  onClose: (event?: SyntheticEvent | Event, reason?: string) => void;
}

const AlertSnackbar = ({
  open,
  message,
  type = "success",
  onClose,
}: AlertSnackbarProps) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert onClose={onClose} severity={type} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default AlertSnackbar;
