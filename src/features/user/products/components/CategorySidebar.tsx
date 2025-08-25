"use client";

import {
  Box,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useRouter, useSearchParams } from "next/navigation";
import type { Category } from "../types";

export default function CategorySidebar({
  categories,
}: {
  categories: Category[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleClick = (slug?: string) => {
    if (!slug) return;
    const params = new URLSearchParams(searchParams.toString());
    if (slug === selectedCategory) params.delete("category");
    else params.set("category", slug);
    router.replace(`/product?${params.toString()}`, { scroll: false });
  };

  const renderCategoryItem = (cat: Category, idx: number) => {
    const isSelected = cat.slug === selectedCategory;

    return (
      <Box
        key={cat.slug || `category-${idx}`}
        onClick={() => handleClick(cat.slug)}
        sx={{
          cursor: "pointer",
          borderRadius: 1,
          px: 2,
          py: 1.2,
          transition: "all 0.2s",
          bgcolor: isSelected ? "#fff7e6" : "transparent",
          color: isSelected ? "#ffb700" : "inherit",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          "&:hover": { bgcolor: "#fdf6e3" },
        }}
      >
        <Typography
          fontSize={14}
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "75%",
          }}
        >
          {cat.name}
        </Typography>
        <Typography fontSize={13} fontStyle="italic" color="text.secondary">
          ({cat.products?.length || 0})
        </Typography>
      </Box>
    );
  };

  return (
    <Box>
      {isMobile ? (
        <Accordion disableGutters elevation={1} sx={{ mb: 2 }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{ bgcolor: "#ffb700", color: "#fff", px: 2 }}
          >
            <Typography fontWeight="bold">Danh mục sản phẩm</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            {categories.map(renderCategoryItem)}
          </AccordionDetails>
        </Accordion>
      ) : (
        <>
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
            {categories.map(renderCategoryItem)}
          </Paper>
        </>
      )}
    </Box>
  );
}
