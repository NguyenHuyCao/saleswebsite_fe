"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

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
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  // Optional: throttle hover delay for better UX
  const handleMouseEnter = (index: number) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setTimeout(() => setHoveredIndex(null), 120);
  };

  return (
    <Box display="flex" position="relative" zIndex={100}>
      {/* Left: Main Categories */}
      <Box sx={{ bgcolor: "#000", color: "#fff", width: 250 }}>
        {data.map((category, index) => (
          <Box
            key={index}
            onMouseEnter={() => handleMouseEnter(index)}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 2,
              py: 1.5,
              cursor: "pointer",
              bgcolor: hoveredIndex === index ? "#f97316" : "transparent",
              borderLeft:
                hoveredIndex === index
                  ? "4px solid #ffb700"
                  : "4px solid transparent",
              transition: "all 0.3s ease",
            }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <Image
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

      {/* Right: Submenu */}
      <AnimatePresence>
        {hoveredIndex !== null && (
          <motion.div
            key={hoveredIndex}
            initial={{ opacity: 0, scale: 0.96, x: 10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, x: 10 }}
            transition={{ duration: 0.2 }}
            onMouseLeave={handleMouseLeave}
            style={{
              position: "absolute",
              left: 250,
              top: 0,
              minWidth: 850,
              background: "#fff",
              padding: 24,
              display: "flex",
              flexWrap: "wrap",
              gap: 32,
              borderTop: "4px solid #ffb700",
              boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
            }}
          >
            {/* Subcategories */}
            {data[hoveredIndex].subCategories.map((group, idx) => (
              <Box key={idx} sx={{ minWidth: 200, maxWidth: 240 }}>
                <Typography fontWeight="bold" fontSize={14} mb={1}>
                  {group.title}
                </Typography>
                {group.items.map((item, i) => (
                  <Typography
                    key={i}
                    fontSize={13}
                    sx={{
                      mb: 0.5,
                      cursor: "pointer",
                      color: "#333",
                      "&:hover": {
                        textDecoration: "underline",
                        color: "#f97316",
                      },
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
                    sx={{
                      mt: 1,
                      borderColor: "#ffb700",
                      color: "#ffb700",
                      "&:hover": {
                        bgcolor: "#fff8e1",
                        borderColor: "#f59e0b",
                      },
                    }}
                  >
                    {group.ctaText}
                  </Button>
                )}
              </Box>
            ))}

            {/* Optional Banner */}
            {data[hoveredIndex].banner && (
              <Box sx={{ maxWidth: 260, flexShrink: 0 }}>
                <Box sx={{ overflow: "hidden", borderRadius: 2, mb: 1.5 }}>
                  <Image
                    src={data[hoveredIndex].banner.image}
                    alt="promo"
                    width={260}
                    height={160}
                    style={{
                      width: "100%",
                      height: "auto",
                      borderRadius: 8,
                      transition: "transform 0.3s ease",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.transform = "scale(1.05)")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  />
                </Box>
                <Typography fontSize={13} mb={1}>
                  {data[hoveredIndex].banner.description}
                </Typography>
                <Button
                  size="small"
                  variant="contained"
                  href={data[hoveredIndex].banner.ctaLink}
                  sx={{
                    bgcolor: "#ffb700",
                    color: "#000",
                    fontWeight: 600,
                    "&:hover": {
                      bgcolor: "#facc15",
                    },
                  }}
                >
                  {data[hoveredIndex].banner.ctaText}
                </Button>
              </Box>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default CategoryMegaMenu;
