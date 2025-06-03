"use client";

import { Box, Typography, Paper } from "@mui/material";
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
  products: Product[];
}

interface Brand {
  id: number;
  name: string;
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

  const getCategoriesForHoveredBrand = () => {
    if (hoveredBrandIndex === null) return [];
    const brand = brands[hoveredBrandIndex];
    return brand.category.filter((cat) => cat.products.length > 0);
  };

  return (
    <Box display="flex" sx={{ position: "relative" }}>
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
              py: 1.5,
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
                src={`/uploads/${brand.logo}`}
                alt={brand.name}
                width={20}
                height={20}
              />
              <Typography fontSize={14}>{brand.name}</Typography>
            </Box>
            <Typography fontWeight="bold">›</Typography>
          </Box>
        ))}
      </Box>

      {hoveredBrandIndex !== null && (
        <Paper
          elevation={3}
          onMouseLeave={() => setHoveredBrandIndex(null)}
          sx={{
            position: "absolute",
            left: 250,
            top: 0,
            minWidth: 800,
            bgcolor: "white",
            color: "black",
            p: 3,
            display: "flex",
            flexWrap: "wrap",
            gap: 4,
            borderTop: "4px solid #ffb700",
          }}
        >
          {getCategoriesForHoveredBrand().map((cat) => (
            <Box key={cat.id} minWidth={200} maxWidth={250}>
              <Typography fontWeight="bold" mb={1} fontSize={14}>
                {cat.name}
              </Typography>
              {cat.products.map((p, i) => (
                <Typography
                  key={i}
                  fontSize={13}
                  onClick={() => router.push(`/product/detail?name=${p.slug}`)}
                  sx={{
                    mb: 0.5,
                    cursor: "pointer",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  {p.name}
                </Typography>
              ))}
            </Box>
          ))}
        </Paper>
      )}
    </Box>
  );
};

export default BrandMegaMenu;
