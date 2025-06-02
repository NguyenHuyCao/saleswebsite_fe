"use client";

import {
  Box,
  Typography,
  Paper,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";

interface ProductFilterPanelProps {
  brands: {
    name: string;
    slug: string;
  }[];
}

const priceRanges = [
  { label: "Dưới 100 Trăm", value: "0_100" },
  { label: "Từ 100 - 200 Trăm", value: "100_200" },
  { label: "Từ 200 - 300 Trăm", value: "200_300" },
  { label: "Từ 300 - 500 Trăm", value: "300_500" },
  { label: "Từ 500 Trăm - 1000 Triệu", value: "500_1000" },
  { label: "Từ 1 - 2 Triệu", value: "1000_2000" },
  { label: "Từ 2 - 5 Triệu", value: "2000_5000" },
  { label: "Trên 5 Triệu", value: "5000" },
];

export default function ProductFilterPanel({
  brands,
}: ProductFilterPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedBrands = searchParams.get("brand")?.split(",") || [];
  const selectedPrice = searchParams.get("price");

  const handleBrandChange = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const current = new Set(selectedBrands);

    if (current.has(slug)) {
      current.delete(slug);
    } else {
      current.add(slug);
    }

    if (current.size > 0) {
      params.set("brand", Array.from(current).join(","));
    } else {
      params.delete("brand");
    }

    router.push(`/product?${params.toString()}`);
  };

  const handlePriceChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (selectedPrice === value) {
      params.delete("price");
    } else {
      params.set("price", value);
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
        Bộ lọc sản phẩm
      </Typography>
      <Paper variant="outlined" sx={{ mt: 1, p: 2 }}>
        <Typography fontWeight="bold" mb={1} fontSize={14}>
          Chọn mức giá
        </Typography>
        <FormGroup sx={{ mb: 2 }}>
          {priceRanges.map((price) => (
            <FormControlLabel
              key={price.value}
              control={
                <Checkbox
                  size="small"
                  checked={selectedPrice === price.value}
                  onChange={() => handlePriceChange(price.value)}
                />
              }
              label={<Typography fontSize={14}>{price.label}</Typography>}
            />
          ))}
        </FormGroup>

        <Typography fontWeight="bold" mb={1} fontSize={14}>
          Thương hiệu
        </Typography>
        <FormGroup>
          {brands.map((brand) => (
            <FormControlLabel
              key={brand.slug}
              control={
                <Checkbox
                  size="small"
                  checked={selectedBrands.includes(brand.slug)}
                  onChange={() => handleBrandChange(brand.slug)}
                />
              }
              label={<Typography fontSize={14}>{brand.name}</Typography>}
            />
          ))}
        </FormGroup>
      </Paper>
    </Box>
  );
}
