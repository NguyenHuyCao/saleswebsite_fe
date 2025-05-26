"use client";

import { Snackbar, Alert as MuiAlert } from "@mui/material";
import { SyntheticEvent } from "react";

const Alert = MuiAlert as React.ElementType;

interface AlertSnackbarProps {
  open: boolean;
  message: string;
  type?: "success" | "error";
  onClose: (event?: SyntheticEvent | Event, reason?: string) => void;
  severity?: "success" | "error";
}

const AlertSnackbar = ({
  open,
  message,
  type,
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
