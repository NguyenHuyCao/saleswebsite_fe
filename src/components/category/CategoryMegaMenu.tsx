"use client";

import { Box, Typography, Paper, Button } from "@mui/material";
import { useState } from "react";

interface SubCategory {
  title: string;
  items: string[];
  description?: string;
  image?: string;
  ctaText?: string;
  ctaLink?: string;
}

interface CategoryData {
  label: string;
  icon: string;
  subCategories: SubCategory[];
  banner?: {
    image: string;
    description: string;
    ctaText: string;
    ctaLink: string;
  };
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

      {/* Sub menu với tương tác riêng */}
      {hoveredIndex !== null && (
        <Paper
          elevation={3}
          onMouseLeave={() => setHoveredIndex(null)}
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
          {data[hoveredIndex].subCategories.map((group, idx) => (
            <Box key={idx} minWidth={200} maxWidth={250}>
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
              {group.description && (
                <Typography fontSize={12} mt={1.5} color="gray">
                  {group.description}
                </Typography>
              )}
              {group.ctaText && group.ctaLink && (
                <Button
                  size="small"
                  variant="outlined"
                  href={group.ctaLink}
                  sx={{ mt: 1 }}
                >
                  {group.ctaText}
                </Button>
              )}
            </Box>
          ))}

          {/* Optional banner hiển thị khi hover */}
          {data[hoveredIndex].banner && (
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
              sx={{ maxWidth: 250 }}
            >
              <img
                src={data[hoveredIndex].banner.image}
                alt="banner"
                style={{ width: "100%", borderRadius: 4, marginBottom: 12 }}
              />
              <Typography fontSize={13} mb={1}>
                {data[hoveredIndex].banner.description}
              </Typography>
              <Button
                size="small"
                variant="contained"
                href={data[hoveredIndex].banner.ctaLink}
                sx={{ bgcolor: "#ffb700", color: "black" }}
              >
                {data[hoveredIndex].banner.ctaText}
              </Button>
            </Box>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default CategoryMegaMenu;
