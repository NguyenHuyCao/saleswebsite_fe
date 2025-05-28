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
