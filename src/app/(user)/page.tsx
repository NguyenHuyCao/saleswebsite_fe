import AboutDolaTool from "@/components/home/AboutDolaTool";
import CategoryCarousel from "@/components/category/CategoryCarousel";
import CountdownPromotion from "@/components/home/CountdownPromotion";
import CustomerFeedback from "@/components/home/CustomerFeedback";
import FeaturedBrandsSlider from "@/components/home/FeaturedBrandsSlider";
import FlashSaleSlider from "@/components/home/FlashSaleSlider";
import KnowledgeShare from "@/components/home/KnowledgeShare";
import NewProductSection from "@/components/home/NewProductSection";
import NewsSection from "@/components/home/NewsSection";
import OtherToolsSection from "@/components/home/OtherToolsSection";
import PromoBanner from "@/components/home/PromoBanner";
import PromotionBanner from "@/components/home/PromotionBanner";
import VoucherCardList from "@/components/home/VoucherCardList";
import { Box, Container } from "@mui/material";
import Image from "next/image";
import { cookies } from "next/headers";

export type Product = {
  title: string;
  price: number;
  originalPrice: number;
  image: string;
  status: string[];
  sale: boolean;
  inStock: boolean;
  label: string;
  rating?: number;
  favorite: boolean;
};

export type Category = {
  title: string;
  image: string;
};

export type CategoryWithProducts = {
  id: number;
  name: string;
  slug: string;
  products: Product[];
};

export async function getNewProducts(): Promise<Product[]> {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  const res = await fetch(
    "http://localhost:8080/api/v1/products?sort=createdAt,desc",
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );

  const rawData = await res.json();
  const productsFromApi = rawData?.data?.result || [];
  const now = new Date();

  return productsFromApi.map((item: any): Product => {
    const createdAt = new Date(item.createdAt);
    const isNew =
      (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24) <= 30;
    return {
      title: item.name,
      price: item.pricePerUnit,
      originalPrice: item.price,
      image: item.imageAvt
        ? `http://localhost:8080/api/v1/files/${item.imageAvt}`
        : "/images/product/placeholder.jpg",
      status: item.stockQuantity === 0 ? ["Hết hàng"] : isNew ? ["Mới"] : [],
      sale: item.price !== item.pricePerUnit,
      inStock: item.active === true,
      label: item.active ? "Thêm vào giỏ" : "Hết hàng",
      rating: item.rating || 0,
      favorite: item.wishListUser || false,
    };
  });
}

export async function getBrands(): Promise<string[]> {
  const res = await fetch("http://localhost:8080/api/v1/brands", {
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  const raw = await res.json();
  const result = raw?.data?.result || [];

  return result.map((brand: any) =>
    brand.logo
      ? `http://localhost:8080/api/v1/files/${brand.logo}`
      : "/images/product/placeholder.jpg"
  );
}

export async function getCategories(): Promise<Category[]> {
  const res = await fetch("http://localhost:8080/api/v1/categories", {
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  const rawData = await res.json();
  const categoriesFromApi = rawData?.data?.result || [];

  const mappedCategories: Category[] = categoriesFromApi.map((item: any) => ({
    title: item.name,
    image: item.image
      ? `http://localhost:8080/api/v1/files/${item.image}`
      : "/images/product/placeholder.jpg",
  }));

  return mappedCategories;
}

export async function getCategoriesWithProducts(): Promise<
  CategoryWithProducts[]
> {
  const res = await fetch("http://localhost:8080/api/v1/categories", {
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
          title: item.name,
          price: item.pricePerUnit,
          originalPrice: item.price,
          image: item.imageAvt
            ? `http://localhost:8080/api/v1/files/${item.imageAvt}`
            : "/images/product/placeholder.jpg",
          status:
            item.stockQuantity === 0 ? ["Hết hàng"] : isNew ? ["Mới"] : [],
          sale: item.price !== item.pricePerUnit,
          inStock: item.active === true,
          label: item.active ? "Thêm vào giỏ" : "Hết hàng",
          rating: item.rating || 0,
          favorite: item.wishListUser || false,
        };
      }),
  }));
}

export default async function HomePage() {
  const deadline = "2025-06-30T23:59:59";
  const [newProducts, categories, categoriesWithProducts, brands] =
    await Promise.all([
      getNewProducts(),
      getCategories(),
      getCategoriesWithProducts(),
      getBrands(),
    ]);

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Container disableGutters maxWidth={false} sx={{ p: 0 }}>
          <Image
            src="/images/banner/banner-ab.jpg"
            alt="banner"
            layout="responsive"
            width={1920}
            height={600}
            priority
          />
        </Container>
      </Box>
      <Container>
        <VoucherCardList />
        <CountdownPromotion deadline={deadline} />
        <FlashSaleSlider />
        <NewProductSection products={newProducts} />
        <PromotionBanner />
        <CategoryCarousel categories={categories} />
        <AboutDolaTool />
        <OtherToolsSection categories={categoriesWithProducts} />
        <NewsSection />
        <PromoBanner />
        <CustomerFeedback />
        <KnowledgeShare />
        <FeaturedBrandsSlider brands={brands} />
      </Container>
    </>
  );
}
