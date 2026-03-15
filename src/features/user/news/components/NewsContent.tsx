// features/user/new/components/NewsContent.tsx
"use client";

import { Box, Typography, Paper, Divider, Chip } from "@mui/material";
import { motion } from "framer-motion";
import type { NewsPost } from "../types";

interface Props {
  post: NewsPost;
}

export default function NewsContent({ post }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <Paper elevation={0} sx={{ p: 3, borderRadius: 4 }}>
        <Typography
          variant="body1"
          sx={{
            lineHeight: 1.8,
            fontSize: "1.1rem",
            color: "#333",
            "& p": { mb: 2 },
            "& h2": {
              fontSize: "1.5rem",
              fontWeight: 700,
              mt: 3,
              mb: 2,
              color: "#f25c05",
            },
            "& h3": {
              fontSize: "1.3rem",
              fontWeight: 600,
              mt: 2,
              mb: 1.5,
            },
            "& img": {
              maxWidth: "100%",
              height: "auto",
              borderRadius: 2,
              my: 2,
            },
            "& blockquote": {
              borderLeft: "4px solid #f25c05",
              bgcolor: "#f5f5f5",
              p: 2,
              fontStyle: "italic",
              my: 2,
            },
          }}
        >
          {/* Render HTML content safely */}
          <div dangerouslySetInnerHTML={{ __html: post.content || "" }} />
        </Typography>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <>
            <Divider sx={{ my: 3 }} />
            <Box>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Chủ đề liên quan:
              </Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {post.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    sx={{
                      bgcolor: "#f5f5f5",
                      "&:hover": { bgcolor: "#ffb700" },
                      cursor: "pointer",
                    }}
                  />
                ))}
              </Box>
            </Box>
          </>
        )}
      </Paper>
    </motion.div>
  );
}
