import CategoryBanner from "@/components/product/CategoryBanner";
import ProductCategoryPage from "@/components/product/ProductCategoryPage";
import ProductListLayout from "@/components/product/ProductListLayout";
import { Container } from "@mui/material";

const ProductsPage = () => {
  return (
    <Container>
      <CategoryBanner />
      <ProductCategoryPage />
      <ProductListLayout />
    </Container>
  );
};

export default ProductsPage;
