"use client";

import { Container, Skeleton, Box } from "@mui/material";
import BannerFeatureSection from "./components/BannerFeatureSection";
import WebsiteTrafficTracker from "@/components/common/traffic/WebsiteTrafficTracker";
import VoucherCardList from "./components/VoucherCardList";
import PromotionBanner from "./components/PromotionBanner";
import AboutDolaTool from "./components/AboutDolaTool";
import OtherToolsSection from "./components/OtherToolsSection";
import NewsSection from "./components/NewsSection";
import PromoBanner from "./components/PromoBanner";
import CustomerFeedback from "./components/CustomerFeedback";
import KnowledgeShare from "./components/KnowledgeShare";
import FeaturedBrandsSlider from "./components/FeaturedBrandsSlider";
import CategoryView from "@/features/user/category/CategoryView";
import NewProductSection from "./components/NewProductSection";

import {
  useNewProducts,
  useBrands,
  useCategoriesWithProducts,
  useVouchers,
} from "./queries";

import FlashSaleShowcase from "../promotion/components/FlashSaleShowcase";
import type { Promotion } from "../promotion/types"; // đúng path type
import { useEffect, useState } from "react";
import { getFlashPromotions } from "./server";

export default function HomeView() {
  const { data: products, isLoading: loadingNew } = useNewProducts();
  const { data: brandAs, isLoading: loadingBrands } = useBrands();
  const { data: categoriesWithProducts, isLoading: loadingCatProds } =
    useCategoriesWithProducts();
  const { data: vouchers } = useVouchers();

  // Để FlashSaleShowcase hiển thị skeleton đúng: dùng null = đang tải
  const [flashPromotions, setFlashPromotions] = useState<Promotion[] | null>(
    null
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getFlashPromotions(); // interceptor tự gắn Bearer từ localStorage
        if (!cancelled) setFlashPromotions(data);
      } catch {
        if (!cancelled) setFlashPromotions([]); // fallback rỗng
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  console.log("vouchers", vouchers);

  return (
    <>
      <BannerFeatureSection />
      <Container>
        <WebsiteTrafficTracker />
        {vouchers?.length ? <VoucherCardList vouchers={vouchers} /> : null}

        {/* Flash Sale (client fetch) */}
        <FlashSaleShowcase promotions={flashPromotions} />

        {loadingNew ? (
          <Skeleton variant="rounded" height={240} sx={{ my: 2 }} />
        ) : (
          <NewProductSection products={products || []} />
        )}

        <PromotionBanner />
        <CategoryView />
        <AboutDolaTool />

        {loadingCatProds ? (
          <Skeleton variant="rounded" height={320} sx={{ my: 2 }} />
        ) : categoriesWithProducts?.length ? (
          <OtherToolsSection categories={categoriesWithProducts} />
        ) : null}

        <NewsSection />
        <PromoBanner />
        <CustomerFeedback />
        <KnowledgeShare />

        {loadingBrands ? (
          <Box my={2}>
            <Skeleton variant="rounded" height={120} />
          </Box>
        ) : brandAs?.length ? (
          <FeaturedBrandsSlider brands={brandAs} />
        ) : null}
      </Container>
    </>
  );
}
