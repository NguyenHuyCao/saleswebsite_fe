"use client";

import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import Image from "next/image";
import { gallery } from "../constants/gallery";

export default function ExperienceMediaSection() {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);

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

      <Grid container spacing={2} justifyContent="center">
        {gallery.map((src, i) => (
          <Grid size={{ xs: 6, sm: 4, md: 3 }} key={i}>
            <Box
              onClick={() => {
                setIdx(i);
                setOpen(true);
              }}
              sx={{
                position: "relative",
                borderRadius: 2,
                overflow: "hidden",
                cursor: "pointer",
                transition: "transform 0.3s ease",
                boxShadow: 2,
                "&:hover": { transform: "scale(1.03)" },
              }}
            >
              <Image
                src={src}
                alt={`Ảnh trải nghiệm ${i + 1}`}
                width={300}
                height={200}
                loading="lazy"
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

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={idx}
        slides={gallery.map((src) => ({ src }))}
        plugins={[Zoom]}
        styles={{ container: { backgroundColor: "rgba(0,0,0,0.9)" } }}
      />
    </Box>
  );
}
