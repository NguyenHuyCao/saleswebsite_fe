// about/components/SupportCommitmentsSection.tsx
"use client";

import {
  Box,
  Grid,
  Typography,
  Paper,
  Chip,
  Stack,
  Divider,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import VerifiedIcon from "@mui/icons-material/Verified";
import { motion } from "framer-motion";

const commitments = [
  {
    icon: <VerifiedIcon />,
    title: "Hàng chính hãng 100%",
    description:
      "Tất cả sản phẩm đều có nguồn gốc rõ ràng, tem bảo hành điện tử",
    color: "#f25c05",
  },
  {
    icon: <SupportAgentIcon />,
    title: "Bảo hành 12 tháng",
    description: "Bảo hành tận tâm, đổi trả linh hoạt trong 7 ngày",
    color: "#4caf50",
  },
  {
    icon: <LocalShippingIcon />,
    title: "Hỗ trợ kỹ thuật trọn đời",
    description: "Đội ngũ kỹ thuật viên giàu kinh nghiệm, hỗ trợ 24/7",
    color: "#2196f3",
  },
  {
    icon: <LocalShippingIcon />,
    title: "Giao hàng toàn quốc",
    description: "Miễn phí vận chuyển cho đơn hàng từ 3 triệu",
    color: "#9c27b0",
  },
];

export default function SupportCommitmentsSection() {
  return (
    <Box px={{ xs: 2, sm: 4 }} py={6} sx={{ bgcolor: "#fff" }}>
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Chip
          label="CAM KẾT & HỖ TRỢ"
          sx={{ bgcolor: "#f25c05", color: "#fff", fontWeight: 700, mb: 2 }}
        />

        <Typography
          variant="h3"
          fontWeight={800}
          sx={{
            fontSize: { xs: "2rem", md: "2.5rem" },
            mb: 2,
          }}
        >
          Chúng tôi cam kết{" "}
          <Box component="span" sx={{ color: "#ffb700" }}>
            với bạn
          </Box>
        </Typography>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        {commitments.map((item, i) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
            >
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  textAlign: "center",
                  borderRadius: 4,
                  height: "100%",
                  transition: "all 0.3s",
                  "&:hover": {
                    boxShadow: `0 12px 28px ${item.color}20`,
                  },
                }}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: 3,
                    bgcolor: item.color + "20",
                    color: item.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 2,
                  }}
                >
                  {item.icon}
                </Box>

                <Typography variant="h6" fontWeight={700} gutterBottom>
                  {item.title}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
              </Paper>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
