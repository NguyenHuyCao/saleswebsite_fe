import CategoryBanner from "@/components/product/CategoryBanner";
import ProductListLayout from "@/components/product/ProductListLayout";
import PageViewTracker from "@/components/common/traffic/PageViewTracker";
import { Container } from "@mui/material";
import ProductCategoryIntroSection from "@/components/product/ProductCategoryIntroSection";
import ProductCategorySection from "@/components/product/ProductCategorySection";
import { getCategoriesWithProducts, getBrands } from "@/lib/api/product-page";

const ProductsPage = async () => {
  const categories = await getCategoriesWithProducts();
  const brands = await getBrands();

  // Convert to correct Category[] shape (with `count`)
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
};

export default ProductsPage;
