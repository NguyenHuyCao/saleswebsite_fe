"use client";
import { Box, Typography, Breadcrumbs, Button } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import HomeIcon from "@mui/icons-material/Home";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";

export default function CartHeroSection({ itemCount }: { itemCount?: number }) {
  return (
    <Box mb={3}>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
        sx={{ mb: 1.5 }}
      >
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            color: "inherit",
            textDecoration: "none",
          }}
        >
          <HomeIcon sx={{ fontSize: 16, mr: 0.5 }} />
          <Typography fontSize={13} component="span">
            Trang chủ
          </Typography>
        </Link>
        <Typography fontSize={13} color="text.primary">
          Giỏ hàng
        </Typography>
      </Breadcrumbs>

      <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1.5}>
        <Box display="flex" alignItems="center" gap={1.5}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              bgcolor: "rgba(242, 92, 5, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <ShoppingCartIcon sx={{ fontSize: 24, color: "#f25c05" }} />
          </Box>
          <Box>
            <Typography variant="h5" fontWeight={700} lineHeight={1.2}>
              Giỏ hàng của bạn
            </Typography>
            {itemCount !== undefined && (
              <Typography variant="body2" color="text.secondary">
                {itemCount} sản phẩm
              </Typography>
            )}
          </Box>
        </Box>

        <Link href="/product" style={{ textDecoration: "none" }}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<ArrowBackIcon sx={{ fontSize: 16 }} />}
            sx={{
              textTransform: "none",
              fontSize: 13,
              borderColor: "divider",
              color: "text.secondary",
              "&:hover": { borderColor: "#f25c05", color: "#f25c05" },
            }}
          >
            Tiếp tục mua sắm
          </Button>
        </Link>
      </Box>
    </Box>
  );
}
