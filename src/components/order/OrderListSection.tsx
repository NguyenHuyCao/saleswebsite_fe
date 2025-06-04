"use client";

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Chip,
  Grid,
  Divider,
  Stack,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import BuildCircleIcon from "@mui/icons-material/BuildCircle";
import ShippingStatusChip from "./ShippingStatusChipProps";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      try {
        const res = await fetch("http://localhost:8080/api/v1/history_orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const json = await res.json();
        setOrders(json.data || []);
      } catch (err) {
        console.error("Lỗi khi lấy lịch sử đơn hàng:", err);
      }
    };

    fetchOrders();
  }, []);

  return (
    <Box mt={6}>
      {orders.length === 0 && (
        <Typography textAlign="center" mt={5}>
          Bạn chưa có đơn hàng nào.
        </Typography>
      )}
      {orders.map((order) => (
        <Box key={order.orderId} mb={2}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
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
                  <ShippingStatusChip status={order.shippingMethod} />
                </Grid>

                <Grid size={{ xs: 12, md: 2 }}>
                  <Stack direction="row" spacing={1}>
                    {/* HỖ TRỢ */}
                    <Box
                      onClick={() => router.push("/contact")}
                      display="flex"
                      alignItems="center"
                      px={1.5}
                      py={0.5}
                      border="1px solid"
                      borderColor="error.main"
                      color="error.main"
                      borderRadius={1}
                      fontSize={14}
                      fontWeight={500}
                      sx={{
                        cursor: "pointer",
                        transition: "all 0.2s",
                        "&:hover": {
                          backgroundColor: "error.main",
                          color: "#fff",
                        },
                      }}
                    >
                      <HelpOutlineIcon sx={{ fontSize: 18, mr: 1 }} />
                      Hỗ trợ
                    </Box>

                    {/* BẢO HÀNH */}
                    <Box
                      onClick={() => router.push("/warranty")}
                      display="flex"
                      alignItems="center"
                      px={1.5}
                      py={0.5}
                      border="1px solid"
                      borderColor="info.main"
                      color="info.main"
                      borderRadius={1}
                      fontSize={14}
                      fontWeight={500}
                      sx={{
                        cursor: "pointer",
                        transition: "all 0.2s",
                        "&:hover": {
                          backgroundColor: "info.main",
                          color: "#fff",
                        },
                      }}
                    >
                      <BuildCircleIcon sx={{ fontSize: 18, mr: 1 }} />
                      Bảo hành
                    </Box>
                  </Stack>
                </Grid>
              </Grid>
            </AccordionSummary>

            <AccordionDetails>
              <Typography fontWeight={600} mb={1}>
                Sản phẩm trong đơn:
              </Typography>
              {order.items.map((item: any, i: number) => (
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
                <strong>Phương thức vận chuyển:</strong>{" "}
                {order.shippingMethod || "Không rõ"}
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Box>
      ))}
    </Box>
  );
};

export default OrderListSection;
