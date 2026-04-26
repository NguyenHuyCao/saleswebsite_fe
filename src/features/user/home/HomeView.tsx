"use client";

import { Container, Skeleton, Box } from "@mui/material";
import type { Promotion } from "../promotion/types";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import BannerFeatureSection from "./components/BannerFeatureSection";
import NewProductSection from "./components/NewProductSection";
import BestSellersSection from "./components/BestSellersSection";
import AboutDolaTool from "./components/AboutDolaTool";
import OtherToolsSection from "./components/OtherToolsSection";
import NewsSection from "./components/NewsSection";
import FAQSection from "./components/FAQSection";
// Static import — bundled into main page chunk to avoid dynamic chunk module-factory bugs
import CustomerFeedback from "./components/CustomerFeedback";

// ssr: false — MUI v7 responsive sx props inside .map() cause React 19 hydration mismatch
// These are decorative/interactive components; client-only rendering is safe
const TrustBadgesBar      = dynamic(() => import("./components/TrustBadgesBar"),      { ssr: false });
const VoucherCardList     = dynamic(() => import("./components/VoucherCardList"),      { ssr: false });
const PromotionBanner     = dynamic(() => import("./components/PromotionBanner"),      { ssr: false });
const PromoBanner         = dynamic(() => import("./components/PromoBanner"),          { ssr: false });
const KnowledgeShare      = dynamic(() => import("./components/KnowledgeShare"),       { ssr: false });
const FeaturedBrandsSlider= dynamic(() => import("./components/FeaturedBrandsSlider"),{ ssr: false });
const SiteStatsSection    = dynamic(() => import("./components/SiteStatsSection"),     { ssr: false });
const NewsletterSection   = dynamic(() => import("./components/NewsletterSection"),    { ssr: false });
const RecentlyViewedSection=dynamic(() => import("./components/RecentlyViewedSection"),{ ssr: false });
import WebsiteTrafficTracker from "@/components/common/traffic/WebsiteTrafficTracker";
import FlashSaleShowcase from "../promotion/components/FlashSaleShowcase";
import CategoryView from "@/features/user/category/CategoryView";

import {
  useNewProducts,
  useBrands,
  useCategoriesWithProducts,
  useVouchers,
  useBestSellers,
  useSiteStats,
} from "./queries";
import { getFlashPromotions } from "./server";

export default function HomeView() {
  const { data: products, isLoading: loadingNew } = useNewProducts();
  const { data: brandAs, isLoading: loadingBrands } = useBrands();
  const { data: categoriesWithProducts, isLoading: loadingCatProds } =
    useCategoriesWithProducts();
  const { data: vouchers } = useVouchers();
  const { data: bestSellers, isLoading: loadingBest } = useBestSellers();
  const { data: siteStats } = useSiteStats();

  const [flashPromotions, setFlashPromotions] = useState<Promotion[] | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Reset scroll to top on every fresh page load (prevents browser restoring mid-page position)
    window.history.scrollRestoration = "manual";
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getFlashPromotions();
        if (!cancelled) setFlashPromotions(data);
      } catch {
        if (!cancelled) setFlashPromotions([]);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <>
      <BannerFeatureSection />
      {/* min-height reserves space on SSR so TrustBadgesBar mount doesn't cause CLS */}
      <Box sx={{ minHeight: { xs: 132, sm: 80, md: 80 } }}>
        <TrustBadgesBar />
      </Box>

      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        <WebsiteTrafficTracker />
        {vouchers?.length ? <VoucherCardList vouchers={vouchers} /> : null}
        <FlashSaleShowcase promotions={flashPromotions} />

        {loadingNew ? (
          <Skeleton variant="rounded" height={240} sx={{ my: 3 }} />
        ) : (
          <NewProductSection products={products || []} />
        )}

        <BestSellersSection products={bestSellers || []} isLoading={loadingBest} />
        <PromotionBanner />
        <CategoryView />
        <AboutDolaTool />
      </Container>

      {/* min-height reserves space to reduce CLS when SiteStatsSection mounts */}
      <Box sx={{ minHeight: { xs: 200, md: 180 } }}>
        <SiteStatsSection
          productCount={siteStats?.productCount}
          brandCount={siteStats?.brandCount}
          categoryCount={siteStats?.categoryCount}
          customerCount={siteStats?.customerCount}
          yearsOfExperience={siteStats?.yearsOfExperience}
        />
      </Box>

      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        {loadingCatProds ? (
          <Skeleton variant="rounded" height={320} sx={{ my: 3 }} />
        ) : categoriesWithProducts?.length ? (
          <OtherToolsSection categories={categoriesWithProducts} />
        ) : null}

        <NewsSection />
        <PromoBanner />
        {mounted && <CustomerFeedback />}
        <FAQSection />
        <KnowledgeShare />
      </Container>

      {/* min-height reserves space to reduce CLS when NewsletterSection mounts */}
      <Box sx={{ minHeight: { xs: 440, md: 280 } }}>
        <NewsletterSection />
      </Box>

      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 3, md: 4 } }}>
        {loadingBrands ? (
          <Box sx={{ my: 3 }}>
            <Skeleton variant="rounded" height={120} />
          </Box>
        ) : brandAs?.length ? (
          <FeaturedBrandsSlider brands={brandAs} />
        ) : null}
        <RecentlyViewedSection />
      </Container>
    </>
  );
}
