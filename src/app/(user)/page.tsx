import AboutDolaTool from "@/views/home/AboutDolaTool";
import CategoryCarousel from "@/features/user/category/CategoryCarousel";
import CustomerFeedback from "@/components/home/CustomerFeedback";
import FeaturedBrandsSlider from "@/views/home/FeaturedBrandsSlider";
import KnowledgeShare from "@/views/home/KnowledgeShare";
import NewProductSection from "@/components/home/NewProductSection";
import NewsSection from "@/components/home/NewsSection";
import OtherToolsSection from "@/components/home/OtherToolsSection";
import PromoBanner from "@/components/home/PromoBanner";
import PromotionBanner from "@/components/home/PromotionBanner";
import VoucherCardList from "@/components/home/VoucherCardList";
import FlashSaleShowcasePage from "@/views/promotion/FlashSaleShowcasePage";
import WebsiteTrafficTracker from "@/components/common/traffic/WebsiteTrafficTracker";
import BannerFeatureSection from "@/components/home/BannerFeatureSection";
import { Container } from "@mui/material";

import {
  getBrands,
  getCategories,
  getCategoriesWithProducts,
} from "@/lib/api/home-page";

export default async function HomePage() {
  const [categories, categoriesWithProducts, brands] = await Promise.all([
    getCategories(),
    getCategoriesWithProducts(),
    getBrands(),
  ]);

  return (
    <>
      <BannerFeatureSection />
      <Container>
        <WebsiteTrafficTracker />
        <VoucherCardList />
        <FlashSaleShowcasePage />
        <NewProductSection />
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
