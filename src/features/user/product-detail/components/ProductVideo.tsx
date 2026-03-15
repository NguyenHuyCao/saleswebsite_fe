// components/product/ProductVideo.tsx
"use client";

import {
  Box,
  Typography,
  Paper,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { useState } from "react";

interface Props {
  url: string;
  title?: string;
}

export default function ProductVideo({
  url,
  title = "Video giới thiệu sản phẩm",
}: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isPlaying, setIsPlaying] = useState(false);

  // Extract YouTube video ID from various URL formats
  const getYouTubeId = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = getYouTubeId(url);
  const embedUrl = videoId
    ? `https://www.youtube.com/embed/${videoId}?autoplay=1`
    : url;

  if (!videoId && !url) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <Paper
        elevation={2}
        sx={{
          p: { xs: 2, md: 3 },
          borderRadius: 3,
          bgcolor: "#fff",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <YouTubeIcon sx={{ color: "#f25c05", fontSize: 28 }} />
          <Typography variant="h6" fontWeight={700}>
            {title}
          </Typography>
        </Box>

        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: isMobile ? 250 : 400,
            borderRadius: 2,
            overflow: "hidden",
            bgcolor: "#000",
            cursor: "pointer",
          }}
          onClick={() => !isPlaying && setIsPlaying(true)}
        >
          {!isPlaying ? (
            <>
              <img
                src={
                  videoId
                    ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
                    : "/images/video-placeholder.jpg"
                }
                alt="Video thumbnail"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  opacity: 0.8,
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  bgcolor: "rgba(242,92,5,0.9)",
                  borderRadius: "50%",
                  width: 60,
                  height: 60,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.3s",
                  "&:hover": {
                    width: 70,
                    height: 70,
                    bgcolor: "#f25c05",
                  },
                }}
              >
                <PlayArrowIcon sx={{ fontSize: 40, color: "#fff" }} />
              </Box>
              <Box
                sx={{
                  position: "absolute",
                  bottom: 16,
                  left: 16,
                  right: 16,
                  textAlign: "center",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: "#fff",
                    bgcolor: "rgba(0,0,0,0.6)",
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    display: "inline-block",
                  }}
                >
                  Nhấn để xem video giới thiệu sản phẩm
                </Typography>
              </Box>
            </>
          ) : (
            <iframe
              width="100%"
              height="100%"
              src={embedUrl}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
              }}
            />
          )}
        </Box>

        {/* Video features */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            mt: 2,
            flexWrap: "wrap",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            📹 Xem trực tiếp cách sử dụng sản phẩm
          </Typography>
          <Typography variant="body2" color="text.secondary">
            🔧 Hướng dẫn chi tiết từ chuyên gia
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ⚡ Đánh giá thực tế hiệu năng
          </Typography>
        </Box>
      </Paper>
    </motion.div>
  );
}
