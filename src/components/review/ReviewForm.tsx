"use client";

import React, { useState } from "react";
import {
  Rating,
  TextField,
  Button,
  Stack,
  Typography,
  Alert,
  Box,
} from "@mui/material";

interface ReviewFormProps {
  productId: number;
  onSuccess: () => void;
}

export const ReviewForm = ({ productId, onSuccess }: ReviewFormProps) => {
  const [rating, setRating] = useState<number | null>(0);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length + images.length > 3) {
      setError("Chỉ được tải lên tối đa 3 ảnh.");
      return;
    }
    setImages((prev) => [...prev, ...selectedFiles]);
    setError(null);
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token || !rating || !comment.trim()) {
      setError("Vui lòng điền đầy đủ thông tin và đăng nhập.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("rating", String(rating));
      formData.append("comment", comment);
      images.forEach((img) => formData.append("imageReviews", img));

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/reviews/${productId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Lỗi khi gửi đánh giá");

      // Reset form sau khi gửi
      setRating(0);
      setComment("");
      setImages([]);
      setError(null);
      onSuccess();
    } catch (err) {
      setError("Không thể gửi đánh giá. Vui lòng thử lại.");
      console.log(err);
    }
  };

  return (
    <Stack spacing={2}>
      <Typography fontWeight={600}>Gửi đánh giá của bạn</Typography>
      {error && <Alert severity="error">{error}</Alert>}

      <Rating
        value={rating}
        onChange={(_, newValue) => setRating(newValue)}
        size="large"
      />

      <TextField
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        multiline
        rows={3}
        placeholder="Nội dung đánh giá"
        fullWidth
      />

      <Box>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          multiple
          style={{ display: "none" }}
          onChange={handleImageChange}
        />
        <label htmlFor="image-upload">
          <Button variant="outlined" component="span">
            Chọn tối đa 3 ảnh minh hoạ
          </Button>
        </label>
      </Box>

      {images.length > 0 && (
        <Stack direction="row" spacing={2}>
          {images.map((file, index) => (
            <Box key={index} position="relative">
              <Box
                component="img"
                src={URL.createObjectURL(file)}
                alt={`preview-${index}`}
                sx={{
                  width: 80,
                  height: 80,
                  objectFit: "cover",
                  borderRadius: 1,
                  border: "1px solid #ccc",
                }}
              />
              <Button
                size="small"
                onClick={() => handleRemoveImage(index)}
                sx={{
                  position: "absolute",
                  top: -8,
                  right: -8,
                  minWidth: "unset",
                  padding: "2px",
                  fontSize: "0.75rem",
                }}
                color="error"
              >
                ✕
              </Button>
            </Box>
          ))}
        </Stack>
      )}

      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Gửi đánh giá
      </Button>
    </Stack>
  );
};
