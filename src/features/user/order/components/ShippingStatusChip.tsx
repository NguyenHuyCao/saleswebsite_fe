// order/components/ShippingStatusChip.tsx
"use client";

import { Chip, Tooltip, Box } from "@mui/material";

interface ShippingStatusChipProps {
  status: string;
  showTooltip?: boolean;
}

export default function ShippingStatusChip({
  status,
  showTooltip = true,
}: ShippingStatusChipProps) {
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "PENDING":
        return {
          label: "⏳ Chờ xác nhận",
          color: "warning" as const,
          tooltip: "Đơn hàng đang chờ được xác nhận",
        };
      case "WAITING_PAYMENT":
        return {
          label: "💰 Chờ thanh toán",
          color: "warning" as const,
          tooltip: "Vui lòng thanh toán để tiếp tục",
        };
      case "CONFIRMED":
        return {
          label: "✅ Đã xác nhận",
          color: "info" as const,
          tooltip: "Đơn hàng đã được xác nhận",
        };
      case "SHIPPING":
        return {
          label: "🚚 Đang vận chuyển",
          color: "warning" as const,
          tooltip: "Đơn hàng đang trên đường vận chuyển",
        };
      case "DELIVERED":
        return {
          label: "📦 Đã nhận hàng",
          color: "success" as const,
          tooltip: "Bạn đã nhận được hàng",
        };
      case "CANCELLED":
        return {
          label: "❌ Đã hủy",
          color: "error" as const,
          tooltip: "Đơn hàng đã bị hủy",
        };
      case "FAILED":
        return {
          label: "⚠️ Thất bại",
          color: "error" as const,
          tooltip: "Có lỗi xảy ra, vui lòng liên hệ hỗ trợ",
        };
      default:
        return {
          label: "❓ Không rõ",
          color: "default" as const,
          tooltip: "Trạng thái không xác định",
        };
    }
  };

  const info = getStatusInfo(status);

  const chip = (
    <Chip
      label={info.label}
      color={info.color}
      size="small"
      sx={{
        width: "100%",
        maxWidth: { xs: "100%", sm: 130 },
        fontWeight: 600,
        fontSize: { xs: "0.65rem", sm: "0.7rem" },
        height: { xs: 28, sm: 24 },
        "& .MuiChip-label": {
          px: { xs: 0.5, sm: 1 },
          whiteSpace: "normal",
          textOverflow: "ellipsis",
          overflow: "hidden",
        },
      }}
    />
  );

  if (showTooltip) {
    return (
      <Tooltip title={info.tooltip} arrow>
        {chip}
      </Tooltip>
    );
  }

  return chip;
}
