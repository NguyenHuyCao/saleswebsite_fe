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
} from "@mui/material";
import { useState } from "react";
import { http, toApiError } from "@/lib/api/http";
import { getAccessToken } from "@/lib/api/token";

interface Props {
  productId: number;
  onSuccess: () => void;
}

const ReviewForm = ({ productId, onSuccess }: Props) => {
  const [rating, setRating] = useState<number | null>(0);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    if (files.length > 3) {
      setError("Chỉ được tải tối đa 3 ảnh.");
    } else {
      setImages(files);
      setError(null);
    }
  };

  const handleSubmit = async () => {
    const token = getAccessToken(); // chỉ để kiểm tra đăng nhập
    if (!token || !rating || !comment.trim()) {
      setError("Vui lòng nhập đầy đủ thông tin và đăng nhập.");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("rating", String(rating));
      formData.append("comment", comment.trim());
      images.forEach((img) => formData.append("imageReviews", img));

      // Gọi qua Axios singleton; Authorization sẽ tự gắn từ interceptor
      await http.post(`/api/v1/reviews/${productId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Reset form
      setComment("");
      setImages([]);
      setRating(0);
      setError(null);
      onSuccess();
    } catch (err) {
      setError(
        toApiError(err).message || "Không thể gửi đánh giá, vui lòng thử lại."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3, bgcolor: "#f9f9f9" }}>
      <Stack spacing={2}>
        {error && <Alert severity="error">{error}</Alert>}
        <Rating value={rating} onChange={(_, v) => setRating(v)} />
        <TextField
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          multiline
          rows={3}
          placeholder="Nội dung đánh giá"
        />
        <Button component="label" variant="outlined" disabled={submitting}>
          Tải ảnh (tối đa 3)
          <input
            hidden
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />
        </Button>
        <Typography fontSize={13}>{images.length} ảnh được chọn</Typography>
        <Box display="flex" gap={1} flexWrap="wrap">
          {images.map((file, idx) => (
            <Box
              key={idx}
              component="img"
              src={URL.createObjectURL(file)}
              sx={{
                width: 60,
                height: 60,
                objectFit: "cover",
                borderRadius: 1,
                border: "1px solid #ccc",
              }}
              alt={`preview-${idx}`}
            />
          ))}
        </Box>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? "Đang gửi..." : "Gửi đánh giá"}
        </Button>
      </Stack>
    </Paper>
  );
};

export default ReviewForm;
