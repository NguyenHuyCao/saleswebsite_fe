import { Container } from "@mui/material";
import { notFound } from "next/navigation";
import PageViewTracker from "@/components/common/traffic/PageViewTracker";
import ScrollPositionManager from "@/components/common/ScrollResetOnLoad";
import ProductDetailPage from "./components/ProductDetailPage";
import { getProductDetailBySlug } from "./api";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cuonghoa.vn";

export default async function ProductDetailView({ slug }: { slug?: string }) {
  if (!slug || slug === "null" || slug === "undefined") return notFound();

  const { product, category } = await getProductDetailBySlug(slug);
  if (!product) return notFound();

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || product.name,
    image: [
      product.imageAvt,
      product.imageDetail1,
      product.imageDetail2,
      product.imageDetail3,
    ].filter(Boolean),
    brand: {
      "@type": "Brand",
      name: product.origin || "Cường Hoa",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "VND",
      price: product.price > 0 ? product.price : undefined,
      availability:
        product.inStock
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url: `${SITE_URL}/product/detail?name=${slug}`,
      seller: { "@type": "Organization", name: "Cường Hoa" },
    },
    ...(product.warrantyMonths && product.warrantyMonths > 0
      ? { warranty: `${product.warrantyMonths} tháng` }
      : {}),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Trang chủ", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Sản phẩm", item: `${SITE_URL}/product` },
      ...(category
        ? [{ "@type": "ListItem", position: 3, name: category.name, item: `${SITE_URL}/product?category=${category.slug}` }]
        : []),
      {
        "@type": "ListItem",
        position: category ? 4 : 3,
        name: product.name,
        item: `${SITE_URL}/product/detail?name=${slug}`,
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        <PageViewTracker />
        <ProductDetailPage product={product} category={category} />
        <ScrollPositionManager />
      </Container>
    </>
  );
}
