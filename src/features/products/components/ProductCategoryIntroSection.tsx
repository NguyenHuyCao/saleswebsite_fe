"use client";

import {
  Box,
  Typography,
  Stack,
  Button,
  useTheme,
  useMediaQuery,
  Divider,
  Fade,
} from "@mui/material";
import CategoryIcon from "@mui/icons-material/Category";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import FlashOnIcon from "@mui/icons-material/FlashOn";

export default function ProductCategoryIntroSection({
  categories,
}: {
  categories: {
    id: number;
    name: string;
    slug?: string;
    image?: string;
    products?: { id: number }[];
    count: number;
  }[];
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const totalCategories = categories.length;
  const totalProducts = categories.reduce(
    (sum, c) => sum + (c.products?.length || 0),
    0
  );

  return (
    <Fade in timeout={600}>
      <Box
        sx={{
          px: { xs: 2, sm: 6 },
          py: 6,
          bgcolor: "#fffbe6",
          borderBottom: "2px solid #ffecb3",
          textAlign: "center",
        }}
      >
        <Typography
          variant={isMobile ? "h5" : "h4"}
          fontWeight="bold"
          sx={{ mb: 1.5, textTransform: "uppercase", color: "#d35400" }}
        >
          🔥 Khám phá danh mục nổi bật
        </Typography>

        <Typography
          variant="body1"
          sx={{ mb: 3, color: "#444", maxWidth: 600, mx: "auto" }}
        >
          Hơn <strong style={{ color: "#e67e22" }}>{totalCategories}</strong>{" "}
          danh mục –{" "}
          <strong style={{ color: "#f39c12" }}>{totalProducts}</strong> lựa chọn
          đang chờ bạn!
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="center"
          spacing={2}
          divider={<Divider orientation="vertical" flexItem />}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <CategoryIcon color="warning" />
            <Typography fontWeight={500}>Đa dạng chủng loại</Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <LocalOfferIcon color="error" />
            <Typography fontWeight={500}>Ưu đãi theo danh mục</Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <FlashOnIcon sx={{ color: "#ff9800" }} />
            <Typography fontWeight={500}>Cập nhật liên tục</Typography>
          </Stack>
        </Stack>

        <Button
          variant="contained"
          color="warning"
          sx={{
            mt: 4,
            px: 5,
            py: 1.3,
            fontWeight: 600,
            textTransform: "none",
            fontSize: 16,
          }}
          href="#category-section"
        >
          Xem danh mục ngay
        </Button>
      </Box>
    </Fade>
  );
}
