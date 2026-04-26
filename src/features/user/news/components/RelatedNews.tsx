// features/user/new/components/RelatedNews.tsx
"use client";

import {
  Box,
  Typography,
  Grid,
  Paper,
  Chip,
  Stack,
  Button,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNewsList } from "../queries";

interface Props {
  category?: string;
  currentSlug: string;
}

export default function RelatedNews({ category, currentSlug }: Props) {
  const router = useRouter();
  const { data } = useNewsList(category || "", 1, 4);

  const relatedPosts =
    data?.result?.filter((p) => p.slug !== currentSlug) || [];

  if (relatedPosts.length === 0) return null;

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3, color: "#333" }}>
        Bài viết liên quan
      </Typography>

      <Grid container spacing={3}>
        {relatedPosts.map((post, idx) => (
          <Grid key={post.slug} size={{ xs: 12, sm: 6, md: 4 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <Paper
                onClick={() => router.push(`/new/${post.slug}`)}
                sx={{
                  borderRadius: 3,
                  overflow: "hidden",
                  cursor: "pointer",
                  height: "100%",
                  transition: "all 0.3s",
                  "&:hover": {
                    boxShadow: "0 12px 28px rgba(242,92,5,0.15)",
                  },
                }}
              >
                <Box sx={{ position: "relative", height: 160 }}>
                  <Image
                    src={post.thumbnail ?? post.image ?? ""}
                    alt={post.title}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                  {post.category && (
                    <Chip
                      label={post.category}
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 8,
                        left: 8,
                        bgcolor: "#f25c05",
                        color: "#fff",
                        fontWeight: 600,
                        zIndex: 2,
                      }}
                    />
                  )}
                </Box>
                <Box sx={{ p: 2 }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    sx={{
                      mb: 1,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      overflow: "hidden",
                    }}
                  >
                    {post.title}
                  </Typography>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={0.5}
                    sx={{ mb: 1 }}
                  >
                    <AccessTimeIcon sx={{ fontSize: 14, color: "#999" }} />
                    <Typography variant="caption" color="text.secondary">
                      {post.createdAt ? new Date(post.createdAt).toLocaleDateString("vi-VN") : ""}
                    </Typography>
                  </Stack>
                  <Button
                    size="small"
                    endIcon={<ArrowForwardIcon />}
                    sx={{ color: "#f25c05", p: 0 }}
                  >
                    Đọc tiếp
                  </Button>
                </Box>
              </Paper>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
