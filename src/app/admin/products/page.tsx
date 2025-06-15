"use client";

import dynamic from "next/dynamic";

const MultiPageProduct = dynamic(
  () => import("@/views/admin/product/MultiPageProduct"),
  { ssr: false }
);

const ProductPage = () => {
  return <MultiPageProduct />;
};

export default ProductPage;
