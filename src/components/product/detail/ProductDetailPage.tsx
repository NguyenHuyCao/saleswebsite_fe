"use client";

import { Grid, Box } from "@mui/material";
import { motion } from "framer-motion";
import { ImageGallery } from "./ImageGallery";
import { ProductDetails } from "./ProductDetails";
import { CommitmentCard } from "./CommitmentCard";
import { SupportBox } from "./SupportBox";
import { PromotionBox } from "./PromotionBox";
import { ProductTabs } from "./ProductTabs";
import RelatedProductsSlick from "./RelatedProducts";
import { ProductReviewList } from "@/components/review/ProductReviewList";

export type Product = {
  id: number;
  name: string;
  imageAvt: string;
  description: string;
  slug: string;
  image: string;
  price: number;
  pricePerUnit: number;
  originalPrice: number;
  sale: boolean;
  inStock: boolean;
  label: string;
  stockQuantity: number;
  totalStock: number;
  power: string;
  fuelType: string;
  engineType: string;
  weight: number;
  dimensions: string;
  tankCapacity: number;
  origin: string;
  warrantyMonths: number;
  createdAt: string;
  createdBy?: string;
  updatedAt?: string | null;
  updatedBy?: string | null;
  rating?: number;
  status: string[];
  wishListUser: boolean;
};

interface Category {
  id: number;
  name: string;
  slug: string;
  products: Product[];
}

interface ProductDetailPageProps {
  product: Product;
  category: Category | null;
}

export default function ProductDetailPage({
  product,
  category,
}: ProductDetailPageProps) {
  return (
    <Box sx={{ maxWidth: "1400px", mx: "auto", py: 4 }}>
      <Grid container spacing={4}>
        {/* Left side: Gallery + Info */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 5 }}>
              <ImageGallery product={product} />
            </Grid>
            <Grid size={{ xs: 12, md: 7 }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <ProductDetails product={product} category={category} />
              </motion.div>
            </Grid>
          </Grid>
        </Grid>

        {/* Right side: Cam kết + hỗ trợ + khuyến mãi */}
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
        <ProductTabs product={product} category={category} />
      </Box>

      <Box mt={6}>
        <ProductReviewList productId={product.id} />
      </Box>

      <Box mt={6}>
        <RelatedProductsSlick category={category} />
      </Box>
    </Box>
  );
}
