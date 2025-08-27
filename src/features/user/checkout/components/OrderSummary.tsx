"use client";

import {
  Card,
  CardContent,
  Typography,
  Divider,
  Avatar,
  Box,
  Stack,
} from "@mui/material";
import type { CartItem } from "../types";

export default function OrderSummary({ items }: { items: CartItem[] }) {
  const cart = items?.length
    ? items
    : [
        {
          productId: 1,
          productName: "Máy xay cỏ",
          productDescription: "Công suất lớn, dễ vệ sinh.",
          productImage: "2-31b0f11c-68ae-4462-a707-4071c1a644eb.jpg",
          unitPrice: 0,
          quantity: 2,
          totalPrice: 0,
        },
      ];

  const subtotal = cart.reduce((sum, i) => sum + i.totalPrice, 0);
  const shippingFee = 30000;
  const total = subtotal + shippingFee;

  return (
    <Card variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Tổng quan đơn hàng
        </Typography>

        <Stack spacing={2}>
          {cart.map((item) => (
            <Box
              key={item.productId}
              display="flex"
              alignItems="flex-start"
              gap={2}
            >
              <Avatar
                variant="rounded"
                src={`/images/products/${item.productImage}`}
                alt={item.productName}
                sx={{ width: 56, height: 56, flexShrink: 0 }}
              />
              <Box flex={1}>
                <Typography fontWeight={600}>{item.productName}</Typography>
                <Typography variant="body2" color="text.secondary">
                  SL: {item.quantity} x {item.unitPrice.toLocaleString("vi-VN")}
                  ₫
                </Typography>
              </Box>
              <Typography fontWeight="bold" color="primary" whiteSpace="nowrap">
                {item.totalPrice.toLocaleString("vi-VN")}₫
              </Typography>
            </Box>
          ))}
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Stack spacing={1.2}>
          <Box display="flex" justifyContent="space-between">
            <Typography color="text.secondary">Tạm tính:</Typography>
            <Typography>{subtotal.toLocaleString("vi-VN")}₫</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Typography color="text.secondary">Phí vận chuyển:</Typography>
            <Typography>{shippingFee.toLocaleString("vi-VN")}₫</Typography>
          </Box>
          <Divider sx={{ my: 1 }} />
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="subtitle1" fontWeight="bold">
              Tổng cộng:
            </Typography>
            <Typography variant="subtitle1" fontWeight="bold" color="primary">
              {total.toLocaleString("vi-VN")}₫
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
