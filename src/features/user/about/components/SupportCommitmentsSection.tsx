"use client";

import { Box, Grid, Typography, Paper, Chip, Stack } from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import BuildCircleIcon from "@mui/icons-material/BuildCircle";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";

const commitments = [
  {
    icon: <VerifiedIcon sx={{ fontSize: 28 }} />,
    title: "Hàng chính hãng 100%",
    description: "Tất cả sản phẩm có nguồn gốc rõ ràng, tem bảo hành điện tử, hoá đơn VAT đầy đủ.",
    color: "#f25c05",
  },
  {
    icon: <BuildCircleIcon sx={{ fontSize: 28 }} />,
    title: "Bảo hành 12 tháng",
    description: "Bảo hành chính hãng 12 tháng tại cửa hàng, lỗi do nhà sản xuất đổi mới 100%.",
    color: "#4caf50",
  },
  {
    icon: <SupportAgentIcon sx={{ fontSize: 28 }} />,
    title: "Hỗ trợ kỹ thuật trọn đời",
    description: "Đội ngũ kỹ thuật viên giàu kinh nghiệm, tư vấn và hỗ trợ miễn phí suốt vòng đời sản phẩm.",
    color: "#2196f3",
  },
  {
    icon: <LocalShippingIcon sx={{ fontSize: 28 }} />,
    title: "Giao hàng toàn quốc",
    description: "Miễn phí vận chuyển cho đơn hàng từ 3 triệu, giao nhanh 2–3 ngày toàn quốc.",
    color: "#9c27b0",
  },
  {
    icon: <SwapHorizIcon sx={{ fontSize: 28 }} />,
    title: "Đổi trả linh hoạt 7 ngày",
    description: "Đổi trả trong 7 ngày nếu sản phẩm lỗi hoặc không đúng mô tả, không hỏi thêm.",
    color: "#ff9800",
  },
  {
    icon: <PriceCheckIcon sx={{ fontSize: 28 }} />,
    title: "Cam kết giá niêm yết",
    description: "Giá bán đúng niêm yết, không phụ thu, không ép giá — minh bạch 100%.",
    color: "#00bcd4",
  },
];

export default function SupportCommitmentsSection() {
  return (
    <Box py={{ xs: 6, md: 8 }}>
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Chip
          label="CAM KẾT & HỖ TRỢ"
          sx={{ bgcolor: "#f25c05", color: "#fff", fontWeight: 700, mb: 2 }}
        />
        <Typography
          variant="h3"
          fontWeight={800}
          sx={{ fontSize: { xs: "1.8rem", md: "2.4rem" }, mb: 2 }}
        >
          Chúng tôi cam kết{" "}
          <Box component="span" sx={{ color: "#ffb700" }}>
            với bạn
          </Box>
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 560, mx: "auto" }}>
          Mỗi cam kết đều được Cường Hoa thực hiện nghiêm túc — vì sự hài lòng của khách hàng là ưu tiên số 1.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {commitments.map((item, i) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                height: "100%",
                border: "1px solid #f0f0f0",
                transition: "all 0.25s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: `0 12px 32px ${item.color}18`,
                  borderColor: item.color + "40",
                },
              }}
            >
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 2.5,
                  bgcolor: item.color + "18",
                  color: item.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 2,
                }}
              >
                {item.icon}
              </Box>

              <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                {item.title}
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.65 }}>
                {item.description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
