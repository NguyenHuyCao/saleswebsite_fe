"use client";

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Chip,
  Grid,
  Button,
  Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import ShippingStatusChip from "./ShippingStatusChipProps";

const orders = [
  {
    orderId: 5,
    status: "PENDING",
    shippingStatus: "LOCAL_SHIPPER",
    shippingAddress: "456 Trần Hưng Đạo, Quy Nhơn",
    paymentMethod: "COD",
    shippingMethod: "LOCAL_SHIPPER",
    totalAmount: 0,
    createdAt: "2025-05-29T13:20:43.472Z",
    items: [
      {
        productName: "Máy xay cỏ",
        quantity: 2,
        unitPrice: 0,
      },
    ],
    paymentStatus: "PENDING",
  },
  {
    orderId: 2,
    status: "PENDING",
    shippingStatus: "LOCAL_SHIPPER",
    shippingAddress: "456 Trần Hưng Đạo, Quy Nhơn",
    paymentMethod: "COD",
    shippingMethod: "LOCAL_SHIPPER",
    totalAmount: 0,
    createdAt: "2025-05-29T13:20:43.472Z",
    items: [
      {
        productName: "Máy xay cỏ",
        quantity: 2,
        unitPrice: 0,
      },
    ],
    paymentStatus: "PENDING",
  },
  {
    orderId: 1,
    status: "PENDING",
    shippingStatus: "LOCAL_SHIPPER",
    shippingAddress: "456 Trần Hưng Đạo, Quy Nhơn",
    paymentMethod: "COD",
    shippingMethod: "LOCAL_SHIPPER",
    totalAmount: 0,
    createdAt: "2025-05-29T13:20:43.472Z",
    items: [
      {
        productName: "Máy xay cỏ",
        quantity: 2,
        unitPrice: 0,
      },
    ],
    paymentStatus: "PENDING",
  },
];

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN");
};

const statusColor = (status: string) => {
  switch (status) {
    case "PENDING":
      return "warning";
    case "COMPLETED":
      return "success";
    case "CANCELLED":
      return "error";
    default:
      return "default";
  }
};

const OrderListSection = () => {
  return (
    <Box mt={6}>
      {orders.map((order) => (
        <Box key={order.orderId}>
          <Accordion sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ width: "100%" }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid size={{ xs: 12, md: 3 }}>
                    <Typography fontWeight={600}>
                      Đơn hàng #{order.orderId}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Ngày đặt: {formatDate(order.createdAt)}
                    </Typography>
                  </Grid>

                  <Grid size={{ xs: 6, md: 2 }}>
                    <Typography variant="body2">
                      Tổng tiền:{" "}
                      <strong>
                        {order.totalAmount.toLocaleString("vi-VN")}₫
                      </strong>
                    </Typography>
                  </Grid>

                  <Grid size={{ xs: 6, md: 3 }}>
                    <Chip
                      sx={{ width: 150 }}
                      label={
                        order.status === "PENDING"
                          ? "Chờ xác nhận"
                          : order.status === "COMPLETED"
                          ? "Đã hoàn tất"
                          : "Đã hủy"
                      }
                      color={statusColor(order.status)}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 2 }}>
                    <ShippingStatusChip status={order.shippingStatus} />
                  </Grid>

                  <Grid size={{ xs: 12, md: 2 }}>
                    <Box
                      display="flex"
                      justifyContent={{ xs: "flex-start", md: "flex-start" }}
                      flexWrap="wrap"
                      gap={1}
                    >
                      <Button
                        size="small"
                        color="error"
                        variant="outlined"
                        startIcon={<HelpOutlineIcon />}
                      >
                        Hỗ trợ
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </AccordionSummary>

            <AccordionDetails>
              <Typography fontWeight={600} mb={1}>
                Sản phẩm trong đơn:
              </Typography>
              {order.items.map((item, i) => (
                <Box
                  key={i}
                  display="flex"
                  justifyContent="space-between"
                  mb={1}
                >
                  <Typography>
                    {item.productName} × {item.quantity}
                  </Typography>
                  <Typography>
                    {(item.unitPrice * item.quantity).toLocaleString("vi-VN")}₫
                  </Typography>
                </Box>
              ))}
              <Divider sx={{ my: 2 }} />
              <Typography>
                <strong>Địa chỉ giao hàng:</strong> {order.shippingAddress}
              </Typography>
              <Typography>
                <strong>Phương thức thanh toán:</strong> {order.paymentMethod}
              </Typography>
              <Typography>
                <strong>Phương thức vận chuyển:</strong> {order.shippingMethod}
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Box>
      ))}
    </Box>
  );
};

export default OrderListSection;
