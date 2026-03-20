"use client";

import {
  Box,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
  Chip,
  Stack,
  Paper,
} from "@mui/material";
import { motion } from "framer-motion";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { useWishlist } from "../queries";

interface WishlistHeroSectionProps {
  onShare?: () => void;
}

const WishlistHeroSection = ({ onShare }: WishlistHeroSectionProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { data: items = [] } = useWishlist();

  const itemCount = items.length;
  const totalValue = items.reduce((sum, item) => sum + (item.price || 0), 0);

  return (
    <Box
      sx={{
        position: "relative",
        py: { xs: 6, md: 8 },
        px: { xs: 2, md: 4 },
        // borderRadius: 4,
        overflow: "hidden",
        backgroundImage: "url('/images/banner/banner-may-cat-co.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "#fff",
        mb: 4,
        height: "80vh",
        // mt: 2,
      }}
    >
      {/* Gradient Overlay - Tối ưu hơn */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 100%)",
          zIndex: 1,
        }}
      />

      {/* Floating Stats Badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          zIndex: 3,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            bgcolor: "#ffb700",
            color: "#000",
            px: 2,
            py: 1,
            borderRadius: 3,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <FavoriteIcon sx={{ fontSize: 18 }} />
          <Typography variant="body2" fontWeight={700}>
            {itemCount} sản phẩm
          </Typography>
        </Paper>
      </motion.div>

      {/* Content */}
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        sx={{
          position: "relative",
          zIndex: 2,
          maxWidth: 800,
          mx: "auto",
          textAlign: "center",
        }}
      >
        {/* Icon Animation */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          <FavoriteIcon sx={{ fontSize: 60, color: "#ffb700", mb: 2 }} />
        </motion.div>

        {/* Title với gradient text */}
        <Typography
          variant={isMobile ? "h4" : "h3"}
          fontWeight={900}
          gutterBottom
          sx={{
            textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
            background: "linear-gradient(135deg, #fff 0%, #ffb700 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 2,
          }}
        >
          Danh sách yêu thích
        </Typography>

        {/* Stats Row */}
        <Stack
          direction="row"
          spacing={4}
          justifyContent="center"
          sx={{ mb: 3 }}
        >
          <Box>
            <Typography variant="h3" fontWeight={800} color="#ffb700">
              {itemCount}
            </Typography>
            <Typography variant="body2" sx={{ color: "#f5f5f5" }}>
              Sản phẩm
            </Typography>
          </Box>
          <Box>
            <Typography variant="h3" fontWeight={800} color="#ffb700">
              {totalValue.toLocaleString()}₫
            </Typography>
            <Typography variant="body2" sx={{ color: "#f5f5f5" }}>
              Tổng giá trị
            </Typography>
          </Box>
        </Stack>

        {/* Description */}
        <Typography
          variant="body1"
          sx={{
            mb: 4,
            maxWidth: 600,
            mx: "auto",
            color: "#f5f5f5",
            fontSize: isMobile ? "1rem" : "1.1rem",
            lineHeight: 1.6,
          }}
        >
          Lưu lại những sản phẩm bạn yêu thích, theo dõi giá và nhận thông báo
          khi có khuyến mãi – Dễ dàng quay lại và đặt hàng bất cứ lúc nào.
        </Typography>

        {/* Feature Chips */}
        <Stack
          direction="row"
          spacing={1}
          justifyContent="center"
          sx={{ mb: 4, flexWrap: "wrap", gap: 1 }}
        >
          <Chip
            icon={<TrendingUpIcon />}
            label="Theo dõi giá"
            sx={{
              bgcolor: "rgba(255,255,255,0.15)",
              color: "#fff",
              backdropFilter: "blur(4px)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.25)" },
            }}
          />
          <Chip
            icon={<LocalOfferIcon />}
            label="Thông báo giảm giá"
            sx={{
              bgcolor: "rgba(255,255,255,0.15)",
              color: "#fff",
              backdropFilter: "blur(4px)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.25)" },
            }}
          />
        </Stack>

        {/* Action Buttons */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="center"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="contained"
              size="large"
              href="/products"
              startIcon={<ShoppingBagIcon />}
              sx={{
                bgcolor: "#ffb700",
                color: "#000",
                fontWeight: 700,
                px: 4,
                py: 1.5,
                textTransform: "none",
                "&:hover": {
                  bgcolor: "#ffa000",
                  boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
                },
              }}
            >
              Khám phá sản phẩm
            </Button>
          </motion.div>

          {itemCount > 0 && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outlined"
                size="large"
                onClick={onShare}
                startIcon={<ShareIcon />}
                sx={{
                  borderColor: "#fff",
                  color: "#fff",
                  borderWidth: 2,
                  px: 4,
                  py: 1.5,
                  textTransform: "none",
                  "&:hover": {
                    borderColor: "#ffb700",
                    bgcolor: "rgba(255,255,255,0.1)",
                  },
                }}
              >
                Chia sẻ danh sách
              </Button>
            </motion.div>
          )}
        </Stack>

        {/* Quick Stats Footer */}
        {itemCount > 0 && (
          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            sx={{ mt: 4 }}
          >
            <Typography variant="caption" sx={{ color: "#f5f5f5" }}>
              ✨ {itemCount} sản phẩm đang theo dõi
            </Typography>
            <Typography variant="caption" sx={{ color: "#f5f5f5" }}>
              💰 {totalValue.toLocaleString()}₫ tổng giá trị
            </Typography>
          </Stack>
        )}
      </Box>
    </Box>
  );
};

export default WishlistHeroSection;
