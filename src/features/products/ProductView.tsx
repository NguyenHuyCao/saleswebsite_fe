// product/ProductView.tsx
import { Container } from "@mui/material";
import PageViewTracker from "@/components/common/traffic/PageViewTracker";
import { getBrands, getCategoriesWithProducts } from "./api";
import CategoryBanner from "./components/CategoryBanner";
import ProductCategoryIntroSection from "./components/ProductCategoryIntroSection";
import ProductCategorySection from "./components/ProductCategorySection";
import ProductListLayout from "./components/ProductListLayout";

export default async function ProductView() {
  const categories = await getCategoriesWithProducts();
  const brands = await getBrands();

  const categoryList = categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    image: cat.image,
    products: cat.products,
    count: cat.products.length,
  }));

  return (
    <>
      <PageViewTracker />
      <Container>
        <CategoryBanner />
        <ProductCategoryIntroSection categories={categoryList} />
        <div id="category-section">
          <ProductCategorySection categories={categoryList} />
        </div>
        <ProductListLayout categories={categories} brands={brands} />
      </Container>
    </>
  );
}
