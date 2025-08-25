"use client";

import React, { useMemo, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  InputAdornment,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import Grid from "@mui/material/Grid"; 
import SearchIcon from "@mui/icons-material/Search";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { categories, newsPosts } from "./data";

const containerVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const cardHover = { translateY: -5, boxShadow: "0px 8px 15px rgba(0,0,0,0.1)" };

export default function NewsListView() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");

  const filteredPosts = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    return newsPosts.filter((i) => i.title.toLowerCase().includes(q));
  }, [keyword]);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <Box px={{ xs: 1, md: 2 }} py={4}>
        <Typography variant="h4" fontWeight="bold" mb={3}>
          Tin tức
        </Typography>

        <TextField
          fullWidth
          size="small"
          placeholder="Tìm kiếm bài viết..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: 500, mb: 4 }}
        />

        <Grid container spacing={4}>
          {/* Main content */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Grid container spacing={2}>
              {filteredPosts.map((post) => (
                <Grid key={post.slug} size={{ xs: 12, sm: 6 }}>
                  <motion.div
                    whileHover={cardHover}
                    style={{ borderRadius: 8 }}
                  >
                    <Paper
                      onClick={() => router.push(`/news/${post.slug}`)}
                      sx={{ p: 2, borderRadius: 2, cursor: "pointer" }}
                      elevation={3}
                    >
                      <Box mb={1}>
                        <Image
                          src={post.image}
                          alt={post.title}
                          width={400}
                          height={180}
                          style={{
                            width: "100%",
                            height: 180,
                            objectFit: "cover",
                            borderRadius: 8,
                          }}
                        />
                      </Box>
                      <Typography fontWeight={600} fontSize={16} gutterBottom>
                        {post.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {post.date}
                      </Typography>
                    </Paper>
                  </motion.div>
                </Grid>
              ))}
              {filteredPosts.length === 0 && (
                <Typography pl={2}>Không tìm thấy bài viết phù hợp.</Typography>
              )}
            </Grid>
          </Grid>

          {/* Sidebar */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper elevation={3} sx={{ p: 2, mb: 4 }}>
              <Typography
                variant="h6"
                fontWeight="bold"
                color="warning.main"
                gutterBottom
              >
                Danh mục tin tức
              </Typography>
              {categories.map((cat) => (
                <ListItemButton
                  key={cat.path}
                  onClick={() => router.push(cat.path)}
                  component={motion.div}
                  whileHover={{ backgroundColor: "#fff8e1", x: 4 }}
                  sx={{ borderRadius: 1, px: 1 }}
                >
                  <ListItemText primary={cat.name} />
                </ListItemButton>
              ))}
            </Paper>

            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography
                variant="h6"
                fontWeight="bold"
                color="warning.main"
                mb={2}
              >
                Tin mới nhất
              </Typography>

              {newsPosts.slice(0, 5).map((item) => (
                <motion.div
                  key={item.slug}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{
                    x: 4,
                    backgroundColor: "#fff8e1",
                    boxShadow: "0px 4px 10px rgba(0,0,0,0.08)",
                  }}
                  transition={{ duration: 0.2 }}
                  style={{ borderRadius: 8 }}
                >
                  <Box
                    display="flex"
                    gap={1.5}
                    mb={2}
                    sx={{ cursor: "pointer", p: 1, borderRadius: 2 }}
                    onClick={() => router.push(`/news/${item.slug}`)}
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={60}
                      height={60}
                      style={{
                        borderRadius: 6,
                        objectFit: "cover",
                        flexShrink: 0,
                      }}
                    />
                    <Box>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        sx={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {item.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.date}
                      </Typography>
                    </Box>
                  </Box>
                </motion.div>
              ))}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </motion.div>
  );
}
