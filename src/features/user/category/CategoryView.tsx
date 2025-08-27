"use client";

import { Box, CircularProgress, Typography } from "@mui/material";
import { useCategories } from "./queries";
import CategoryCarousel from "./components/CategoryCarousel";

const CategoryView = () => {
  const { data, isLoading, isError, error } = useCategories();

  if (isLoading) {
    return (
      <Box py={6} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box py={6} textAlign="center">
        <Typography color="error">
          Không tải được danh mục: {error.message}
        </Typography>
      </Box>
    );
  }

  const categories = data ?? [];

  return (
    <Box>
      <CategoryCarousel categories={categories} />
    </Box>
  );
};

export default CategoryView;
