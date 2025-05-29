"use client";

import { Alert, Box, Collapse, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";

interface OrderAlertProps {
  orderId: number;
  status: string;
  paymentStatus: string;
}

const OrderAlert = ({ orderId, status, paymentStatus }: OrderAlertProps) => {
  const [open, setOpen] = useState(true);

  let message = "";
  let severity: "info" | "success" | "warning" | "error" = "info";

  if (status === "SHIPPING") {
    message = `Đơn hàng #${orderId} đang trên đường giao đến bạn!`;
    severity = "info";
  } else if (status === "COMPLETED" && paymentStatus === "PAID") {
    message = `Đơn hàng #${orderId} đã hoàn tất và thanh toán thành công.`;
    severity = "success";
  } else if (status === "CANCELLED") {
    message = `Đơn hàng #${orderId} đã bị hủy. Nếu cần hỗ trợ, hãy liên hệ chúng tôi.`;
    severity = "error";
  } else if (paymentStatus === "PENDING") {
    message = `Đơn hàng #${orderId} đang chờ thanh toán.`;
    severity = "warning";
  }

  // Nếu không có gì để hiển thị thì không render
  if (!message) return null;

  return (
    <Box mb={3}>
      <Collapse in={open}>
        <Alert
          severity={severity}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => setOpen(false)}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {message}
        </Alert>
      </Collapse>
    </Box>
  );
};

export default OrderAlert;
