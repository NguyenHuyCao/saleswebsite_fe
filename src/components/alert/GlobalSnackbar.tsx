"use client";

import { useEffect } from "react";
import { useToast, ToastSeverity } from "@/lib/toast/ToastContext";

export type SnackType = "success" | "error" | "info" | "warning";

export default function GlobalSnackbar({
  type,
  message,
  open,
  onClose,
}: {
  type: SnackType;
  message: string;
  open: boolean;
  onClose: () => void;
}) {
  const { showToast } = useToast();

  useEffect(() => {
    if (open && message) {
      showToast(message, type as ToastSeverity);
      onClose();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return null;
}
