"use client";

import { Button, CircularProgress, Snackbar, Alert, Box } from "@mui/material";
import { useState } from "react";
import { usePlaceOrder } from "../queries";
import type { PlaceOrderPayload } from "../types";

export default function ConfirmButton({
  getPayload,
  disabled,
  onSuccess,
}: {
  getPayload: () => PlaceOrderPayload;
  disabled?: boolean;
  onSuccess?: (orderId: string | number) => void;
}) {
  const [toast, setToast] = useState<{
    open: boolean;
    msg: string;
    type: "success" | "error";
  }>({
    open: false,
    msg: "",
    type: "success",
  });

  const { mutateAsync, isPending } = usePlaceOrder();

  const handleConfirm = async () => {
    try {
      const res = await mutateAsync(getPayload());
      setToast({
        open: true,
        msg: res?.message || "Đặt hàng thành công!",
        type: "success",
      });
      onSuccess?.(res.orderId);
    } catch (e: any) {
      setToast({
        open: true,
        msg: e?.message || "Đặt hàng thất bại",
        type: "error",
      });
    }
  };

  return (
    <Box mt={2}>
      <Button
        fullWidth
        size="large"
        variant="contained"
        color="warning"
        onClick={handleConfirm}
        disabled={disabled || isPending}
        sx={{ fontWeight: "bold", py: 1.5, borderRadius: 2 }}
      >
        {isPending ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          "Xác nhận đặt hàng"
        )}
      </Button>

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast((s) => ({ ...s, open: false }))}
      >
        <Alert severity={toast.type} sx={{ width: "100%" }}>
          {toast.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
