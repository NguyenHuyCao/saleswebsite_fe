// app/product/detail/page.tsx
import ProductDetailView from "@/features/product-detail/ProductDetailView";

export default function Page({ searchParams }: any) {
  return <ProductDetailView searchParams={searchParams} />;
}
