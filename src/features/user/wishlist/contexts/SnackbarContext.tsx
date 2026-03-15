// wishlist/contexts/SnackbarContext.tsx
"use client";

import React, { createContext, useState, useCallback } from "react";
import { Snackbar, Alert } from "@mui/material";

export interface SnackbarContextType {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showInfo: (message: string) => void;
  showWarning: (message: string) => void;
}

export const SnackbarContext = createContext<SnackbarContextType | undefined>(
  undefined,
);

export const SnackbarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("info");

  const showMessage = useCallback((msg: string, sev: typeof severity) => {
    setMessage(msg);
    setSeverity(sev);
    setOpen(true);
  }, []);

  const showSuccess = useCallback(
    (msg: string) => showMessage(msg, "success"),
    [showMessage],
  );
  const showError = useCallback(
    (msg: string) => showMessage(msg, "error"),
    [showMessage],
  );
  const showInfo = useCallback(
    (msg: string) => showMessage(msg, "info"),
    [showMessage],
  );
  const showWarning = useCallback(
    (msg: string) => showMessage(msg, "warning"),
    [showMessage],
  );

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <SnackbarContext.Provider
      value={{ showSuccess, showError, showInfo, showWarning }}
    >
      {children}
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};
