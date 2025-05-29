import { Chip } from "@mui/material";

const ShippingStatusChip = ({ status }: { status: string }) => {
  const labelMap: Record<string, string> = {
    LOCAL_SHIPPER: "Đang giao nội địa",
    IN_TRANSIT: "Đang vận chuyển",
    DELIVERED: "Đã giao",
    RETURNED: "Hoàn hàng",
  };

  const colorMap: Record<string, "info" | "success" | "warning" | "error"> = {
    LOCAL_SHIPPER: "info",
    IN_TRANSIT: "warning",
    DELIVERED: "success",
    RETURNED: "error",
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
