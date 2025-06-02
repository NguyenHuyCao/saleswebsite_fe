"use client";

import React from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Avatar,
  Rating,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Image from "next/image";

interface Props {
  brands: Brand[];
}

const BrandAccordionSection = ({ brands }: Props) => {
  return (
    <Box px={4} py={6}>
      <Typography variant="h5" fontWeight="bold" mb={4} textAlign="center">
        Giới thiệu từng thương hiệu
      </Typography>
      {brands.map((brand, i) => (
        <Accordion key={i} sx={{ mb: 2, borderRadius: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight="bold">{brand.name}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3} alignItems="center">
              <Grid size={{ xs: 12, md: 4 }}>
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    height: 200,
                    borderRadius: 2,
                    overflow: "hidden",
                    boxShadow: 2,
                  }}
                >
                  <Image
                    src={`http://localhost:8080/api/v1/files/${brand.logo}`}
                    alt={brand.name}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 8 }}>
                <Typography fontSize={16} mb={1}>
                  <strong>Năm thành lập:</strong>{" "}
                  {brand.year > 0 ? brand.year : "Chưa rõ"}
                </Typography>
                <Typography fontSize={16} mb={1}>
                  <strong>Quốc gia:</strong> {brand.originCountry}
                </Typography>
                <Typography fontSize={16} mb={2}>
                  <strong>Website:</strong> {brand.website}
                </Typography>
                {brand.description ? (
                  <Typography
                    fontSize={15}
                    fontStyle="italic"
                    color="text.secondary"
                  >
                    “{brand.description}”
                  </Typography>
                ) : (
                  <Typography
                    fontSize={15}
                    fontStyle="italic"
                    color="text.disabled"
                  >
                    Thương hiệu chưa có mô tả cụ thể.
                  </Typography>
                )}
                <Box mt={2} display="flex" alignItems="center" gap={1}>
                  <Avatar sx={{ width: 32, height: 32 }}>
                    {brand.name.charAt(0)}
                  </Avatar>
                  <Typography
                    fontSize={14}
                    fontWeight={500}
                    color="text.primary"
                  >
                    {brand.name} Official
                  </Typography>
                  <Rating
                    value={4 + (i % 2) * 0.5}
                    precision={0.5}
                    readOnly
                    size="small"
                  />
                </Box>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default BrandAccordionSection;
