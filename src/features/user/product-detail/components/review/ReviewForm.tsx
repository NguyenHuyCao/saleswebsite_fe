"use client";

import {
  Alert,
  Button,
  Paper,
  Rating,
  Stack,
  TextField,
  Typography,
  Box,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import { http, toApiError } from "@/lib/api/http";
import { useToast } from "@/lib/toast/ToastContext";
import { getAccessToken } from "@/lib/api/token";
import CloseIcon from "@mui/icons-material/Close";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  productId: number;
  onSuccess: () => void;
}

const ReviewForm = ({ productId, onSuccess }: Props) => {
  const { showToast } = useToast();
  const [rating, setRating] = useState<number | null>(0);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    if (files.length + images.length > 3) {
      setError("Chỉ được tải tối đa 3 ảnh.");
    } else {
      setImages([...images, ...files]);
      setError(null);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const token = getAccessToken();
    if (!token) {
      setError("Vui lòng đăng nhập để đánh giá.");
      return;
    }
    if (!rating) {
      setError("Vui lòng chọn số sao.");
      return;
    }
    if (!comment.trim()) {
      setError("Vui lòng nhập nội dung đánh giá.");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("rating", String(rating));
      formData.append("comment", comment.trim());
      images.forEach((img) => formData.append("imageReviews", img));

      await http.post(`/api/v1/products/${productId}/reviews`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setComment("");
      setImages([]);
      setRating(0);
      setError(null);
      showToast("Đánh giá của bạn đã được gửi thành công!", "success", "Đánh giá");
      onSuccess();
    } catch (err) {
      setError(toApiError(err).message || "Không thể gửi đánh giá.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Paper
        sx={{
          p: 3,
          mb: 3,
          bgcolor: "#f9f9f9",
          border: "1px solid #f0f0f0",
        }}
      >
        <Stack spacing={2.5}>
          <Typography variant="subtitle1" fontWeight={600}>
            Viết đánh giá của bạn
          </Typography>

          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <Box>
            <Typography variant="body2" gutterBottom>
              Đánh giá của bạn
            </Typography>
            <Rating
              value={rating}
              onChange={(_, v) => setRating(v)}
              size="large"
            />
          </Box>

          <TextField
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            multiline
            rows={4}
            placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
            fullWidth
            variant="outlined"
          />

          <Box>
            <Typography variant="body2" gutterBottom>
              Hình ảnh (tối đa 3 ảnh)
            </Typography>
            <Button
              component="label"
              variant="outlined"
              disabled={submitting || images.length >= 3}
              sx={{ mb: 1 }}
            >
              {images.length >= 3 ? "Đã đủ 3 ảnh" : "Chọn ảnh"}
              <input
                hidden
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
              />
            </Button>

            <AnimatePresence>
              {images.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Typography
                    fontSize={13}
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    {images.length} ảnh được chọn
                  </Typography>
                  <Box display="flex" gap={1} flexWrap="wrap">
                    {images.map((file, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        style={{ position: "relative" }}
                      >
                        <Box
                          component="img"
                          src={URL.createObjectURL(file)}
                          sx={{
                            width: 80,
                            height: 80,
                            objectFit: "cover",
                            borderRadius: 2,
                            border: "1px solid #ccc",
                          }}
                          alt={`preview-${idx}`}
                        />
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveImage(idx)}
                          sx={{
                            position: "absolute",
                            top: -8,
                            right: -8,
                            bgcolor: "#f44336",
                            color: "#fff",
                            width: 20,
                            height: 20,
                            "&:hover": { bgcolor: "#d32f2f" },
                          }}
                        >
                          <CloseIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                      </motion.div>
                    ))}
                  </Box>
                </motion.div>
              )}
            </AnimatePresence>
          </Box>

          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={submitting}
            sx={{
              bgcolor: "#f25c05",
              color: "#fff",
              py: 1.2,
              "&:hover": { bgcolor: "#e64a19" },
              "&.Mui-disabled": { bgcolor: "#f0f0f0" },
            }}
          >
            {submitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Gửi đánh giá"
            )}
          </Button>
        </Stack>
      </Paper>

    </>
  );
};

export default ReviewForm;
