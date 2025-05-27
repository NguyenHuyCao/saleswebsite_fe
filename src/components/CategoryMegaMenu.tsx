"use client";

import { Box, Typography, Paper } from "@mui/material";
import { useState } from "react";

interface SubCategory {
  title: string;
  items: string[];
}

interface CategoryData {
  label: string;
  icon: string; // URL hoặc đường dẫn ảnh icon
  subCategories: SubCategory[];
}

interface Props {
  data: CategoryData[];
}

const CategoryMegaMenu = ({ data }: Props) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <Box display="flex" sx={{ position: "relative" }}>
      {/* Danh mục chính */}
      <Box
        sx={{
          bgcolor: "black",
          color: "white",
          width: 250,
        }}
      >
        {data.map((category, index) => (
          <Box
            key={index}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 2,
              py: 1.5,
              cursor: "pointer",
              bgcolor: hoveredIndex === index ? "#f97316" : "transparent",
              transition: "all 0.3s ease",
              borderLeft:
                hoveredIndex === index
                  ? "4px solid #ffb700"
                  : "4px solid transparent",
            }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <img
                src={category.icon}
                alt={category.label}
                width={20}
                height={20}
              />
              <Typography fontSize={14}>{category.label}</Typography>
            </Box>
            <Typography fontWeight="bold">›</Typography>
          </Box>
        ))}
      </Box>

      {/* Sub menu */}
      {hoveredIndex !== null && (
        <Paper
          elevation={3}
          onMouseLeave={() => setHoveredIndex(null)}
          sx={{
            position: "absolute",
            left: 250,
            top: 0,
            minWidth: 600,
            bgcolor: "white",
            color: "black",
            p: 3,
            display: "flex",
            flexWrap: "wrap",
            gap: 4,
            borderTop: "4px solid #ffb700",
          }}
        >
          {data[hoveredIndex].subCategories.map((group, idx) => (
            <Box key={idx} minWidth={180}>
              <Typography fontWeight="bold" mb={1} fontSize={14}>
                {group.title}
              </Typography>
              {group.items.map((item, i) => (
                <Typography
                  key={i}
                  fontSize={13}
                  sx={{
                    mb: 0.5,
                    cursor: "pointer",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  {item}
                </Typography>
              ))}
            </Box>
          ))}
        </Paper>
      )}
    </Box>
  );
};

export default CategoryMegaMenu;
