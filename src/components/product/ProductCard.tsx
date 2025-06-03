"use client";

import React from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  Tooltip,
  Rating,
  IconButton,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Image from "next/image";

export type Product = {
  id: number;
  title: string;
  price: number;
  originalPrice: number;
  image: string;
  status: string[];
  sale: boolean;
  inStock: boolean;
  label: string;
  totalStock: number;
  stockQuantity: number;
  createdAt: string;
  rating?: number;
  slug?: string;
};

type Props = {
  product: Product;
  isFavorite?: boolean;
  onToggleFavorite?: (productId: number) => void;
};

const ProductCard = ({
  product,
  isFavorite = false,
  onToggleFavorite,
}: Props) => {
  return (
    <Paper
      elevation={2}
      sx={{
        width: 220,
        height: 350,
        borderRadius: 2,
        overflow: "hidden",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        p: 2,
        transition: "transform 0.3s ease",
        flexShrink: 0,
        "&:hover": {
          transform: "translateY(-4px)",
        },
      }}
    >
      {/* SALE TAG */}
      {product.sale && (
        <Box
          sx={{
            bgcolor: "#f25c05",
            color: "white",
            px: 1,
            py: 0.2,
            fontSize: 12,
            fontWeight: "bold",
            position: "absolute",
            top: 8,
            left: 8,
            zIndex: 2,
          }}
        >
          Sale
        </Box>
      )}

      {/* FAVORITE ICON */}
      <Tooltip title="Yêu thích">
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite?.(product.id);
          }}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            bgcolor: "white",
            boxShadow: 1,
            width: 28,
            height: 28,
            zIndex: 2,
            "&:hover": { bgcolor: "#ffe0b2" },
          }}
          aria-label="toggle favorite"
        >
          {isFavorite ? (
            <FavoriteIcon fontSize="small" sx={{ color: "#f25c05" }} />
          ) : (
            <FavoriteBorderIcon fontSize="small" sx={{ color: "#f25c05" }} />
          )}
        </IconButton>
      </Tooltip>

      {/* IMAGE */}
      <Box
        position="relative"
        height={150}
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{ backgroundColor: "#fafafa" }}
      >
        <Image
          src={product.image}
          alt={product.title}
          width={120}
          height={120}
          style={{ objectFit: "contain" }}
        />
      </Box>

      {/* STATUS BADGES */}
      <Stack direction="row" spacing={1} mt={1}>
        {product.status.map((s, idx) => (
          <Box
            key={idx}
            sx={{
              bgcolor: s === "Bán chạy" ? "#ffb700" : "#f25c05",
              color: "white",
              fontSize: 12,
              fontWeight: "bold",
              px: 1,
              borderRadius: 0.5,
            }}
          >
            {s}
          </Box>
        ))}
      </Stack>

      {/* PRODUCT TITLE */}
      <Typography
        fontSize={14}
        fontWeight={600}
        mt={1}
        sx={{
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          minHeight: 40,
        }}
      >
        {product.title}
      </Typography>

      {/* PRICE */}
      <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
        <Typography color="#f25c05" fontWeight="bold">
          {typeof product.price === "number"
            ? `${product.price.toLocaleString()}₫`
            : "Đang cập nhật"}
        </Typography>
        <Typography
          fontSize={13}
          sx={{ textDecoration: "line-through", color: "gray" }}
        >
          {typeof product.originalPrice === "number"
            ? `${product.originalPrice.toLocaleString()}₫`
            : ""}
        </Typography>
      </Stack>

      {/* RATING */}
      {product.rating !== undefined && (
        <Rating
          name="product-rating"
          value={product.rating}
          precision={0.5}
          size="small"
          readOnly
          sx={{ mt: 0.5 }}
        />
      )}

      {/* ACTION BUTTON */}
      <Box mt={"auto"}>
        <Button
          fullWidth
          variant={product.inStock ? "contained" : "outlined"}
          disabled={!product.inStock}
          sx={{
            mt: 1,
            bgcolor: product.inStock ? "#ffb700" : "#f0f0f0",
            color: product.inStock ? "black" : "gray",
            fontWeight: 600,
            textTransform: "none",
            fontSize: 14,
          }}
        >
          {product.label}
        </Button>
      </Box>
    </Paper>
  );
};

export default ProductCard;
