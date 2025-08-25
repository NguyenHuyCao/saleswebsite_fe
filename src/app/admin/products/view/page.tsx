import { Suspense } from "react";
import ProductDetail from "@/features/admin/products/components/ProductDetail";

export default function Page() {
  return (
    <Suspense fallback={<p>Đang tải dữ liệu...</p>}>
      <ProductDetail />
    </Suspense>
  );
}
