"use client";

import { Box, Typography, Grid, Stack, Chip, Divider, Avatar } from "@mui/material";
import Image from "next/image";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import StorefrontIcon from "@mui/icons-material/Storefront";
import GroupsIcon from "@mui/icons-material/Groups";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";

const values = [
  "Chất lượng hàng đầu, hàng chính hãng 100%",
  "Uy tín làm gốc — cam kết giá niêm yết",
  "Khách hàng là trọng tâm của mọi quyết định",
  "Hỗ trợ kỹ thuật tận tâm, trọn đời sản phẩm",
];

const highlights = [
  { icon: <StorefrontIcon sx={{ fontSize: 22, color: "#f25c05" }} />, label: "Cửa hàng chính thức", value: "293 TL293, Nghĩa Phương, Bắc Ninh" },
  { icon: <GroupsIcon sx={{ fontSize: 22, color: "#f25c05" }} />, label: "Phục vụ hơn", value: "10.000+ khách hàng toàn quốc" },
  { icon: <WorkspacePremiumIcon sx={{ fontSize: 22, color: "#f25c05" }} />, label: "Kinh nghiệm", value: "5+ năm trong ngành máy 2 thì" },
];

export default function WhoWeAre() {
  return (
    <Box id="who-we-are" py={{ xs: 6, md: 10 }}>
      <Grid container spacing={{ xs: 4, md: 8 }} alignItems="center">
        {/* Text */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Chip
            label="VỀ CƯỜNG HOA"
            sx={{ bgcolor: "#f25c05", color: "#fff", fontWeight: 700, mb: 2 }}
          />

          <Typography
            variant="h3"
            fontWeight={800}
            sx={{ mb: 2, fontSize: { xs: "1.8rem", md: "2.4rem" }, lineHeight: 1.25 }}
          >
            Cường Hoa —{" "}
            <Box component="span" sx={{ color: "#f25c05" }}>
              đối tác máy 2 thì
            </Box>{" "}
            tin cậy của bạn
          </Typography>

          <Typography variant="body1" color="text.secondary" paragraph sx={{ fontSize: "1.05rem", lineHeight: 1.75 }}>
            Với hơn <strong>5 năm kinh nghiệm</strong> trong lĩnh vực phân phối máy công cụ 2 thì, chúng tôi tự hào là đơn vị uy tín phục vụ hàng nghìn khách hàng tại Bắc Ninh và các tỉnh lân cận.
          </Typography>

          <Typography variant="body1" color="text.secondary" paragraph sx={{ fontSize: "1.05rem", lineHeight: 1.75 }}>
            Sứ mệnh của <strong>Cường Hoa</strong> là mang đến những sản phẩm máy cắt cỏ, máy cưa, máy phát điện chính hãng với giá hợp lý — cùng dịch vụ hậu mãi tận tâm giúp khách hàng yên tâm tuyệt đối.
          </Typography>

          {/* Highlights */}
          <Stack spacing={2} sx={{ mb: 3 }}>
            {highlights.map((h, i) => (
              <Stack key={i} direction="row" spacing={1.5} alignItems="flex-start">
                <Box sx={{ mt: 0.25, flexShrink: 0 }}>{h.icon}</Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}>
                    {h.label}
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>{h.value}</Typography>
                </Box>
              </Stack>
            ))}
          </Stack>

          <Divider sx={{ my: 3 }} />

          <Typography variant="subtitle2" fontWeight={700} gutterBottom>Giá trị cốt lõi</Typography>
          <Grid container spacing={1.5}>
            {values.map((value, idx) => (
              <Grid size={{ xs: 12, sm: 6 }} key={idx}>
                <Stack direction="row" spacing={1} alignItems="flex-start">
                  <CheckCircleIcon sx={{ color: "#f25c05", fontSize: 18, mt: 0.15, flexShrink: 0 }} />
                  <Typography variant="body2" color="text.secondary">{value}</Typography>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Image */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            sx={{
              borderRadius: 4,
              overflow: "hidden",
              position: "relative",
              boxShadow: "0 16px 48px rgba(0,0,0,0.12)",
              "&:hover img": { transform: "scale(1.04)" },
            }}
          >
            <Image
              src="/images/about/4D-Leadership-approach.png"
              alt="Cửa hàng Cường Hoa — Máy công cụ 2 thì"
              width={700}
              height={460}
              style={{ width: "100%", height: "auto", objectFit: "cover", transition: "transform 0.5s ease", display: "block" }}
            />
          </Box>

          {/* Floating stat badge */}
          <Box
            sx={{
              mt: 2,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 2,
            }}
          >
            {[
              { value: "5.000+", label: "Khách hàng" },
              { value: "98%", label: "Hài lòng" },
              { value: "6+", label: "Năm kinh nghiệm" },
              { value: "11+", label: "Thương hiệu" },
            ].map((s, i) => (
              <Box key={i} sx={{ textAlign: "center", py: 2, px: 1, bgcolor: i % 2 === 0 ? "#fff8f0" : "#fff", borderRadius: 3, border: "1px solid #f5e6d8" }}>
                <Typography variant="h5" fontWeight={800} color="#f25c05">{s.value}</Typography>
                <Typography variant="caption" color="text.secondary">{s.label}</Typography>
              </Box>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
