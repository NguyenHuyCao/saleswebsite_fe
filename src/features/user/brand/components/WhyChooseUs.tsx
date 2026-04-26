"use client";

import {
  Box,
  Grid,
  Typography,
  Paper,
  Chip,
  Stack,
} from "@mui/material";

import VerifiedIcon from "@mui/icons-material/Verified";
import BuildIcon from "@mui/icons-material/Build";
import HandymanIcon from "@mui/icons-material/Handyman";
import HandshakeIcon from "@mui/icons-material/Handshake";
import GroupsIcon from "@mui/icons-material/Groups";
import InventoryIcon from "@mui/icons-material/Inventory";
import StorefrontIcon from "@mui/icons-material/Storefront";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import type { SvgIconComponent } from "@mui/icons-material";

type Reason = {
  Icon: SvgIconComponent;
  title: string;
  description: string;
  stats: string;
  color: string;
  bgColor: string;
};

const reasons: Reason[] = [
  {
    Icon: VerifiedIcon,
    title: "Cam kết chính hãng 100%",
    description:
      "Sản phẩm chính hãng, có tem bảo hành điện tử, nhập khẩu trực tiếp từ nhà sản xuất.",
    stats: "11+ thương hiệu",
    color: "#4caf50",
    bgColor: "rgba(76, 175, 80, 0.1)",
  },
  {
    Icon: BuildIcon,
    title: "Phụ tùng dễ thay thế",
    description:
      "Kho phụ tùng đa dạng, sẵn sàng thay thế nhanh chóng cho mọi dòng máy 2 thì.",
    stats: "Đa dạng linh kiện",
    color: "#f25c05",
    bgColor: "rgba(242, 92, 5, 0.1)",
  },
  {
    Icon: HandymanIcon,
    title: "Hỗ trợ kỹ thuật tận tâm",
    description:
      "Đội ngũ kỹ thuật viên giàu kinh nghiệm, tư vấn và hỗ trợ tận nơi, 7 ngày trong tuần.",
    stats: "Hỗ trợ 7 ngày/tuần",
    color: "#2196f3",
    bgColor: "rgba(33, 150, 243, 0.1)",
  },
  {
    Icon: HandshakeIcon,
    title: "Giá tốt – Dài lâu",
    description:
      "Hợp tác chiến lược với các nhà cung cấp hàng đầu, cam kết giá niêm yết, không phát sinh.",
    stats: "6+ năm kinh nghiệm",
    color: "#ffb700",
    bgColor: "rgba(255, 183, 0, 0.1)",
  },
];

type StatItem = {
  Icon: SvgIconComponent;
  value: string;
  label: string;
};

const stats: StatItem[] = [
  { Icon: GroupsIcon,    value: "5.000+", label: "Khách hàng" },
  { Icon: InventoryIcon, value: "200+",   label: "Sản phẩm" },
  { Icon: StorefrontIcon,value: "11+",    label: "Thương hiệu" },
  { Icon: AccessTimeIcon,value: "6+",     label: "Năm kinh nghiệm" },
];

export default function WhyChooseUs() {
  return (
    <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: "#fff" }}>
      {/* Header */}
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Chip
          label="TẠI SAO CHỌN CHÚNG TÔI?"
          size="small"
          sx={{ bgcolor: "#f25c05", color: "#fff", fontWeight: 700, mb: 2 }}
        />
        <Typography
          variant="h3"
          fontWeight={800}
          sx={{ fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.5rem" }, mb: 2 }}
        >
          4 LÝ DO BẠN NÊN{" "}
          <Box component="span" sx={{ color: "#ffb700" }}>
            TIN TƯỞNG
          </Box>
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 620, mx: "auto" }}>
          Với hơn 6 năm kinh nghiệm trong ngành máy công cụ 2 thì, Cường Hoa tự hào mang đến
          sản phẩm và dịch vụ tốt nhất cho từng khách hàng.
        </Typography>
      </Box>

      {/* Reasons Grid */}
      <Grid container spacing={{ xs: 2, md: 3 }}>
        {reasons.map(({ Icon, title, description, stats: statLabel, color, bgColor }, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 4 },
                height: "100%",
                borderRadius: 4,
                position: "relative",
                overflow: "hidden",
                transition: "all 0.25s ease",
                border: "1px solid rgba(0,0,0,0.06)",
                "&:hover": {
                  boxShadow: "0 12px 28px rgba(0,0,0,0.08)",
                  borderColor: color,
                  transform: "translateY(-6px)",
                },
              }}
            >
              {/* Decorative circle */}
              <Box
                sx={{
                  position: "absolute",
                  top: -20,
                  right: -20,
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  bgcolor: bgColor,
                  zIndex: 0,
                }}
              />

              <Box sx={{ position: "relative", zIndex: 1 }}>
                <Box
                  sx={{
                    width: 72,
                    height: 72,
                    borderRadius: 3,
                    bgcolor: bgColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 3,
                    border: "1px solid",
                    borderColor: color,
                  }}
                >
                  <Icon sx={{ fontSize: 34, color }} />
                </Box>

                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{ mb: 1.5, color: "#333", fontSize: { xs: "1rem", md: "1.05rem" } }}
                >
                  {title}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2, lineHeight: 1.65 }}
                >
                  {description}
                </Typography>

                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{ mt: 2, pt: 2, borderTop: "1px dashed rgba(0,0,0,0.1)" }}
                >
                  <VerifiedIcon sx={{ fontSize: 16, color }} />
                  <Typography variant="caption" sx={{ fontWeight: 600, color }}>
                    {statLabel}
                  </Typography>
                </Stack>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Stats Footer */}
      <Paper
        elevation={0}
        sx={{
          mt: 6,
          p: { xs: 3, md: 4 },
          borderRadius: 4,
          bgcolor: "#fafafa",
          border: "1px solid #ffb700",
        }}
      >
        <Grid container spacing={3}>
          {stats.map(({ Icon, value, label }, index) => (
            <Grid key={index} size={{ xs: 6, md: 3 }}>
              <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 3,
                    bgcolor: "#fff8f0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#f25c05",
                  }}
                >
                  <Icon sx={{ fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={800} color="#f25c05">
                    {value}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {label}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Trust Badges */}
      <Stack
        direction="row"
        justifyContent="center"
        sx={{ mt: 4, flexWrap: "wrap", gap: 2 }}
      >
        <Chip
          icon={<VerifiedIcon />}
          label="Chính hãng 100%"
          sx={{ bgcolor: "#fff8e1", color: "#f25c05", fontWeight: 600, px: 2 }}
        />
        <Chip
          icon={<VerifiedIcon />}
          label="Bảo hành 12 tháng"
          sx={{ bgcolor: "#fff8e1", color: "#f25c05", fontWeight: 600, px: 2 }}
        />
        <Chip
          icon={<VerifiedIcon />}
          label="Miễn phí vận chuyển"
          sx={{ bgcolor: "#fff8e1", color: "#f25c05", fontWeight: 600, px: 2 }}
        />
      </Stack>
    </Box>
  );
}
