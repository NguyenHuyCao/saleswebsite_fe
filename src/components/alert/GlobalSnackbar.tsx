"use client";

import { Snackbar, Alert } from "@mui/material";
import { useEffect, useState } from "react";

export type SnackType = "success" | "error";

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
  const [duration, setDuration] = useState(4000);

  useEffect(() => setDuration(type === "error" ? 6000 : 4000), [type]);

  return (
    <Snackbar
      open={open}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      autoHideDuration={duration}
    >
      <Alert onClose={onClose} severity={type} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
