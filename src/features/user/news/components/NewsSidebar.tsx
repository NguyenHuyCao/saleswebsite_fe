// features/user/new/components/NewsSidebar.tsx
"use client";

import {
  Box,
  Typography,
  Paper,
  Stack,
  ListItemButton,
  ListItemText,
  Chip,
  TextField,
  InputAdornment,
  Button,
  Divider,
  Avatar,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import SearchIcon from "@mui/icons-material/Search";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { useNewsList } from "../queries";
import type { NewsPost } from "../types";
import Image from "next/image";

interface Props {
  currentPost: NewsPost;
}

const categories = [
  "Công nghệ mới",
  "Đánh giá sản phẩm",
  "Thử nghiệm",
  "Kinh nghiệm",
  "Khuyến mãi",
];

const popularTags = [
  "máy cắt cỏ",
  "máy khoan",
  "máy mài",
  "máy cưa xích",
  "bảo trì",
  "khuyến mãi",
];

export default function NewsSidebar({ currentPost }: Props) {
  const router = useRouter();
  const { data } = useNewsList("", 1, 5);
  const latestPosts =
    data?.result?.filter((p) => p.slug !== currentPost.slug) || [];

  return (
    <Stack spacing={3}>
      {/* Search */}
      <Paper
        elevation={0}
        sx={{ p: 3, borderRadius: 4, border: "1px solid #f0f0f0" }}
      >
        <Typography
          variant="h6"
          fontWeight={700}
          sx={{ mb: 2, color: "#f25c05" }}
        >
          Tìm kiếm
        </Typography>
        <TextField
          fullWidth
          placeholder="Tìm bài viết..."
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {/* Categories */}
      <Paper
        elevation={0}
        sx={{ p: 3, borderRadius: 4, border: "1px solid #f0f0f0" }}
      >
        <Typography
          variant="h6"
          fontWeight={700}
          sx={{ mb: 2, color: "#f25c05" }}
        >
          Danh mục
        </Typography>
        <Stack spacing={1}>
          {categories.map((cat) => (
            <ListItemButton
              key={cat}
              sx={{ borderRadius: 2, px: 1 }}
              onClick={() => router.push(`/new?category=${cat}`)}
            >
              <ListItemText primary={cat} />
              <ArrowForwardIcon sx={{ fontSize: 16, color: "#999" }} />
            </ListItemButton>
          ))}
        </Stack>
      </Paper>

      {/* Latest Posts */}
      {latestPosts.length > 0 && (
        <Paper
          elevation={0}
          sx={{ p: 3, borderRadius: 4, border: "1px solid #f0f0f0" }}
        >
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{ mb: 2, color: "#f25c05" }}
          >
            Bài viết mới
          </Typography>
          <Stack spacing={2}>
            {latestPosts.map((post, idx) => (
              <motion.div
                key={post.slug}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                <Box
                  display="flex"
                  gap={1.5}
                  sx={{ cursor: "pointer" }}
                  onClick={() => router.push(`/new/${post.slug}`)}
                >
                  <Box
                    sx={{
                      width: 70,
                      height: 70,
                      borderRadius: 2,
                      overflow: "hidden",
                      flexShrink: 0,
                    }}
                  >
                    <Image
                      src={post.image}
                      alt={post.title}
                      width={70}
                      height={70}
                      style={{ objectFit: "cover" }}
                    />
                  </Box>
                  <Box>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        overflow: "hidden",
                        mb: 0.5,
                      }}
                    >
                      {post.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {post.date || post.publishedAt}
                    </Typography>
                  </Box>
                </Box>
              </motion.div>
            ))}
          </Stack>
        </Paper>
      )}

      {/* Popular Tags */}
      <Paper
        elevation={0}
        sx={{ p: 3, borderRadius: 4, border: "1px solid #f0f0f0" }}
      >
        <Typography
          variant="h6"
          fontWeight={700}
          sx={{ mb: 2, color: "#f25c05" }}
        >
          Chủ đề nổi bật
        </Typography>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {popularTags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              onClick={() => router.push(`/new?tag=${tag}`)}
              sx={{
                bgcolor: "#f5f5f5",
                "&:hover": { bgcolor: "#ffb700" },
                cursor: "pointer",
              }}
            />
          ))}
        </Box>
      </Paper>
    </Stack>
  );
}
