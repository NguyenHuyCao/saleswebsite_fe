import CategoryBanner from "@/components/product/CategoryBanner";
import ProductCategoryPage from "@/components/product/ProductCategoryPage";
import ProductListLayout from "@/components/product/ProductListLayout";
import { Container } from "@mui/material";

export async function getCategories(): Promise<any[]> {
  const res = await fetch("http://localhost:8080/api/v1/categories", {
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  const raw = await res.json();
  const categories = raw?.data?.result || [];

  return categories.map((cat: any) => ({
    name: cat.name,
    count: cat.products?.length || 0,
    image: cat.image
      ? `http://localhost:8080/api/v1/files/${cat.image}`
      : "/images/product/placeholder.jpg",
    slug: cat.slug,
  }));
}

export async function getBrands(): Promise<Brand[]> {
  const res = await fetch("http://localhost:8080/api/v1/brands", {
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  const raw = await res.json();
  return raw.data?.result || [];
}

const ProductsPage = async () => {
  const categories = await getCategories();
  const brands = await getBrands();

  return (
    <Container>
      <CategoryBanner />
      <ProductCategoryPage categories={categories} />
      <ProductListLayout categories={categories} brands={brands} />
    </Container>
  );
};

export default ProductsPage;
