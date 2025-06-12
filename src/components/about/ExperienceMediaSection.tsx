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
    <Box
      px={{ xs: 2, md: 4 }}
      py={{ xs: 6, md: 8 }}
      textAlign="center"
      bgcolor="#fff"
    >
      <Typography variant="h5" fontWeight={700} mb={4}>
        HÌNH ẢNH THỰC TẾ & VIDEO TRẢI NGHIỆM
      </Typography>

      {/* Video demo */}
      <Box
        mb={6}
        sx={{
          width: "100%",
          maxWidth: 720,
          mx: "auto",
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: 3,
        }}
      >
        <video
          controls
          poster="/images/banner/video-poster.jpg"
          style={{
            width: "100%",
            height: "auto",
            borderRadius: 12,
          }}
        >
          <source src="/videos/demo.mp4" type="video/mp4" />
          Trình duyệt của bạn không hỗ trợ video.
        </video>
      </Box>

      {/* Hình ảnh thực tế */}
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
                transition: "transform 0.3s ease",
                boxShadow: 2,
                "&:hover": {
                  transform: "scale(1.03)",
                },
              }}
            >
              <Image
                src={src}
                alt={`Ảnh trải nghiệm ${index + 1}`}
                width={300}
                height={200}
                style={{
                  objectFit: "cover",
                  width: "100%",
                  height: "auto",
                  display: "block",
                }}
              />
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Lightbox preview */}
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={currentIndex}
        slides={images.map((src) => ({ src }))}
        animation={{ zoom: 0.6 }}
        styles={{ container: { backgroundColor: "rgba(0,0,0,0.9)" } }}
      />
    </Box>
  );
};

export default ExperienceMediaSection;
