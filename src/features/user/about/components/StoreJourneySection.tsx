"use client";

import { Box, Typography, Chip, Stack, Paper } from "@mui/material";
import StorefrontIcon from "@mui/icons-material/Storefront";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import GroupsIcon from "@mui/icons-material/Groups";
import InventoryIcon from "@mui/icons-material/Inventory";
import PublicIcon from "@mui/icons-material/Public";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

const milestones = [
  {
    year: "2019",
    icon: <StorefrontIcon sx={{ fontSize: 20 }} />,
    title: "Thành lập cửa hàng",
    desc: "Cường Hoa ra đời tại Nghĩa Phương, Bắc Ninh — bắt đầu với dòng máy cắt cỏ và máy cưa 2 thì.",
    color: "#f25c05",
  },
  {
    year: "2020",
    icon: <InventoryIcon sx={{ fontSize: 20 }} />,
    title: "Mở rộng danh mục",
    desc: "Đưa thêm máy phát điện, máy phun thuốc và phụ kiện vào danh mục — phục vụ đa dạng nhu cầu nông nghiệp.",
    color: "#ff9800",
  },
  {
    year: "2021",
    icon: <GroupsIcon sx={{ fontSize: 20 }} />,
    title: "Vượt mốc 3.000 khách hàng",
    desc: "Xây dựng được đội ngũ kỹ thuật viên chuyên nghiệp, chính sách bảo hành rõ ràng và dịch vụ hậu mãi tận tâm.",
    color: "#4caf50",
  },
  {
    year: "2022",
    icon: <PublicIcon sx={{ fontSize: 20 }} />,
    title: "Phân phối toàn quốc",
    desc: "Triển khai bán hàng online, giao hàng toàn quốc — tiếp cận khách hàng từ Nam ra Bắc.",
    color: "#2196f3",
  },
  {
    year: "2023",
    icon: <EmojiEventsIcon sx={{ fontSize: 20 }} />,
    title: "Đại lý chính thức đa thương hiệu",
    desc: "Trở thành đại lý cấp 1 của Honda, STIHL, Husqvarna — cam kết hàng chính hãng 100%.",
    color: "#9c27b0",
  },
  {
    year: "2024+",
    icon: <TrendingUpIcon sx={{ fontSize: 20 }} />,
    title: "Vượt 10.000 khách hàng",
    desc: "Tiếp tục mở rộng, nâng cao trải nghiệm mua sắm trực tuyến và dịch vụ hỗ trợ kỹ thuật trọn đời.",
    color: "#f25c05",
  },
];

export default function StoreJourneySection() {
  return (
    <Box
      py={{ xs: 6, md: 8 }}
      sx={{
        bgcolor: "#f9f9f9",
        mx: { xs: -2, sm: -3, md: -3 },
        px: { xs: 2, sm: 3, md: 3 },
      }}
    >
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Chip
          label="HÀNH TRÌNH PHÁT TRIỂN"
          sx={{ bgcolor: "#f25c05", color: "#fff", fontWeight: 700, mb: 2 }}
        />
        <Typography
          variant="h3"
          fontWeight={800}
          sx={{ fontSize: { xs: "1.8rem", md: "2.4rem" }, mb: 2 }}
        >
          5 năm xây dựng{" "}
          <Box component="span" sx={{ color: "#ffb700" }}>
            niềm tin
          </Box>
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 560, mx: "auto" }}>
          Mỗi mốc son là một lời khẳng định — Cường Hoa không ngừng lớn mạnh để phục vụ bạn tốt hơn.
        </Typography>
      </Box>

      {/* Timeline */}
      <Box sx={{ maxWidth: 800, mx: "auto", position: "relative" }}>
        {/* Vertical line */}
        <Box
          sx={{
            position: "absolute",
            left: { xs: 20, sm: 28 },
            top: 0,
            bottom: 0,
            width: 2,
            bgcolor: "#f0e0d0",
            zIndex: 0,
          }}
        />

        <Stack spacing={3}>
          {milestones.map((m, i) => (
            <Box key={i} sx={{ position: "relative", pl: { xs: 7, sm: 9 } }}>
              {/* Dot */}
              <Box
                sx={{
                  position: "absolute",
                  left: { xs: 9, sm: 17 },
                  top: 16,
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  bgcolor: m.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  zIndex: 1,
                  boxShadow: `0 0 0 4px ${m.color}20`,
                }}
              >
                {m.icon}
              </Box>

              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 2.5 },
                  borderRadius: 3,
                  border: "1px solid #f0f0f0",
                  bgcolor: "#fff",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    borderColor: m.color + "50",
                    boxShadow: `0 6px 20px ${m.color}12`,
                  },
                }}
              >
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Box
                    sx={{
                      flexShrink: 0,
                      bgcolor: m.color,
                      color: "#fff",
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1.5,
                      fontWeight: 800,
                      fontSize: "0.8rem",
                      lineHeight: 1,
                      mt: 0.25,
                    }}
                  >
                    {m.year}
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                      {m.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.65 }}>
                      {m.desc}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
