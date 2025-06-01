"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Tab,
  Tabs,
  Typography,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
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

  const handleChange = (_: React.SyntheticEvent, newValue: number) =>
    setTab(newValue);
  const showMessage = (severity: "success" | "error", message: string) =>
    setSnackbar({ open: true, severity, message });

  useEffect(() => {
    const accessToken =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    if (accessToken) {
      fetch("http://localhost:8080/api/v1/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
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
      <Paper
        elevation={2}
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          margin: "auto",
          maxWidth: 500,
          width: "100%",
          my: 2,
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
          <Tab
            label="ĐĂNG NHẬP"
            onClick={() => router.push(`/login?page=login`)}
          />
          <Tab
            label="ĐĂNG KÝ"
            onClick={() => router.push(`/login?page=register`)}
          />
        </Tabs>

        <Box sx={{ p: 4, bgcolor: "#f3f3f3" }}>
          <Typography variant="h6" textAlign="center" fontWeight="bold" mb={3}>
            {tab === 0 ? "ĐĂNG NHẬP" : "ĐĂNG KÝ"}
          </Typography>

          {tab === 0 ? (
            <LoginTab showMessage={showMessage} />
          ) : (
            <RegisterTab showMessage={showMessage} />
          )}
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ mt: 5, zIndex: 9999 }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
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
