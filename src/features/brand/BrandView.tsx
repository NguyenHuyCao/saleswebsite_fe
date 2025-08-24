"use client";

import { Container } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { brandsOptions } from "./queries";
import BrandHeroSection from "./components/BrandHeroSection";
import BrandListSection from "./components/BrandListSection";
import BrandAccordionSection from "./components/BrandAccordionSection";
import BrandPageFinalSections from "./components/BrandPageFinalSections";
import WhyChooseUs from "./components/WhyChooseUs";

export default function BrandView() {
  const { data, isLoading, isError, error } = useQuery(brandsOptions());

  const brands = data?.items ?? [];

  return (
    <>
      <BrandHeroSection />
      <Container>
        {isLoading ? (
          <div style={{ padding: 24 }}>Đang tải thương hiệu...</div>
        ) : isError ? (
          <div style={{ padding: 24, color: "crimson" }}>
            Không lấy được danh sách thương hiệu.{" "}
            {error instanceof Error ? error.message : ""}
          </div>
        ) : (
          <>
            <BrandListSection brands={brands} />
            <WhyChooseUs />
            <BrandAccordionSection brands={brands} />
            <BrandPageFinalSections />
          </>
        )}
      </Container>
    </>
  );
}
