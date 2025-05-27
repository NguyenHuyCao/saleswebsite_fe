"use client";

import { useSearchParams } from "next/navigation";
import AddProductPage from "./create/AddProductPage";
import UpdateProduct from "./update/UpdateProduct";
import ProductDetailPage from "./detail/ProductDetailPage";
import ProductTablePage from "./table/ProductTablePage";

const MultiPageProduct = () => {
  const searchParams = useSearchParams();

  const page = searchParams.get("page");
  if (page === "create") {
    return <AddProductPage />;
  }
  if (page === "edit") {
    return <UpdateProduct />;
  }
  if (page === "view") {
    return <ProductDetailPage />;
  }
  return <ProductTablePage />;
};

export default MultiPageProduct;
