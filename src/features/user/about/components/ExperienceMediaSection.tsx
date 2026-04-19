// about/components/ExperienceMediaSection.tsx
"use client";

import { Box, Typography, Grid, Chip, Paper, IconButton } from "@mui/material";
import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Video from "yet-another-react-lightbox/plugins/video";
import "yet-another-react-lightbox/styles.css";
import Image from "next/image";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import { gallery } from "../constants/gallery";

export default function ExperienceMediaSection() {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const [videoOpen, setVideoOpen] = useState(false);

  const slides = [
    ...gallery.map((src) => ({ src, type: "image" as const })),
    {
      src: "/videos/demo.mp4",
      type: "video" as const,
      poster: "/images/banner/video-poster.jpg",
    },
  ];

  return (
    <Box px={{ xs: 2, md: 4 }} py={{ xs: 6, md: 8 }} sx={{ bgcolor: "#fff" }}>
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Chip
          label="THỰC TẾ"
          sx={{ bgcolor: "#f25c05", color: "#fff", fontWeight: 700, mb: 2 }}
        />

        <Typography
          variant="h3"
          fontWeight={800}
          sx={{
            fontSize: { xs: "2rem", md: "2.5rem" },
            mb: 2,
          }}
        >
          Hình ảnh & Video{" "}
          <Box component="span" sx={{ color: "#ffb700" }}>
            trải nghiệm
          </Box>
        </Typography>
      </Box>

      {/* Video Player */}
      <Paper
        elevation={3}
        sx={{
          mb: 4,
          borderRadius: 4,
          overflow: "hidden",
          cursor: "pointer",
          position: "relative",
          "&:hover": {
            "& .play-icon": { transform: "scale(1.1)" },
          },
        }}
        onClick={() => setVideoOpen(true)}
      >
        <Box sx={{ position: "relative", width: "100%", pt: "56.25%" }}>
          <Image
            src="/images/banner/video-poster.jpg"
            alt="Video thumbnail"
            fill
            style={{ objectFit: "cover" }}
          />
          <Box
            className="play-icon"
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "rgba(242,92,5,0.9)",
              borderRadius: "50%",
              width: 80,
              height: 80,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.3s",
            }}
          >
            <PlayCircleIcon sx={{ fontSize: 50, color: "#fff" }} />
          </Box>
        </Box>
      </Paper>

      {/* Gallery Grid */}
      <Grid container spacing={2} justifyContent="center">
        {gallery.map((src, i) => (
          <Grid size={{ xs: 6, sm: 4, md: 3 }} key={i}>
            <Paper
                onClick={() => {
                  setIdx(i);
                  setOpen(true);
                }}
                sx={{
                  borderRadius: 3,
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "all 0.3s",
                  boxShadow: 2,
                  "&:hover": {
                    transform: "scale(1.02)",
                    boxShadow: "0 12px 28px rgba(242,92,5,0.15)",
                  },
                }}
              >
                <Box sx={{ position: "relative", pt: "75%" }}>
                  <Image
                    src={src}
                    alt={`Ảnh trải nghiệm ${i + 1}`}
                    fill
                    sizes="(max-width: 600px) 50vw, 300px"
                    style={{ objectFit: "cover" }}
                  />
                </Box>
              </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Lightbox for images */}
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={idx}
        slides={gallery.map((src: any) => ({ src }))}
        plugins={[Zoom]}
        styles={{ container: { backgroundColor: "rgba(0,0,0,0.95)" } }}
      />

      {/* Lightbox for video */}
      <Lightbox
        open={videoOpen}
        close={() => setVideoOpen(false)}
        slides={[
          {
            type: "video",
            poster: "/images/banner/video-poster.jpg",
            sources: [{ src: "/videos/demo.mp4", type: "video/mp4" }],
          },
        ]}
        plugins={[Video]}
        styles={{ container: { backgroundColor: "rgba(0,0,0,0.95)" } }}
      />
    </Box>
  );
}
