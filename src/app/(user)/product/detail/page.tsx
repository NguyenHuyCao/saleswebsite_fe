// /product/detail/page.tsx
import ProductDetailPage from "@/components/product/detail/ProductDetailPage";
import { Container } from "@mui/material";
import { notFound } from "next/navigation";

export default async function DetailProduct({ searchParams }: any) {
  const slug = searchParams?.name;
  if (!slug) return notFound();

  const productRes = await fetch(
    `http://localhost:8080/api/v1/products/${slug}`
  );
  const productData = await productRes.json();
  const product = productData?.data;
  if (!product) return notFound();

  const categoryRes = await fetch(
    `http://localhost:8080/api/v1/categories/${product.categoryId}`
  );
  const categoryData = await categoryRes.json();
  const category = categoryData?.data || null;

  return (
    <Container>
      <ProductDetailPage product={product} category={category} />
    </Container>
  );
}
