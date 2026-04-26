"use client";

import { Chip, Tooltip } from "@mui/material";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import PaymentIcon from "@mui/icons-material/Payment";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

interface ShippingStatusChipProps {
  status: string;
  showTooltip?: boolean;
}

interface StatusInfo {
  label: string;
  icon: React.ReactElement;
  color: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning";
  tooltip: string;
}

function getStatusInfo(status: string): StatusInfo {
  switch (status) {
    case "PENDING":
      return {
        label: "Chờ xác nhận",
        icon: <HourglassEmptyIcon sx={{ fontSize: "0.85em" }} />,
        color: "warning",
        tooltip: "Đơn hàng đang chờ được xác nhận",
      };
    case "WAITING_PAYMENT":
      return {
        label: "Chờ thanh toán",
        icon: <PaymentIcon sx={{ fontSize: "0.85em" }} />,
        color: "warning",
        tooltip: "Vui lòng thanh toán để tiếp tục xử lý đơn hàng",
      };
    case "CONFIRMED":
      return {
        label: "Đã xác nhận",
        icon: <CheckCircleOutlineIcon sx={{ fontSize: "0.85em" }} />,
        color: "info",
        tooltip: "Đơn hàng đã được xác nhận và đang được chuẩn bị",
      };
    case "SHIPPING":
      return {
        label: "Đang vận chuyển",
        icon: <LocalShippingIcon sx={{ fontSize: "0.85em" }} />,
        color: "primary",
        tooltip: "Đơn hàng đang trên đường giao đến bạn",
      };
    case "DELIVERED":
      return {
        label: "Đã nhận hàng",
        icon: <CheckCircleIcon sx={{ fontSize: "0.85em" }} />,
        color: "success",
        tooltip: "Bạn đã nhận được hàng thành công",
      };
    case "CANCELLED":
      return {
        label: "Đã hủy",
        icon: <CancelIcon sx={{ fontSize: "0.85em" }} />,
        color: "error",
        tooltip: "Đơn hàng đã bị hủy",
      };
    case "FAILED":
      return {
        label: "Thất bại",
        icon: <ErrorOutlineIcon sx={{ fontSize: "0.85em" }} />,
        color: "error",
        tooltip: "Đơn hàng thất bại. Vui lòng liên hệ hỗ trợ",
      };
    default:
      return {
        label: "Không rõ",
        icon: <HelpOutlineIcon sx={{ fontSize: "0.85em" }} />,
        color: "default",
        tooltip: "Trạng thái không xác định",
      };
  }
}

export default function ShippingStatusChip({
  status,
  showTooltip = true,
}: ShippingStatusChipProps) {
  const info = getStatusInfo(status);

  const chip = (
    <Chip
      label={info.label}
      icon={info.icon}
      color={info.color}
      size="small"
      sx={{
        fontWeight: 600,
        fontSize: { xs: "0.64rem", sm: "0.68rem" },
        height: { xs: 24, sm: 22 },
        "& .MuiChip-label": {
          px: { xs: 0.75, sm: 1 },
        },
        "& .MuiChip-icon": {
          ml: { xs: 0.5, sm: 0.75 },
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
