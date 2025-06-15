"use client";

import {
  Box,
  Typography,
  Paper,
  Fade,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Product {
  id: number;
  name: string;
  slug?: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  products: Product[];
}

interface Brand {
  id: number;
  name: string;
  slug: string;
  logo: string;
  category: Category[];
}

interface Props {
  brands: Brand[];
  categories: Category[];
}

const BrandMegaMenu = ({ brands }: Props) => {
  const [hoveredBrandIndex, setHoveredBrandIndex] = useState<number | null>(
    null
  );
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const getCategoriesForHoveredBrand = () => {
    if (hoveredBrandIndex === null) return [];
    return brands[hoveredBrandIndex].category.filter(
      (cat) => cat.products.length > 0
    );
  };

  console.log("brands", brands);

  return (
    <Box
      display="flex"
      onMouseLeave={() => setHoveredBrandIndex(null)}
      sx={{
        position: "relative",
        boxShadow: 3,
      }}
    >
      {/* BRAND LIST */}
      <Box
        sx={{
          bgcolor: "black",
          color: "white",
          width: 250,
        }}
      >
        {brands.map((brand, index) => (
          <Box
            key={brand.id}
            onMouseEnter={() => setHoveredBrandIndex(index)}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 2,
              py: 1.3,
              cursor: "pointer",
              bgcolor: hoveredBrandIndex === index ? "#f97316" : "transparent",
              transition: "all 0.3s ease",
              borderLeft:
                hoveredBrandIndex === index
                  ? "4px solid #ffb700"
                  : "4px solid transparent",
            }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <Image
                src={`${brand.logo}`}
                alt={brand.name}
                width={35}
                height={35}
              />
              <Typography fontSize={14}>{brand.name}</Typography>
            </Box>
            <Typography fontWeight="bold">›</Typography>
          </Box>
        ))}
      </Box>

      {/* CATEGORY & PRODUCT LIST */}
      <Fade in={hoveredBrandIndex !== null} timeout={200}>
        <Paper
          elevation={4}
          sx={{
            position: "absolute",
            left: 250,
            top: 0,
            minWidth: 900,
            maxWidth: isMobile ? "90vw" : "none",
            bgcolor: "white",
            color: "black",
            p: 3,
            display: "flex",
            flexWrap: "wrap",
            gap: 4,
            borderTop: "4px solid #ffb700",
            zIndex: 10,
          }}
        >
          {getCategoriesForHoveredBrand().map((cat) => (
            <Box
              key={cat.id}
              sx={{
                minWidth: 220,
                maxWidth: 260,
                px: 3,
                maxHeight: 300,
                overflowY: "auto",
                "&::-webkit-scrollbar": { width: 6 },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#e0e0e0",
                  borderRadius: 4,
                },
              }}
            >
              <Typography
                fontWeight="bold"
                fontSize={13}
                color="#d35400"
                sx={{
                  textTransform: "uppercase",
                  borderBottom: "2px solid #ffb700",
                  pb: 0.5,
                  mb: 1.2,
                }}
              >
                {cat.name}
              </Typography>

              <Box component="ul" sx={{ listStyle: "none", pl: 1, m: 0 }}>
                {cat.products.slice(0, 6).map((p) => (
                  <Box
                    key={p.id}
                    component="li"
                    onClick={() =>
                      router.push(`/product/detail?name=${p.slug}`)
                    }
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 0.6,
                      fontSize: 13.5,
                      color: "#333",
                      cursor: "pointer",
                      borderRadius: 1,
                      px: 1,
                      py: 0.5,
                      transition: "all 0.2s ease",
                      "&:hover": {
                        backgroundColor: "#fff4e5",
                        color: "#f25c05",
                      },
                    }}
                  >
                    <Box component="span" sx={{ mr: 1.2, color: "#f25c05" }}>
                      ▶
                    </Box>
                    {p.name}
                  </Box>
                ))}

                {cat.products.length > 6 && (
                  <Box
                    onClick={() => {
                      const brandSlug = brands[hoveredBrandIndex!].slug;
                      router.push(
                        `/product?brand=${brandSlug}&category=${cat.slug}`
                      );
                    }}
                    sx={{
                      mt: 1,
                      fontSize: 13,
                      color: "#1976d2",
                      cursor: "pointer",
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      "&:hover": {
                        textDecoration: "underline",
                        backgroundColor: "#e3f2fd",
                      },
                    }}
                  >
                    Xem tất cả {cat.products.length} sản phẩm
                  </Box>
                )}
              </Box>
            </Box>
          ))}
        </Paper>
      </Fade>
    </Box>
  );
};

export default BrandMegaMenu;
