import { Container } from "@mui/material";
import { notFound } from "next/navigation";
import PageViewTracker from "@/components/common/traffic/PageViewTracker";
import ScrollPositionManager from "@/components/common/ScrollResetOnLoad";
import ProductDetailPage from "./components/ProductDetailPage";
import { getProductDetailBySlug } from "./api";

export default async function ProductDetailView({ slug }: { slug?: string }) {
  if (!slug || slug === "null" || slug === "undefined") return notFound();

  const { product, category } = await getProductDetailBySlug(slug);
  if (!product) return notFound();

  return (
    <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
      <PageViewTracker />
      <ProductDetailPage product={product} category={category} />
      <ScrollPositionManager />
    </Container>
  );
}
