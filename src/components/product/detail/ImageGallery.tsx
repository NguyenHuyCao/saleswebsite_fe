"use client";

import { Box, Stack } from "@mui/material";

interface Props {
  product: {
    imageAvt: string;
    imageDetail1: string | null;
    imageDetail2: string | null;
    imageDetail3: string | null;
    name: string;
  };
}

export const ImageGallery = ({ product }: Props) => {
  const images = [
    product.imageAvt,
    product.imageDetail1,
    product.imageDetail2,
    product.imageDetail3,
  ].filter(Boolean);

  return (
    <Box>
      <Box
        component="img"
        src={`http://localhost:8080/api/v1/files/${product.imageAvt}`}
        alt={product.name}
        sx={{
          width: "100%",
          borderRadius: 2,
          boxShadow: 3,
          objectFit: "cover",
        }}
      />
      <Stack direction="row" spacing={2} mt={2}>
        {images.map((src, i) => (
          <Box
            key={i}
            component="img"
            src={`http://localhost:8080/api/v1/files/${src}`}
            alt={`Ảnh chi tiết ${i + 1}`}
            sx={{
              width: 80,
              height: 80,
              borderRadius: 1,
              border: "1px solid #ccc",
              cursor: "pointer",
              objectFit: "cover",
              "&:hover": { borderColor: "warning.main" },
            }}
          />
        ))}
      </Stack>
    </Box>
  );
};
