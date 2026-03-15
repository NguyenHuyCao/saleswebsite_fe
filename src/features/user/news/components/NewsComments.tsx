// features/user/new/components/NewsComments.tsx
"use client";

import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Avatar,
  Stack,
  Divider,
  Rating,
} from "@mui/material";
import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  postId?: number;
}

export default function NewsComments({ postId }: Props) {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<any[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setComments([
      ...comments,
      {
        id: Date.now(),
        author: "Nguyễn Văn A",
        content: comment,
        date: new Date().toLocaleDateString("vi-VN"),
        avatar: "/images/authors/default.jpg",
      },
    ]);
    setComment("");
  };

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 4, my: 3 }}>
      <Typography variant="h6" fontWeight={700} gutterBottom>
        Bình luận ({comments.length})
      </Typography>

      {/* Comment Form */}
      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
        <TextField
          fullWidth
          multiline
          rows={3}
          placeholder="Viết bình luận của bạn..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button
          type="submit"
          variant="contained"
          sx={{
            bgcolor: "#f25c05",
            color: "#fff",
            "&:hover": { bgcolor: "#e64a19" },
          }}
        >
          Gửi bình luận
        </Button>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Comments List */}
      <Stack spacing={3}>
        {comments.map((cmt, idx) => (
          <motion.div
            key={cmt.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Stack direction="row" spacing={2}>
              <Avatar src={cmt.avatar}>{cmt.author.charAt(0)}</Avatar>
              <Box sx={{ flex: 1 }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  sx={{ mb: 0.5 }}
                >
                  <Typography fontWeight={600}>{cmt.author}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {cmt.date}
                  </Typography>
                </Stack>
                <Typography variant="body2">{cmt.content}</Typography>
              </Box>
            </Stack>
          </motion.div>
        ))}
      </Stack>
    </Paper>
  );
}
