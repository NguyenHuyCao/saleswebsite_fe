"use client";

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

const brands = [
  {
    name: "DEWALT",
    founded: 1924,
    highlight: "Máy khoan, máy cắt, pin công nghiệp",
    image: "/images/brands/images.png",
    testimonial: {
      user: "Anh Tuấn – Kỹ sư điện",
      comment:
        "Dòng máy DEWALT dùng cực bền, hiệu năng ổn định. Pin khỏe, dùng được cả ngày!",
      rating: 5,
    },
  },
  {
    name: "Makita",
    founded: 1915,
    highlight: "Máy cưa, máy thổi lá, dụng cụ cầm tay",
    image: "/images/brands/Stihl_Logo_WhiteOnOrange.svg.png",
    testimonial: {
      user: "Chị Hạnh – Làm vườn chuyên nghiệp",
      comment:
        "Thiết kế gọn nhẹ, phù hợp cho công việc vườn tược. Giá cả hợp lý!",
      rating: 4.5,
    },
  },
];

const BrandAccordionSection = () => {
  return (
    <Box px={4} py={6}>
      <Typography variant="h5" fontWeight="bold" mb={4} textAlign="center">
        Giới thiệu từng thương hiệu
      </Typography>
      {brands.map((brand, i) => (
        <Accordion key={i}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight="bold">{brand.name}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2} alignItems="center">
              <Grid size={{ xs: 12, md: 4 }}>
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    height: 200,
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                >
                  <Image
                    src={brand.image}
                    alt={brand.name}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 8 }}>
                <Typography fontSize={16} mb={1}>
                  <strong>Năm thành lập:</strong> {brand.founded}
                </Typography>
                <Typography fontSize={16} mb={2}>
                  <strong>Sản phẩm nổi bật:</strong> {brand.highlight}
                </Typography>
                <Typography fontSize={15} fontStyle="italic">
                  “{brand.testimonial.comment}”
                </Typography>
                <Box mt={1} display="flex" alignItems="center" gap={1}>
                  <Avatar sx={{ width: 32, height: 32 }}>
                    {brand.testimonial.user.charAt(0)}
                  </Avatar>
                  <Typography fontSize={14} fontWeight={500}>
                    {brand.testimonial.user}
                  </Typography>
                  <Rating
                    value={brand.testimonial.rating}
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
