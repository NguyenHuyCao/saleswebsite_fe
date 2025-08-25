"use client";

import {
  Box,
  Divider,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { motion } from "framer-motion";
import ImageGallery from "./ImageGallery";
import ProductDetails from "./ProductDetails";
import CommitmentCard from "./CommitmentCard";
import SupportBox from "./SupportBox";
import PromotionBox from "./PromotionBox";
import ProductTabs from "./ProductTabs";
import RelatedProductsSlick from "./RelatedProducts";
import ProductReviewList from "@/views/review/ProductReviewList";

interface Props {
  product: Product;
  category: Category | null;
}

export default function ProductDetailPage({ product, category }: Props) {
  const theme = useTheme();
  const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));

  if (!product) {
    return (
      <Box py={6} textAlign="center">
        <Typography variant="h6" color="error">
          Không tìm thấy sản phẩm.
        </Typography>
      </Box>
    );
  }

  const imageProduct = {
    imageAvt: product.imageAvt,
    imageDetail1: product.imageDetail1 || "",
    imageDetail2: product.imageDetail2 || "",
    imageDetail3: product.imageDetail3 || "",
    name: product.name,
  };

  return (
    <Box sx={{ maxWidth: 1400, mx: "auto", py: 4, px: { xs: 1, sm: 2 } }}>
      <Grid container spacing={4}>
        {/* Trái: Hình + info */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 5 }}>
              <ImageGallery product={imageProduct} />
            </Grid>
            <Grid size={{ xs: 12, md: 7 }}>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <ProductDetails product={product} category={category} />
              </motion.div>
            </Grid>
          </Grid>
        </Grid>

        {/* Phải: Cam kết / Hỗ trợ / KM */}
        <Grid size={{ xs: 12, md: 4 }}>
          <CommitmentCard />
          <Box mt={2}>
            <SupportBox />
          </Box>
          <Box mt={2}>
            <PromotionBox />
          </Box>
        </Grid>
      </Grid>

      <Box mt={6}>
        <Divider sx={{ mb: 3 }} />
        <ProductTabs product={product} category={category} />
      </Box>

      <Box mt={6}>
        <Divider sx={{ mb: 3 }} />
        <ProductReviewList productId={product.id} />
      </Box>

      <Box mt={6}>
        <Divider sx={{ mb: 3 }} />
        <RelatedProductsSlick category={category} />
      </Box>
    </Box>
  );
}
