"use client";

import { Box, Typography, Grid, Paper } from "@mui/material";
import { Wrench, AlertTriangle, Package } from "lucide-react";

const warrantyCards = [
  {
    icon: <Wrench size={36} color="#2563eb" />,
    title: "Thời gian bảo hành",
    description: "Tối đa 12 tháng kể từ ngày mua (tùy từng sản phẩm).",
  },
  {
    icon: <AlertTriangle size={36} color="#f25c05" />,
    title: "Không bảo hành nếu:",
    description:
      "Sản phẩm bị hỏng do sử dụng sai cách, rơi vỡ, tự ý tháo lắp hoặc can thiệp kỹ thuật.",
  },
  {
    icon: <Package size={36} color="#10b981" />,
    title: "Yêu cầu:",
    description:
      "Cần cung cấp mã đơn hàng và tên sản phẩm cần bảo hành để được xử lý nhanh chóng.",
  },
];

const WarrantyConditionsCards = () => {
  return (
    <Box px={4} py={8} bgcolor="#f9fafb">
      <Typography
        variant="h5"
        fontWeight={700}
        textAlign="center"
        color="primary"
        mb={6}
      >
        Điều kiện và thời gian bảo hành
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {warrantyCards.map((item, index) => (
          <Grid key={index} size={{ xs: 12, md: 4 }}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                borderRadius: 3,
                height: "100%",
                textAlign: "center",
                transition: "transform 0.3s ease",
                ":hover": {
                  transform: "translateY(-6px)",
                  boxShadow: 6,
                },
              }}
            >
              <Box mb={2}>{item.icon}</Box>
              <Typography variant="h6" fontWeight={600} mb={1}>
                {item.title}
              </Typography>
              <Typography fontSize={14} color="text.secondary">
                {item.description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default WarrantyConditionsCards;
