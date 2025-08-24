"use client";

import {
  Box,
  Typography,
  Paper,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  brands: { name: string; slug: string }[];
}

const priceRanges = [
  { label: "Dưới 1 triệu", value: "0_1000000" },
  { label: "Từ 1 - 2 triệu", value: "1000000_2000000" },
  { label: "Từ 2 - 5 triệu", value: "2000000_5000000" },
  { label: "Trên 5 triệu", value: "5000000_" },
];

export default function ProductFilterPanel({ brands }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const selectedBrands = searchParams.get("brand")?.split(",") || [];
  const selectedPrice = searchParams.get("price");

  const handleBrandChange = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const current = new Set(selectedBrands);
    current.has(slug) ? current.delete(slug) : current.add(slug);
    current.size > 0
      ? params.set("brand", Array.from(current).join(","))
      : params.delete("brand");
    router.replace(`/product?${params.toString()}`, { scroll: false });
  };

  const handlePriceChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    selectedPrice === value
      ? params.delete("price")
      : params.set("price", value);
    router.replace(`/product?${params.toString()}`, { scroll: false });
  };

  const content = (
    <>
      <Typography fontWeight="bold" mb={1} fontSize={14}>
        Mức giá
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
    </>
  );

  return (
    <Box>
      {isMobile ? (
        <Accordion disableGutters elevation={1} sx={{ mb: 2 }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{ bgcolor: "#ffb700", color: "#fff", px: 2 }}
          >
            <Typography fontWeight="bold">Bộ lọc sản phẩm</Typography>
          </AccordionSummary>
          <AccordionDetails>{content}</AccordionDetails>
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
            Bộ lọc sản phẩm
          </Typography>
          <Paper variant="outlined" sx={{ mt: 1, p: 2 }}>
            {content}
          </Paper>
        </>
      )}
    </Box>
  );
}
