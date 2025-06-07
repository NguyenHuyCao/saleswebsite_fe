import { Chip } from "@mui/material";

const ShippingStatusChip = ({ status }: { status: string }) => {
  const labelMap: Record<string, string> = {
    PENDING: "Đang chờ",
    WAITING_PAYMENT: "Đợi thanh toán",
    CONFIRMED: "Đã xác nhận",
    SHIPPING: "Đang vận chuyển",
    DELIVERED: "Đã nhận hàng",
    CANCELLED: "Lỗi đơn hàng",
    FAILED: "Thất bại",
  };

  const colorMap: Record<
    string,
    "info" | "success" | "warning" | "error" | "default"
  > = {
    PENDING: "warning",
    WAITING_PAYMENT: "warning",
    CONFIRMED: "info",
    SHIPPING: "warning",
    DELIVERED: "success",
    CANCELLED: "error",
    FAILED: "error",
  };

  return (
    <Chip
      sx={{ width: 150 }}
      label={labelMap[status] || "Không rõ"}
      color={colorMap[status] || "default"}
      size="small"
    />
  );
};

export default ShippingStatusChip;
