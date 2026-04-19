"use client";

import { Box, Typography, Chip, Grid, Paper, Stack } from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";

const brands = [
  {
    name: "Honda",
    origin: "Nhật Bản",
    category: "Máy cắt cỏ, máy phát điện",
    color: "#e40012",
    initial: "H",
  },
  {
    name: "Husqvarna",
    origin: "Thuỵ Điển",
    category: "Máy cưa, máy cắt cỏ",
    color: "#0068b4",
    initial: "HQ",
  },
  {
    name: "STIHL",
    origin: "Đức",
    category: "Máy cưa, máy thổi lá",
    color: "#f26f22",
    initial: "ST",
  },
  {
    name: "Maruyama",
    origin: "Nhật Bản",
    category: "Máy phun thuốc, máy cắt cỏ",
    color: "#1a6b3a",
    initial: "M",
  },
  {
    name: "Kawasaki",
    origin: "Nhật Bản",
    category: "Động cơ, máy công cụ",
    color: "#009b4e",
    initial: "K",
  },
  {
    name: "Robin",
    origin: "Nhật Bản",
    category: "Máy phát điện, động cơ",
    color: "#c00020",
    initial: "R",
  },
];

export default function BrandPartnersSection() {
  return (
    <Box py={{ xs: 6, md: 8 }}>
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Chip
          label="THƯƠNG HIỆU PHÂN PHỐI"
          sx={{ bgcolor: "#f25c05", color: "#fff", fontWeight: 700, mb: 2 }}
        />
        <Typography
          variant="h3"
          fontWeight={800}
          sx={{ fontSize: { xs: "1.8rem", md: "2.4rem" }, mb: 2 }}
        >
          Thương hiệu{" "}
          <Box component="span" sx={{ color: "#ffb700" }}>
            chính hãng
          </Box>
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: "auto" }}>
          Cường Hoa là đại lý phân phối chính thức của các thương hiệu máy công cụ hàng đầu thế giới — cam kết hàng thật, tem chính hãng.
        </Typography>
      </Box>

      <Grid container spacing={2.5}>
        {brands.map((brand, i) => (
          <Grid key={i} size={{ xs: 6, sm: 4, md: 2 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 3,
                border: "1px solid #f0f0f0",
                textAlign: "center",
                height: "100%",
                transition: "all 0.25s ease",
                cursor: "default",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: `0 10px 28px ${brand.color}18`,
                  borderColor: brand.color + "40",
                },
              }}
            >
              {/* Brand initial badge */}
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  bgcolor: brand.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 1.5,
                }}
              >
                <Typography variant="body2" fontWeight={800} sx={{ color: "#fff", fontSize: "0.85rem" }}>
                  {brand.initial}
                </Typography>
              </Box>

              <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                {brand.name}
              </Typography>

              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.75 }}>
                {brand.origin}
              </Typography>

              <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.68rem", lineHeight: 1.4, display: "block" }}>
                {brand.category}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Trust note */}
      <Box
        sx={{
          mt: 4,
          p: 2.5,
          bgcolor: "#fff8f0",
          borderRadius: 3,
          border: "1px solid #f5e6d8",
          textAlign: "center",
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
          <VerifiedIcon sx={{ color: "#f25c05", fontSize: 20 }} />
          <Typography variant="body2" fontWeight={600} color="#f25c05">
            Tất cả sản phẩm đều là hàng chính hãng — có tem bảo hành điện tử, hoá đơn VAT đầy đủ theo yêu cầu.
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
}
