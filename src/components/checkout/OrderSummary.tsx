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

const cartData = [
  {
    productId: 1,
    productName: "Máy xay cỏa",
    productDescription:
      "Máy xay sinh tố công suất lớn, thiết kế hiện đại, dễ sử dụng và dễ vệ sinh.",
    productImage: "2-31b0f11c-68ae-4462-a707-4071c1a644eb.jpg",
    unitPrice: 0,
    quantity: 2,
    totalPrice: 0,
  },
  {
    productId: 6,
    productName: "Máy cầy",
    productDescription: "máy cầy",
    productImage: "1534231926-5.jpg",
    unitPrice: 123134123,
    quantity: 2,
    totalPrice: 246268246,
  },
];

export default function OrderSummary() {
  const subtotal = cartData.reduce((sum, item) => sum + item.totalPrice, 0);
  const shippingFee = 30000;
  const total = subtotal + shippingFee;

  return (
    <Card variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Tổng quan đơn hàng
        </Typography>
        <Stack spacing={2}>
          {cartData.map((item) => (
            <Box
              key={item.productId}
              display="flex"
              alignItems="flex-start"
              gap={2}
            >
              <Avatar
                variant="rounded"
                src={`/images/product/${item.productImage}`}
                alt={item.productName}
                sx={{ width: 56, height: 56, flexShrink: 0 }}
              />
              <Box flex={1}>
                <Typography fontWeight={600}>{item.productName}</Typography>
                <Typography variant="body2" color="text.secondary">
                  SL: {item.quantity} x {item.unitPrice.toLocaleString()}₫
                </Typography>
              </Box>
              <Typography fontWeight="bold" color="primary" whiteSpace="nowrap">
                {item.totalPrice.toLocaleString()}₫
              </Typography>
            </Box>
          ))}
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Stack spacing={1.2}>
          <Box display="flex" justifyContent="space-between">
            <Typography color="text.secondary">Tạm tính:</Typography>
            <Typography>{subtotal.toLocaleString()}₫</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Typography color="text.secondary">Phí vận chuyển:</Typography>
            <Typography>{shippingFee.toLocaleString()}₫</Typography>
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
              {total.toLocaleString()}₫
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
