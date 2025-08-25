"use client";

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Chip,
  Divider,
  Stack,
  Skeleton,
  Tooltip,
} from "@mui/material";
import Grid from "@mui/material/Grid"; // ✅ dùng Grid với prop `size`
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import BuildCircleIcon from "@mui/icons-material/BuildCircle";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import ShippingStatusChip from "./ShippingStatusChip";
import type { Order } from "../types";

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("vi-VN");

export default function OrderListSection() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/history_orders`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const json = await res.json();
        setOrders(Array.isArray(json?.data) ? json.data : []);
      } catch (err) {
        console.error("Lỗi khi lấy lịch sử đơn hàng:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <Box mt={6}>
        {Array.from({ length: 3 }).map((_, idx) => (
          <Skeleton
            key={idx}
            variant="rectangular"
            height={100}
            sx={{ borderRadius: 2, mb: 2 }}
          />
        ))}
      </Box>
    );
  }

  return (
    <Box mt={6}>
      {orders.length === 0 ? (
        <Typography textAlign="center" mt={5}>
          Bạn chưa có đơn hàng nào.
        </Typography>
      ) : (
        orders.map((order) => (
          <Box
            key={order.orderId}
            mb={2}
            component={motion.div}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Accordion TransitionProps={{ unmountOnExit: true }}>
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
                        {(order.totalAmount ?? 0).toLocaleString("vi-VN")}₫
                      </strong>
                    </Typography>
                  </Grid>

                  <Grid size={{ xs: 6, md: 2 }}>
                    <Chip
                      label={
                        order.paymentStatus === "PAID"
                          ? "Đã thanh toán"
                          : "Chờ thanh toán"
                      }
                      color={
                        order.paymentStatus === "PAID" ? "success" : "warning"
                      }
                      sx={{ minWidth: 130 }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 2 }}>
                    <ShippingStatusChip status={order.status || "Không rõ"} />
                  </Grid>

                  <Grid size={{ xs: 12, md: 3 }}>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="Liên hệ hỗ trợ">
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
                            transition: "all 0.3s",
                            "&:hover": { bgcolor: "error.main", color: "#fff" },
                          }}
                        >
                          <HelpOutlineIcon sx={{ fontSize: 18, mr: 1 }} />
                          Hỗ trợ
                        </Box>
                      </Tooltip>

                      <Tooltip title="Yêu cầu bảo hành">
                        <Box
                          onClick={() =>
                            router.push("/warranty#warranty-check")
                          }
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
                            transition: "all 0.3s",
                            "&:hover": { bgcolor: "info.main", color: "#fff" },
                          }}
                        >
                          <BuildCircleIcon sx={{ fontSize: 18, mr: 1 }} />
                          Bảo hành
                        </Box>
                      </Tooltip>

                      <Tooltip title="Tải hoá đơn (chưa có API)">
                        <Box
                          display="flex"
                          alignItems="center"
                          px={1.5}
                          py={0.5}
                          border="1px solid"
                          borderColor="text.secondary"
                          color="text.secondary"
                          borderRadius={1}
                          fontSize={14}
                          fontWeight={500}
                          sx={{ cursor: "not-allowed", opacity: 0.6 }}
                        >
                          <ReceiptLongIcon sx={{ fontSize: 18, mr: 1 }} />
                          Hoá đơn
                        </Box>
                      </Tooltip>
                    </Stack>
                  </Grid>
                </Grid>
              </AccordionSummary>

              <AccordionDetails>
                <Typography fontWeight={600} mb={1}>
                  Sản phẩm trong đơn:
                </Typography>

                {order.items?.map((item, i) => (
                  <Box
                    key={`${order.orderId}-${i}`}
                    mb={2}
                    display="flex"
                    gap={2}
                    alignItems="center"
                  >
                    <Image
                      src={item.imageUrl}
                      alt={item.productName}
                      width={60}
                      height={60}
                      style={{ borderRadius: 6, objectFit: "cover" }}
                    />
                    <Box>
                      <Typography>
                        {item.productName} × {item.quantity} –{" "}
                        {(item.unitPrice * item.quantity).toLocaleString(
                          "vi-VN"
                        )}
                        ₫
                      </Typography>
                      {item.promotions?.length ? (
                        <Typography variant="body2" color="text.secondary">
                          Áp dụng khuyến mãi:{" "}
                          {item.promotions.map((p) => p.name).join(", ")}
                        </Typography>
                      ) : null}
                    </Box>
                  </Box>
                ))}

                <Divider sx={{ my: 2 }} />

                <Typography>
                  <strong>Địa chỉ giao hàng:</strong>{" "}
                  {order.shippingAddress || "—"}
                </Typography>
                <Typography>
                  <strong>Phương thức thanh toán:</strong>{" "}
                  {order.paymentMethod || "Không rõ"}
                </Typography>
                <Typography>
                  <strong>Trạng thái thanh toán:</strong>{" "}
                  {order.paymentStatus === "PAID"
                    ? "Đã thanh toán"
                    : "Chờ thanh toán"}
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Box>
        ))
      )}
    </Box>
  );
}
