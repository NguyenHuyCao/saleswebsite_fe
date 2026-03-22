"use client";

import { useEffect } from "react";
import { useToast, ToastSeverity } from "@/lib/toast/ToastContext";
import type { AlertColor } from "@mui/material";

interface AlertSnackbarProps {
  open: boolean;
  message: string;
  type?: AlertColor;
  onClose: (event?: React.SyntheticEvent | Event, reason?: string) => void;
}

const AlertSnackbar = ({
  open,
  message,
  type = "success",
  onClose,
}: AlertSnackbarProps) => {
  const { showToast } = useToast();

  useEffect(() => {
    if (open && message) {
      showToast(message, type as ToastSeverity);
      onClose();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return null;
};

export default AlertSnackbar;
