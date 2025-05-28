"use client";

import { Box, Typography, Grid } from "@mui/material";
import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Image from "next/image";

const images = [
  "/images/about/484879236_2709849085852250_5731145798870743687_n.jpg",
  "/images/about/498182809_2770061703164321_2331233069439603657_n.jpg",
  "/images/about/499211329_2770056789831479_696326258343808509_n.jpg",
  "/images/about/499532978_2773015746202250_4981359374519031868_n.jpg",
];

const ExperienceMediaSection = () => {
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleOpen = (index: number) => {
    setCurrentIndex(index);
    setOpen(true);
  };

  return (
    <Box px={4} py={8} sx={{ textAlign: "center", backgroundColor: "#fff" }}>
      <Typography variant="h5" fontWeight="bold" mb={4}>
        HÌNH ẢNH THỰC TẾ & VIDEO TRẢI NGHIỆM
      </Typography>

      {/* Video section */}
      <Box
        mb={6}
        sx={{ position: "relative", width: "100%", maxWidth: 720, mx: "auto" }}
      >
        <video
          controls
          poster="https://www.facebook.com/share/v/19PrfwvfgL/"
          style={{ borderRadius: 12, width: "100%" }}
        >
          <source src="/videos/demo.mp4" type="video/mp4" />
          Trình duyệt của bạn không hỗ trợ video.
        </video>
      </Box>

      {/* Image gallery */}
      <Grid container spacing={2} justifyContent="center">
        {images.map((src, index) => (
          <Grid size={{ xs: 6, sm: 4, md: 3 }} key={index}>
            <Box
              onClick={() => handleOpen(index)}
              sx={{
                position: "relative",
                borderRadius: 2,
                overflow: "hidden",
                cursor: "pointer",
                boxShadow: 2,
              }}
            >
              <Image
                src={src}
                alt={`image-${index}`}
                width={300}
                height={200}
                style={{ objectFit: "cover", width: "100%", height: "auto" }}
              />
            </Box>
          </Grid>
        ))}
      </Grid>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={currentIndex}
        slides={images.map((src) => ({ src }))}
      />
    </Box>
  );
};

export default ExperienceMediaSection;
