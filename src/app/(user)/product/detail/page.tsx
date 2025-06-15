import ProductDetailPage from "@/components/product/detail/ProductDetailPage";
import { Container } from "@mui/material";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import PageViewTracker from "@/components/common/traffic/PageViewTracker";
import ScrollPositionManager from "@/components/common/ScrollResetOnLoad";

export default async function DetailProduct({ searchParams }: any) {
  const slug = searchParams?.name;
  if (!slug) return notFound();

  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const productRes = await fetch(
    `${process.env.BACKEND_URL}/api/v1/products/${slug}`,
    { headers, cache: "no-store" }
  );
  const productData = await productRes.json();
  const product = productData?.data;
  if (!product) return notFound();

  const categoryRes = await fetch(
    `${process.env.BACKEND_URL}/api/v1/categories/${product.categoryId}`,
    { headers, cache: "no-store" }
  );
  const categoryData = await categoryRes.json();
  const category = categoryData?.data || null;

  return (
    <Container>
      <PageViewTracker />
      <ProductDetailPage product={product} category={category} />
      <ScrollPositionManager />
    </Container>
  );
}
