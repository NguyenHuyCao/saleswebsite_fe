"use client";

import { Snackbar, Alert } from "@mui/material";
import { useEffect, useState } from "react";

interface GlobalSnackbarProps {
  type: "success" | "error";
  message: string;
  open: boolean;
  onClose: () => void;
}

const GlobalSnackbar = ({
  type,
  message,
  open,
  onClose,
}: GlobalSnackbarProps) => {
  const [autoHideDuration, setAutoHideDuration] = useState(4000);

  useEffect(() => {
    if (type === "error") {
      setAutoHideDuration(6000); // lỗi lâu hơn
    } else {
      setAutoHideDuration(4000);
    }
  }, [type]);

  return (
    <Snackbar
      open={open}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      autoHideDuration={autoHideDuration}
    >
      <Alert onClose={onClose} severity={type} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default GlobalSnackbar;
