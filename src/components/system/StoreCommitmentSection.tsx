"use client";

import { Box, Typography, Grid, Paper } from "@mui/material";
import Image from "next/image";

const commitments = [
  {
    icon: "/images/icons/consultation.png",
    title: "Tư vấn đúng sản phẩm",
    description: "Đội ngũ chuyên môn hỗ trợ tận tình theo nhu cầu thực tế.",
  },
  {
    icon: "/images/icons/warranty.png",
    title: "Bảo hành & sửa chữa tại chỗ",
    description: "Xử lý nhanh gọn các vấn đề kỹ thuật ngay tại cửa hàng.",
  },
  {
    icon: "/images/icons/invoice.png",
    title: "Hóa đơn – xuất VAT đầy đủ",
    description:
      "Đáp ứng đầy đủ giấy tờ cho khách hàng cá nhân & doanh nghiệp.",
  },
  {
    icon: "/images/icons/exchange.png",
    title: "Dùng thử & đổi trả trong 7 ngày",
    description: "Yên tâm mua sắm – hỗ trợ đổi sản phẩm nếu không phù hợp.",
  },
];

const StoreCommitmentSection = () => {
  return (
    <Box px={4} py={8} bgcolor="#f5f5f5">
      <Typography
        variant="h5"
        fontWeight="bold"
        textAlign="center"
        mb={6}
        color="primary"
      >
        CAM KẾT DỊCH VỤ TẠI CỬA HÀNG
      </Typography>

      <Grid container spacing={4}>
        {commitments.map((item, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 3,
                textAlign: "center",
                transition: "transform 0.3s",
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: 6,
                },
              }}
            >
              <Box mb={2}>
                <Image
                  src={item.icon}
                  alt={item.title}
                  width={60}
                  height={60}
                />
              </Box>
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

export default StoreCommitmentSection;
