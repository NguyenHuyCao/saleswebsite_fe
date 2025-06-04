import CategoryBanner from "@/components/product/CategoryBanner";
import ProductCategoryPage from "@/components/product/ProductCategoryPage";
import ProductListLayout from "@/components/product/ProductListLayout";
import { Container } from "@mui/material";
import { cookies } from "next/headers";

export type Product = {
  id: number;
  title: string;
  slug: string;
  image: string;
  price: number;
  pricePerUnit: number;
  originalPrice: number;
  sale: boolean;
  inStock: boolean;
  label: string;
  stockQuantity: number;
  totalStock: number;
  power: string;
  fuelType: string;
  engineType: string;
  weight: number;
  dimensions: string;
  tankCapacity: number;
  origin: string;
  warrantyMonths: number;
  createdAt: string;
  createdBy?: string;
  updatedAt?: string | null;
  updatedBy?: string | null;
  rating?: number;
  status: string[];
  favorite: boolean;
};
export type CategoryWithProducts = {
  id: number;
  name: string;
  slug: string;
  products: Product[];
};

export async function getCategoriesWithProducts(): Promise<
  CategoryWithProducts[]
> {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  const res = await fetch("http://localhost:8080/api/v1/categories", {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });
  const raw = await res.json();
  const data = raw?.data?.result || [];
  const now = new Date();

  return data.map((category: any) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    products: (category.products || [])
      .slice(0, 4)
      .map((item: any): Product => {
        const createdAt = new Date(item.createdAt);
        const isNew =
          (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24) <= 30;
        return {
          id: item.id,
          title: item.name,
          slug: item.slug,
          image: item.imageAvt
            ? `http://localhost:8080/api/v1/files/${item.imageAvt}`
            : "/images/product/placeholder.jpg",
          price: item.pricePerUnit,
          pricePerUnit: item.pricePerUnit,
          originalPrice: item.price,
          sale: item.price !== item.pricePerUnit,
          inStock: item.active === true,
          label: item.active ? "Thêm vào giỏ" : "Hết hàng",
          stockQuantity: item.stockQuantity,
          totalStock: item.totalStock,
          power: item.power,
          fuelType: item.fuelType,
          engineType: item.engineType,
          weight: item.weight,
          dimensions: item.dimensions,
          tankCapacity: item.tankCapacity,
          origin: item.origin,
          warrantyMonths: item.warrantyMonths,
          createdAt: item.createdAt,
          createdBy: item.createdBy,
          updatedAt: item.updatedAt,
          updatedBy: item.updatedBy,
          rating: item.rating || 0,
          status:
            item.stockQuantity === 0 ? ["Hết hàng"] : isNew ? ["Mới"] : [],
          favorite: item.wishListUser || false,
        };
      }),
  }));
}

export async function getBrands(): Promise<Brand[]> {
  const res = await fetch("http://localhost:8080/api/v1/brands", {
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  const raw = await res.json();
  return raw.data?.result || [];
}

const ProductsPage = async () => {
  const categories = await getCategoriesWithProducts();
  const brands = await getBrands();

  return (
    <Container>
      <CategoryBanner />
      <ProductCategoryPage categories={categories} />
      <ProductListLayout categories={categories} brands={brands} />
    </Container>
  );
};

export default ProductsPage;
