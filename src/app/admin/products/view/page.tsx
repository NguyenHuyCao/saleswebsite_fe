import { Suspense } from "react";
import ProductDetailPage from "@/views/admin/product/detail/ProductDetailPage";

export default function ViewProductPage() {
  return (
    <Suspense fallback={<p>Đang tải dữ liệu...</p>}>
      <ProductDetailPage />
    </Suspense>
  );
}
