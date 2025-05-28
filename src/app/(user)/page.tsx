import AboutDolaTool from "@/components/AboutDolaTool";
import CategoryCarousel from "@/components/category/CategoryCarousel";
import CountdownPromotion from "@/components/CountdownPromotion";
import CustomerFeedback from "@/components/CustomerFeedback";
import FeaturedBrandsSlider from "@/components/FeaturedBrandsSlider";
import FlashSaleSlider from "@/components/FlashSaleSlider";
import KnowledgeShare from "@/components/KnowledgeShare";
import NewProductSection from "@/components/NewProductSection";
import NewsSection from "@/components/NewsSection";
import OtherToolsSection from "@/components/OtherToolsSection";
import PromoBanner from "@/components/PromoBanner";
import PromotionBanner from "@/components/PromotionBanner";
import VoucherCardList from "@/components/VoucherCardList";
import { Box, Container } from "@mui/material";
import Image from "next/image";

const HomePage = () => {
  // const accessToken = localStorage.getItem("accessToken");
  // if (accessToken) {
  //   // Redirect to home page if already logged in
  //   window.location.href = "/login";
  //   return null;
  // }
  const deadline = "2025-06-30T23:59:59";

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Container
          disableGutters // ✅ loại bỏ padding mặc định
          maxWidth={false} // ✅ cho phép full width
          sx={{ p: 0 }} // ✅ đảm bảo không có padding thủ công
        >
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
        <NewProductSection />
        <PromotionBanner />
        <CategoryCarousel />
        <AboutDolaTool />
        <OtherToolsSection />
        <NewsSection />
        <PromoBanner />
        <CustomerFeedback />
        <KnowledgeShare />
        <FeaturedBrandsSlider />
      </Container>
    </>
  );
};

export default HomePage;
