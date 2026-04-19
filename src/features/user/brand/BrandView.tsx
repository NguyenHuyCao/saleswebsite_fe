"use client";

import { Container, Box, Typography } from "@mui/material";
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

      <Box id="brand-list">
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
          {isError ? (
            <Box sx={{ py: 6, textAlign: "center" }}>
              <Typography color="error">
                Không lấy được danh sách thương hiệu.{" "}
                {error instanceof Error ? error.message : ""}
              </Typography>
            </Box>
          ) : (
            <>
              <BrandListSection brands={brands} loading={isLoading} />

              {!isLoading && (
                <>
                  <WhyChooseUs />
                  <BrandAccordionSection brands={brands} />
                  <BrandPageFinalSections />
                </>
              )}
            </>
          )}
        </Container>
      </Box>
    </>
  );
}
