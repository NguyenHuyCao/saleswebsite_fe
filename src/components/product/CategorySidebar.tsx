"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Box, Typography, Paper } from "@mui/material";

interface CategorySidebarProps {
  categories: {
    name: string;
    slug: string;
    count: number;
  }[];
}

export default function CategorySidebar({ categories }: CategorySidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category");

  const handleClick = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (slug === selectedCategory) {
      params.delete("category");
    } else {
      params.set("category", slug);
    }

    router.push(`/product?${params.toString()}`);
  };

  return (
    <Box>
      <Typography
        variant="h6"
        fontWeight="bold"
        sx={{
          bgcolor: "#ffb700",
          color: "white",
          px: 2,
          py: 1,
          borderRadius: 1,
        }}
      >
        Danh mục sản phẩm
      </Typography>
      <Paper variant="outlined" sx={{ mt: 1, p: 1 }}>
        {categories.map((cat, idx) => {
          const isSelected = cat.slug === selectedCategory;
          return (
            <Box
              key={`cat-${cat.slug || cat.name}-${idx}`}
              onClick={() => handleClick(cat.slug)}
              py={1.2}
              px={2}
              sx={{
                cursor: "pointer",
                borderRadius: 1,
                transition: "all 0.2s ease",
                bgcolor: isSelected ? "#fff7e6" : "transparent",
                color: isSelected ? "#ffb700" : "inherit",
                display: "flex",
                justifyContent: "space-between",
                fontSize: 14,
              }}
            >
              <Typography>{cat.name}</Typography>
              <Typography>({cat.count})</Typography>
            </Box>
          );
        })}
      </Paper>
    </Box>
  );
}
