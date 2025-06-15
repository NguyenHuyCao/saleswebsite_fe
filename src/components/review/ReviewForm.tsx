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

interface Props {
  productId: number;
  onSuccess: () => void;
}

const ReviewForm = ({ productId, onSuccess }: Props) => {
  const [rating, setRating] = useState<number | null>(0);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

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
    const token = localStorage.getItem("accessToken");
    if (!token || !rating || !comment.trim()) {
      setError("Vui lòng nhập đầy đủ thông tin và đăng nhập.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("rating", String(rating));
      formData.append("comment", comment.trim());
      images.forEach((img) => formData.append("imageReviews", img));

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/reviews/${productId}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );
      if (!res.ok) throw new Error();

      setComment("");
      setImages([]);
      setRating(0);
      setError(null);
      onSuccess();
    } catch {
      setError("Không thể gửi đánh giá, vui lòng thử lại.");
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
        <Button component="label" variant="outlined">
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
        <Box display="flex" gap={1}>
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
            />
          ))}
        </Box>
        <Button variant="contained" onClick={handleSubmit}>
          Gửi đánh giá
        </Button>
      </Stack>
    </Paper>
  );
};

export default ReviewForm;
