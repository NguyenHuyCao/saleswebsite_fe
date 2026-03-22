"use client";

import { Button, CircularProgress, Box } from "@mui/material";
import { usePlaceOrder } from "../queries";
import type { PlaceOrderPayload } from "../types";
import { useToast } from "@/lib/toast/ToastContext";

export default function ConfirmButton({
  getPayload,
  disabled,
  onSuccess,
}: {
  getPayload: () => PlaceOrderPayload;
  disabled?: boolean;
  onSuccess?: (orderId: string | number) => void;
}) {
  const { showToast } = useToast();
  const { mutateAsync, isPending } = usePlaceOrder();

  const handleConfirm = async () => {
    try {
      const res = await mutateAsync(getPayload());
      showToast(res?.message || "Đặt hàng thành công!", "success", "Đặt hàng");
      onSuccess?.(res.orderId);
    } catch (e: any) {
      showToast(e?.message || "Đặt hàng thất bại", "error");
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

    </Box>
  );
}
