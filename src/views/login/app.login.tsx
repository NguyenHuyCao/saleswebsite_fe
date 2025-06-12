"use client";

import {
  Box,
  Tab,
  Tabs,
  Typography,
  Paper,
  Snackbar,
  Alert,
  Fade,
} from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import LoginTab from "./LoginTab";
import RegisterTab from "./RegisterTab";

interface SnackbarState {
  open: boolean;
  severity: "success" | "error";
  message: string;
}

const LoginForm = () => {
  const [tab, setTab] = useState(0);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    severity: "success",
    message: "",
  });

  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
    const page = newValue === 1 ? "register" : "login";
    router.replace(`/login?page=${page}`);
  };

  const showMessage = useCallback(
    (severity: "success" | "error", message: string) => {
      setSnackbar({ open: true, severity, message });
    },
    []
  );

  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    if (token) {
      fetch("http://localhost:8080/api/v1/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    }
  }, []);

  useEffect(() => {
    const page = searchParams.get("page");
    if (page === "register") setTab(1);
    else if (page === "login") setTab(0);
  }, [searchParams]);

  return (
    <>
      <Fade in timeout={500}>
        <Paper
          elevation={3}
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          sx={{
            borderRadius: 2,
            overflow: "hidden",
            margin: "auto",
            maxWidth: 500,
            width: "100%",
            my: 4,
          }}
        >
          <Tabs
            value={tab}
            onChange={handleChange}
            centered
            variant="fullWidth"
            sx={{
              "& .MuiTab-root": { fontWeight: "bold" },
              "& .Mui-selected": { color: "#fbbf24" },
              "& .MuiTabs-indicator": { backgroundColor: "#ffb700" },
            }}
          >
            <Tab label="ĐĂNG NHẬP" />
            <Tab label="ĐĂNG KÝ" />
          </Tabs>

          <Box sx={{ p: 4, bgcolor: "#f9f9f9" }}>
            <Typography
              variant="h6"
              textAlign="center"
              fontWeight="bold"
              mb={3}
            >
              {tab === 0 ? "ĐĂNG NHẬP" : "ĐĂNG KÝ"}
            </Typography>

            {tab === 0 ? (
              <LoginTab showMessage={showMessage} />
            ) : (
              <RegisterTab showMessage={showMessage} />
            )}
          </Box>
        </Paper>
      </Fade>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default LoginForm;
