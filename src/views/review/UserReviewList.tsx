"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Avatar,
  Rating,
  Divider,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from "@mui/material";
import { http, toApiError, type ApiEnvelope } from "@/lib/api/http";
import { getAccessToken } from "@/lib/api/token";

interface Review {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  image1?: string | null;
  image2?: string | null;
  image3?: string | null;
}

interface Props {
  productId: number;
}

const UserReviewList = ({ productId }: Props) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [updatedRating, setUpdatedRating] = useState<number>(0);
  const [updatedComment, setUpdatedComment] = useState("");
  const [updatedImages, setUpdatedImages] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchUserReviews = async () => {
    // Không dùng cookie; nếu chưa đăng nhập thì thôi
    if (!getAccessToken()) return;
    try {
      const res = await http.get<ApiEnvelope<Review[]>>(
        `/api/v1/reviews/user/${productId}`
      );
      setReviews(res.data?.data ?? []);
    } catch (err) {
      console.error("Lỗi khi lấy đánh giá người dùng:", err);
    }
  };

  useEffect(() => {
    fetchUserReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const handleEditClick = (review: Review) => {
    setSelectedReview(review);
    setUpdatedRating(review.rating);
    setUpdatedComment(review.comment);
    setUpdatedImages([]);
    setError(null);
    setOpenEdit(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length > 3) {
      setError("Chỉ được tải lên tối đa 3 ảnh");
    } else {
      setUpdatedImages(files);
      setError(null);
    }
  };

  const handleUpdate = async () => {
    if (!getAccessToken() || !selectedReview) return;

    if (!updatedComment.trim() || !updatedRating) {
      setError("Vui lòng nhập đủ thông tin");
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("comment", updatedComment.trim());
      formData.append("rating", String(updatedRating));
      updatedImages.forEach((img) => formData.append("imageReviews", img));

      // Dùng http.put; interceptor tự gắn Bearer từ localStorage
      await http.put(`/api/v1/reviews/${selectedReview.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setOpenEdit(false);
      await fetchUserReviews();
    } catch (err) {
      setError(toApiError(err).message || "Không thể cập nhật đánh giá.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box mt={6}>
      <Typography variant="h6" fontWeight={700} mb={2}>
        Đánh giá của bạn
      </Typography>

      {reviews.length === 0 ? (
        <Typography color="text.secondary">
          Bạn chưa có đánh giá nào cho sản phẩm này.
        </Typography>
      ) : (
        <Stack spacing={3}>
          {reviews.map((review) => (
            <Box key={review.id}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar>
                  {review?.createdAt?.charAt(0).toUpperCase() || "A"}
                </Avatar>
                <Box>
                  <Rating value={review.rating} readOnly size="small" />
                  <Typography variant="body2" color="text.secondary">
                    {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                  </Typography>
                </Box>
              </Stack>

              <Typography mt={1.5}>{review.comment}</Typography>

              <Stack direction="row" spacing={2} mt={1}>
                {[review.image1, review.image2, review.image3]
                  .filter(Boolean)
                  .map((img, idx) => (
                    <Box
                      key={idx}
                      component="img"
                      src={img || undefined}
                      alt={`Hình ảnh ${idx + 1}`}
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: 1,
                        objectFit: "cover",
                        border: "1px solid #ccc",
                      }}
                    />
                  ))}
              </Stack>

              <Box mt={1}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handleEditClick(review)}
                >
                  Sửa
                </Button>
              </Box>

              <Divider sx={{ mt: 2 }} />
            </Box>
          ))}
        </Stack>
      )}

      <Dialog
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Cập nhật đánh giá</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            {error && <Alert severity="error">{error}</Alert>}
            <Rating
              value={updatedRating}
              onChange={(_, v) => setUpdatedRating(v || 0)}
            />
            <TextField
              value={updatedComment}
              multiline
              rows={3}
              onChange={(e) => setUpdatedComment(e.target.value)}
              placeholder="Cập nhật nhận xét"
              fullWidth
            />
            <Button variant="outlined" component="label">
              Tải lại ảnh (tối đa 3)
              <input
                hidden
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
              />
            </Button>
            <Typography variant="body2" color="text.secondary">
              {updatedImages.length} ảnh được chọn
            </Typography>
            <Box display="flex" gap={1}>
              {updatedImages.map((file, idx) => (
                <Box
                  key={idx}
                  component="img"
                  src={URL.createObjectURL(file)}
                  alt={`Ảnh cập nhật ${idx + 1}`}
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
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)} disabled={saving}>
            Huỷ
          </Button>
          <Button variant="contained" onClick={handleUpdate} disabled={saving}>
            {saving ? "Đang lưu..." : "Lưu"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserReviewList;
