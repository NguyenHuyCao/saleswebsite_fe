"use client";

import { Box, Grid, Paper, Typography } from "@mui/material";
import { Build, WarningAmber, Inventory } from "@mui/icons-material";

const conditions = [
  {
    icon: <Build fontSize="large" color="primary" />,
    title: "Thời gian bảo hành",
    content: "Tối đa 12 tháng kể từ ngày mua (tùy từng sản phẩm)",
  },
  {
    icon: <WarningAmber fontSize="large" color="error" />,
    title: "Không bảo hành nếu:",
    content: "Sản phẩm bị hỏng do sử dụng sai cách, rơi vỡ, tự ý tháo lắp",
  },
  {
    icon: <Inventory fontSize="large" color="action" />,
    title: "Yêu cầu:",
    content: "Cần cung cấp mã đơn hàng và tên sản phẩm cần bảo hành.",
  },
];

const WarrantyConditions = () => {
  return (
    <Box px={4} py={6}>
      <Grid container spacing={4}>
        {conditions.map((item, index) => (
          <Grid key={index} size={{ xs: 12, md: 4 }}>
            <Paper
              elevation={3}
              sx={{ p: 3, borderRadius: 3, textAlign: "center" }}
            >
              <Box mb={2}>{item.icon}</Box>
              <Typography variant="h6" fontWeight={600} mb={1}>
                {item.title}
              </Typography>
              <Typography fontSize={14}>{item.content}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default WarrantyConditions;
