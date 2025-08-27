import { Container } from "@mui/material";
import { notFound } from "next/navigation";
import PageViewTracker from "@/components/common/traffic/PageViewTracker";
import ScrollPositionManager from "@/components/common/ScrollResetOnLoad";
import ProductDetailPage from "./components/ProductDetailPage";
import { getProductDetailBySlug } from "./api";

export default async function ProductDetailView({ searchParams }: any) {
  const slug = searchParams?.name;
  if (!slug) return notFound();

  const { product, category } = await getProductDetailBySlug(slug);
  if (!product) return notFound();

  return (
    <Container>
      <PageViewTracker />
      <ProductDetailPage product={product} category={category} />
      <ScrollPositionManager />
    </Container>
  );
}
