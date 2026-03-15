// features/user/new/components/NewsDetailHero.tsx
"use client";

import {
  Box,
  Typography,
  Chip,
  Stack,
  Avatar,
  Divider,
  Paper,
} from "@mui/material";
import { motion } from "framer-motion";
import Image from "next/image";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CommentIcon from "@mui/icons-material/Comment";
import type { NewsPost } from "../types";

interface Props {
  post: NewsPost;
}

export default function NewsDetailHero({ post }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Paper elevation={0} sx={{ p: 3, borderRadius: 4, mb: 3 }}>
        {/* Category & Date */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Chip
            label={post.category || "Tin tức"}
            sx={{
              bgcolor: "#f25c05",
              color: "#fff",
              fontWeight: 600,
              px: 1,
            }}
          />
          <Stack direction="row" spacing={2}>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <CalendarTodayIcon sx={{ fontSize: 16, color: "#999" }} />
              <Typography variant="caption" color="text.secondary">
                {post.date || post.publishedAt}
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <VisibilityIcon sx={{ fontSize: 16, color: "#999" }} />
              <Typography variant="caption" color="text.secondary">
                {post.views || 0} lượt xem
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <CommentIcon sx={{ fontSize: 16, color: "#999" }} />
              <Typography variant="caption" color="text.secondary">
                {post.comments || 0} bình luận
              </Typography>
            </Stack>
          </Stack>
        </Stack>

        {/* Title */}
        <Typography
          variant="h3"
          fontWeight={800}
          sx={{
            fontSize: { xs: "1.8rem", md: "2.2rem" },
            mb: 2,
            lineHeight: 1.3,
          }}
        >
          {post.title}
        </Typography>

        {/* Author */}
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
          <Avatar src={post.authorAvatar} sx={{ width: 48, height: 48 }}>
            {post.author?.charAt(0)}
          </Avatar>
          <Box>
            <Typography fontWeight={600}>{post.author || "Admin"}</Typography>
            <Typography variant="caption" color="text.secondary">
              Chuyên gia tư vấn
            </Typography>
          </Box>
        </Stack>

        {/* Featured Image */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: { xs: 250, md: 400 },
            borderRadius: 3,
            overflow: "hidden",
            mb: 3,
          }}
        >
          <Image
            src={post.image}
            alt={post.title}
            fill
            priority
            style={{ objectFit: "cover" }}
          />
        </Box>

        {/* Excerpt */}
        {post.excerpt && (
          <Typography
            variant="body1"
            sx={{
              fontStyle: "italic",
              color: "#666",
              bgcolor: "#f5f5f5",
              p: 2,
              borderRadius: 2,
              borderLeft: "4px solid #f25c05",
            }}
          >
            {post.excerpt}
          </Typography>
        )}
      </Paper>
    </motion.div>
  );
}
