"use client";

import {
  Box,
  Button,
  Typography,
  Avatar,
  Rating,
  Stack,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  IconButton,
  Divider,
} from "@mui/material";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CloseIcon from "@mui/icons-material/Close";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { http, toApiError } from "@/lib/api/http";
import { useToast } from "@/lib/toast/ToastContext";
import type { Review } from "./ReviewCard";

interface Props {
  reviews: Review[];
  onUpdated: (updated: Review) => void;
  onDeleted: (deletedId: number) => void;
}

/**
 * Danh sách đánh giá của chính người dùng (tối đa 3).
 * Mỗi review có badge trạng thái duyệt + nút Sửa / Xóa.
 */
const UserReviewSection = ({ reviews, onUpdated, onDeleted }: Props) => {
  const { showToast } = useToast();

  // Edit state
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState("");
  const [editImages, setEditImages] = useState<File[]>([]);
  const [editError, setEditError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Delete state
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const openEdit = (r: Review) => {
    setEditingReview(r);
    setEditRating(r.rating);
    setEditComment(r.comment);
    setEditImages([]);
    setEditError(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length > 3) {
      setEditError("Tối đa 3 ảnh");
    } else {
      setEditImages(files);
      setEditError(null);
    }
  };

  const handleUpdate = async () => {
    if (!editingReview) return;
    if (!editComment.trim() || !editRating) {
      setEditError("Vui lòng nhập đủ thông tin");
      return;
    }
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("rating", String(editRating));
      formData.append("comment", editComment.trim());
      editImages.forEach((img) => formData.append("imageReviews", img));

      const res = await http.put<{ data: Review }>(
        `/api/v1/reviews/${editingReview.id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      setEditingReview(null);
      showToast("Đánh giá đã được cập nhật", "success");
      if (res?.data) onUpdated(res.data);
    } catch (err) {
      setEditError(toApiError(err).message || "Không thể cập nhật đánh giá.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (deletingId === null) return;
    setDeleting(true);
    try {
      await http.delete(`/api/v1/reviews/${deletingId}`);
      setDeletingId(null);
      showToast("Đã xoá đánh giá", "success");
      onDeleted(deletingId);
    } catch (err) {
      showToast(toApiError(err).message || "Không thể xoá đánh giá.", "error");
    } finally {
      setDeleting(false);
    }
  };

  if (reviews.length === 0) return null;

  return (
    <>
      <Stack spacing={2}>
        <AnimatePresence>
          {reviews.map((review, idx) => {
            const images = [review.image1, review.image2, review.image3].filter(Boolean) as string[];
            const displayName = review.authorName || review.createdBy?.split("@")[0] || "Bạn";

            return (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, delay: idx * 0.05 }}
              >
                <Box
                  sx={{
                    p: 2.5,
                    borderRadius: 2.5,
                    border: "1.5px solid",
                    borderColor: review.approved ? "#a5d6a7" : "#ffe082",
                    bgcolor: review.approved ? "#f9fbe7" : "#fffde7",
                    position: "relative",
                  }}
                >
                  {/* Status badge */}
                  <Chip
                    icon={
                      review.approved
                        ? <CheckCircleOutlineIcon sx={{ fontSize: "0.75rem !important" }} />
                        : <HourglassEmptyIcon sx={{ fontSize: "0.75rem !important" }} />
                    }
                    label={review.approved ? "Đã duyệt" : "Chờ duyệt"}
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      height: 22,
                      fontSize: "0.65rem",
                      bgcolor: review.approved ? "#c8e6c9" : "#fff9c4",
                      color: review.approved ? "#1b5e20" : "#f57f17",
                      border: "1px solid",
                      borderColor: review.approved ? "#a5d6a7" : "#ffcc02",
                      "& .MuiChip-icon": { color: review.approved ? "#2e7d32" : "#f57f17" },
                    }}
                  />

                  <Stack spacing={1.5}>
                    {/* Header */}
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar
                        src={review.authorAvatar || undefined}
                        sx={{ bgcolor: "#f25c05", width: 38, height: 38, fontSize: "0.85rem" }}
                      >
                        {displayName.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Stack direction="row" alignItems="center" spacing={0.75}>
                          <Typography fontWeight={600} fontSize="0.88rem">
                            {displayName}
                          </Typography>
                          <Typography fontSize="0.75rem" color="text.secondary">
                            · Lần {idx + 1}
                          </Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Rating value={review.rating} readOnly size="small" />
                          <Typography fontSize="0.72rem" color="text.secondary">
                            {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                          </Typography>
                        </Stack>
                      </Box>
                    </Stack>

                    {/* Comment */}
                    <Typography
                      variant="body2"
                      sx={{ whiteSpace: "pre-line", lineHeight: 1.65, pr: 6 }}
                    >
                      {review.comment}
                    </Typography>

                    {/* Images */}
                    {images.length > 0 && (
                      <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                        {images.map((img, i) => (
                          <Box
                            key={i}
                            component="img"
                            src={img}
                            sx={{
                              width: 64,
                              height: 64,
                              borderRadius: 1.5,
                              objectFit: "cover",
                              border: "1px solid #ddd",
                            }}
                          />
                        ))}
                      </Stack>
                    )}

                    {/* Actions */}
                    <Stack direction="row" spacing={1} pt={0.25}>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<EditOutlinedIcon sx={{ fontSize: "0.9rem" }} />}
                        onClick={() => openEdit(review)}
                        sx={{
                          textTransform: "none",
                          borderRadius: 1.5,
                          fontSize: "0.75rem",
                          py: 0.4,
                          borderColor: "#1976d2",
                          color: "#1976d2",
                          "&:hover": { bgcolor: "#e3f2fd" },
                        }}
                      >
                        Sửa
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<DeleteOutlineIcon sx={{ fontSize: "0.9rem" }} />}
                        onClick={() => setDeletingId(review.id)}
                        sx={{
                          textTransform: "none",
                          borderRadius: 1.5,
                          fontSize: "0.75rem",
                          py: 0.4,
                          borderColor: "#e53935",
                          color: "#e53935",
                          "&:hover": { bgcolor: "#ffebee" },
                        }}
                      >
                        Xóa
                      </Button>
                    </Stack>
                  </Stack>
                </Box>

                {idx < reviews.length - 1 && <Divider sx={{ mt: 1 }} />}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </Stack>

      {/* Edit Dialog */}
      <Dialog
        open={!!editingReview}
        onClose={() => setEditingReview(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography fontWeight={700}>Sửa đánh giá</Typography>
          <IconButton onClick={() => setEditingReview(null)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} mt={1}>
            {editError && (
              <Alert severity="error" onClose={() => setEditError(null)}>
                {editError}
              </Alert>
            )}
            <Box>
              <Typography variant="body2" fontWeight={500} gutterBottom>
                Đánh giá sao
              </Typography>
              <Rating value={editRating} onChange={(_, v) => setEditRating(v || 0)} size="large" />
            </Box>
            <TextField
              label="Nhận xét"
              value={editComment}
              onChange={(e) => setEditComment(e.target.value)}
              multiline
              rows={4}
              fullWidth
            />
            <Box>
              <Typography variant="body2" fontWeight={500} gutterBottom>
                Thay ảnh mới (để trống = giữ ảnh cũ, tối đa 3)
              </Typography>
              <Button variant="outlined" component="label" size="small">
                Chọn ảnh
                <input hidden type="file" accept="image/*" multiple onChange={handleImageChange} />
              </Button>
              {editImages.length > 0 && (
                <Stack direction="row" spacing={1} mt={1} flexWrap="wrap" gap={1}>
                  {editImages.map((f, i) => (
                    <Box
                      key={i}
                      component="img"
                      src={URL.createObjectURL(f)}
                      sx={{ width: 60, height: 60, objectFit: "cover", borderRadius: 1.5, border: "1px solid #ccc" }}
                    />
                  ))}
                </Stack>
              )}
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setEditingReview(null)} disabled={saving}>
            Huỷ
          </Button>
          <Button
            variant="contained"
            onClick={handleUpdate}
            disabled={saving}
            sx={{ bgcolor: "#f25c05", "&:hover": { bgcolor: "#e64a19" } }}
          >
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={deletingId !== null} onClose={() => setDeletingId(null)} maxWidth="xs">
        <DialogTitle>
          <Typography fontWeight={700}>Xoá đánh giá?</Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Đánh giá này sẽ bị xoá vĩnh viễn và không thể khôi phục.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setDeletingId(null)} disabled={deleting}>
            Huỷ
          </Button>
          <Button variant="contained" color="error" onClick={handleDelete} disabled={deleting}>
            {deleting ? "Đang xoá..." : "Xoá"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserReviewSection;
