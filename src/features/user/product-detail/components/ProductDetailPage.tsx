"use client";

import {
  Box,
  Divider,
  Typography,
  useMediaQuery,
  useTheme,
  Breadcrumbs,
  Link,
  Container,
  Alert,
  Chip,
  Grid,
  Paper,
  Stack,
} from "@mui/material";
import { motion } from "framer-motion";
import ImageGallery from "./ImageGallery";
import ProductDetails from "./ProductDetails";
import CommitmentCard from "./CommitmentCard";
import SupportBox from "./SupportBox";
import PromotionBox from "./PromotionBox";
import ProductTabs from "./ProductTabs";
import RelatedProductsSlick from "./RelatedProducts";
import ProductReviewList from "@/features/user/product-detail/components/review/ProductReviewList";
import ProductVideo from "./ProductVideo";
import ProductShare from "./ProductShare";
import ProductCompare from "./ProductCompare";
import HomeIcon from "@mui/icons-material/Home";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

interface Props {
  product: Product;
  category: Category | null;
}

export default function ProductDetailPage({ product, category }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ borderRadius: 3 }}>
          Không tìm thấy sản phẩm.
        </Alert>
      </Container>
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
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Breadcrumb */}
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        sx={{ mb: 3, fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
      >
        <Link
          href="/"
          color="inherit"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <HomeIcon sx={{ mr: 0.5, fontSize: { xs: 14, sm: 18 } }} />
          Trang chủ
        </Link>
        <Link href="/product" color="inherit">
          Sản phẩm
        </Link>
        {category && (
          <Link href={`/product?category=${category.slug}`} color="inherit">
            {category.name}
          </Link>
        )}
        <Typography
          color="text.primary"
          sx={{
            fontWeight: 500,
            maxWidth: { xs: 150, sm: 200, md: 300 },
            fontSize: { xs: "0.75rem", sm: "0.875rem" },
          }}
          noWrap
        >
          {product.name}
        </Typography>
      </Breadcrumbs>

      <Grid container spacing={4}>
        {/* Left Column - Main Content */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper elevation={1} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3 }}>
            <Grid container spacing={4}>
              {/* Image Gallery */}
              <Grid size={{ xs: 12, sm: 5 }}>
                <ImageGallery product={imageProduct} />
              </Grid>

              {/* Product Info */}
              <Grid size={{ xs: 12, sm: 7 }}>
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <ProductDetails product={product} category={category} />
                </motion.div>
              </Grid>
            </Grid>
          </Paper>

          {/* Video Section */}
          {product.videoUrl && (
            <Box mt={4}>
              <ProductVideo url={product.videoUrl} />
            </Box>
          )}
        </Grid>

        {/* Right Column - Sidebar */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={3}>
            <CommitmentCard />
            <SupportBox />
            <PromotionBox />
            <ProductShare product={product} />
            <ProductCompare product={product} />
          </Stack>
        </Grid>
      </Grid>

      {/* Product Tabs */}
      <Box mt={6}>
        {/* <Divider sx={{ mb: 4 }} /> */}
        <ProductTabs product={product} category={category} />
      </Box>

      {/* Reviews */}
      <Box mt={6}>
        {/* <Divider sx={{ mb: 4 }} /> */}
        <ProductReviewList productId={product.id} />
      </Box>

      {/* Related Products */}
      <Box mt={6}>
        <RelatedProductsSlick category={category} />
      </Box>
    </Container>
  );
}
