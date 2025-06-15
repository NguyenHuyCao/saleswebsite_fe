"use client";
import { Button, CircularProgress, Snackbar, Alert, Box } from "@mui/material";
import { useState } from "react";

export default function ConfirmButton() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 2000);
  };

  return (
    <Box mt={2}>
      <Button
        fullWidth
        size="large"
        variant="contained"
        color="warning"
        onClick={handleConfirm}
        disabled={loading}
        sx={{ fontWeight: "bold", py: 1.5, borderRadius: 2 }}
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          "Xác nhận đặt hàng"
        )}
      </Button>
      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          Đặt hàng thành công! Cảm ơn bạn đã mua sắm tại cửa hàng.
        </Alert>
      </Snackbar>
    </Box>
  );
}
