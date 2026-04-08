// app/product/detail/page.tsx
// Next.js 15: searchParams là Promise — phải await
import ProductDetailView from "@/features/user/product-detail/ProductDetailView";

interface Props {
  searchParams: Promise<{ name?: string; slug?: string }>;
}

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;
  // Hỗ trợ cả ?name= (chuẩn) và ?slug= (header search cũ)
  const slug = params.name || params.slug;
  return <ProductDetailView slug={slug} />;
}
