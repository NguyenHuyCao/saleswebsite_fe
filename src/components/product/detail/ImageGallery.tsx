"use client";

import { Box, Stack } from "@mui/material";

export const ImageGallery = () => (
  <Box>
    <Box
      component="img"
      src="/images/banner/0i6luq1eosgln.jpg"
      alt="Máy xay cỏ"
      sx={{ width: "100%", borderRadius: 2, boxShadow: 3, objectFit: "cover" }}
    />
    <Stack direction="row" spacing={2} mt={2}>
      {["images (1).jpeg"].map((src, i) => (
        <Box
          key={i}
          component="img"
          src={`/images/banner/${src}`}
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
