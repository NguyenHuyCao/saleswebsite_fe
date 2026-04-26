"use client";

import { Box, Typography, Paper, Stack, Chip } from "@mui/material";
import Grid from "@mui/material/Grid";
import { motion } from "framer-motion";
import BuildIcon from "@mui/icons-material/Build";
import SecurityIcon from "@mui/icons-material/Security";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PaymentIcon from "@mui/icons-material/Payment";
import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";

const services = [
  {
    icon: <BuildIcon sx={{ fontSize: 40 }} />,
    title: "Sửa chữa & Bảo trì",
    description: "Dịch vụ sửa chữa chuyên nghiệp cho tất cả các dòng máy",
    features: ["Sửa chữa tận nơi", "Linh kiện chính hãng", "Bảo hành dịch vụ"],
  },
  {
    icon: <SecurityIcon sx={{ fontSize: 40 }} />,
    title: "Bảo hành chính hãng",
    description: "Trung tâm bảo hành ủy quyền của các thương hiệu lớn",
    features: ["Bảo hành 12 tháng", "Miễn phí vận chuyển", "Hotline hỗ trợ"],
  },
  {
    icon: <SupportAgentIcon sx={{ fontSize: 40 }} />,
    title: "Tư vấn chuyên sâu",
    description: "Đội ngũ kỹ thuật viên giàu kinh nghiệm tư vấn tận tình",
    features: ["Tư vấn trực tiếp", "Demo sản phẩm", "Giải đáp thắc mắc"],
  },
  {
    icon: <LocalShippingIcon sx={{ fontSize: 40 }} />,
    title: "Giao hàng tận nơi",
    description: "Nhận hàng tại cửa hàng hoặc giao hàng tận nhà",
    features: [
      "Miễn phí nội thành",
      "Giao nhanh 2h",
      "Kiểm tra hàng trước khi nhận",
    ],
  },
  {
    icon: <PaymentIcon sx={{ fontSize: 40 }} />,
    title: "Thanh toán linh hoạt",
    description: "Đa dạng hình thức thanh toán, hỗ trợ trả góp",
    features: ["Tiền mặt", "Chuyển khoản", "Trả góp 0%"],
  },
  {
    icon: <AssignmentReturnIcon sx={{ fontSize: 40 }} />,
    title: "Đổi trả dễ dàng",
    description: "Chính sách đổi trả linh hoạt, bảo vệ quyền lợi khách hàng",
    features: ["Đổi trả 7 ngày", "Hoàn tiền nhanh", "Hỗ trợ nhiệt tình"],
  },
];

export default function StoreServicesSection() {
  return (
    <Box sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight={800} color="#333" gutterBottom>
        Dịch vụ tại cửa hàng
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Chúng tôi cam kết mang đến trải nghiệm tốt nhất cho khách hàng
      </Typography>

      <Grid container spacing={3}>
        {services.map((service, idx) => (
          <Grid key={idx} size={{ xs: 12, sm: 6, md: 4 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              viewport={{ once: true }}
            >
              <Paper
                sx={{
                  p: 3,
                  height: "100%",
                  borderRadius: 3,
                  transition: "all 0.3s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 12px 28px rgba(242,92,5,0.15)",
                  },
                }}
              >
                <Box sx={{ color: "#f25c05", mb: 2 }}>{service.icon}</Box>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  {service.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {service.description}
                </Typography>
                <Stack spacing={1}>
                  {service.features.map((feature, i) => (
                    <Chip
                      key={i}
                      label={feature}
                      size="small"
                      sx={{ bgcolor: "#f5f5f5", width: "fit-content" }}
                    />
                  ))}
                </Stack>
              </Paper>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
