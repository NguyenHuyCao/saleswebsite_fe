// product/ProductView.tsx
import { Box, Container, Typography } from "@mui/material";
import PageViewTracker from "@/components/common/traffic/PageViewTracker";
import { getBrands, getCategoriesWithProducts } from "./api";
import CategoryBanner from "./components/CategoryBanner";
import ProductCategoryIntroSection from "./components/ProductCategoryIntroSection";
import ProductCategorySection from "./components/ProductCategorySection";
import ProductListLayout from "./components/ProductListLayout";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cuonghoa.com";

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

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Danh mục máy công cụ 2 thì — Cường Hoa",
    description: "Các danh mục sản phẩm máy công cụ 2 thì chính hãng tại Cường Hoa",
    numberOfItems: categoryList.length,
    itemListElement: categoryList.map((cat, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: cat.name,
      url: `${SITE_URL}/product?category=${cat.slug}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <PageViewTracker />
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        {/* 1. Compact promotional banner — uses real brand slugs from API */}
        <CategoryBanner brands={brands.filter((b) => (b as any).productCount > 0).slice(0, 2)} />

        {/* 2. Category quick-filter carousel */}
        <ProductCategorySection categories={categoryList} />

        {/* 3. SEO heading + product list — visible without scrolling */}
        <Box id="products" sx={{ scrollMarginTop: 80 }}>
          <Typography
            component="h1"
            fontWeight={800}
            sx={{
              fontSize: { xs: "1.3rem", md: "1.6rem" },
              color: "#222",
              mb: 0.5,
              mt: 1,
            }}
          >
            Máy Công Cụ 2 Thì Chính Hãng
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Máy cắt cỏ, máy cưa xích, máy phun thuốc, máy thổi lá — lọc theo danh mục, thương hiệu hoặc khoảng giá
          </Typography>
        </Box>
        <ProductListLayout categories={categories} brands={brands} />

        {/* 4. Info section — after products so users see products first */}
        <ProductCategoryIntroSection categories={categoryList} />
      </Container>
    </>
  );
}
