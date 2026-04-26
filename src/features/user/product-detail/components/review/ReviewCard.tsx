"use client";

import {
  Box,
  Typography,
  Avatar,
  Stack,
  Rating,
  Button,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
  Zoom,
} from "@mui/material";
import { useState } from "react";
import { motion } from "framer-motion";
import CloseIcon from "@mui/icons-material/Close";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import VerifiedIcon from "@mui/icons-material/Verified";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import { http } from "@/lib/api/http";

export interface Review {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  createdBy: string;
  authorName?: string;
  authorAvatar?: string | null;
  userId?: number;
  image1?: string | null;
  image2?: string | null;
  image3?: string | null;
  approved: boolean;
  verifiedPurchase?: boolean;
  helpfulCount?: number;
}

interface Props {
  review: Review;
  isAdmin: boolean;
  currentUserId?: number | null;
  onToggleApproval: (id: number) => void;
  onHelpfulToggled?: (updated: Review) => void;
}

const ReviewCard = ({
  review,
  isAdmin,
  currentUserId,
  onToggleApproval,
  onHelpfulToggled,
}: Props) => {
  const [openImage, setOpenImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [helpfulLoading, setHelpfulLoading] = useState(false);

  const images = [review.image1, review.image2, review.image3].filter(
    Boolean,
  ) as string[];

  // Tên hiển thị: ưu tiên authorName, fallback ẩn email (chỉ dùng phần trước @)
  const displayName =
    review.authorName ||
    (review.createdBy?.includes("@")
      ? review.createdBy.split("@")[0]
      : review.createdBy) ||
    "Khách hàng";

  const avatarLetter = displayName.charAt(0).toUpperCase();

  const handleImageClick = (img: string, index: number) => {
    setSelectedImage(img);
    setImageIndex(index);
    setOpenImage(true);
  };

  const handlePrevImage = () => {
    const newIndex = (imageIndex - 1 + images.length) % images.length;
    setImageIndex(newIndex);
    setSelectedImage(images[newIndex]);
  };

  const handleNextImage = () => {
    const newIndex = (imageIndex + 1) % images.length;
    setImageIndex(newIndex);
    setSelectedImage(images[newIndex]);
  };

  const handleHelpful = async () => {
    if (!currentUserId || helpfulLoading) return;
    setHelpfulLoading(true);
    try {
      const res = await http.post<Review>(
        `/api/v1/reviews/${review.id}/helpful`,
      );
      if (onHelpfulToggled && res?.data) {
        onHelpfulToggled(res.data);
      }
    } catch {
      // silently fail
    } finally {
      setHelpfulLoading(false);
    }
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  return (
    <>
      <Box
        sx={{
          p: 3,
          borderRadius: 3,
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
          transition: "all 0.25s",
          "&:hover": {
            borderColor: "#ffb700",
            boxShadow: "0 4px 16px rgba(242,92,5,0.08)",
          },
        }}
      >
        <Stack spacing={2}>
          {/* Header */}
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <Avatar
              src={review.authorAvatar || undefined}
              sx={{ bgcolor: "#f25c05", width: 44, height: 44, fontSize: "1rem", flexShrink: 0 }}
            >
              {avatarLetter}
            </Avatar>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
                flexWrap="wrap"
                gap={0.5}
              >
                <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
                  <Typography fontWeight={600} fontSize="0.95rem" noWrap>
                    {displayName}
                  </Typography>
                  {review.verifiedPurchase && (
                    <Chip
                      icon={<VerifiedIcon sx={{ fontSize: "0.75rem !important" }} />}
                      label="Đã mua hàng"
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: "0.65rem",
                        bgcolor: "#e8f5e9",
                        color: "#2e7d32",
                        border: "1px solid #a5d6a7",
                        "& .MuiChip-icon": { color: "#2e7d32" },
                      }}
                    />
                  )}
                  {!review.approved && isAdmin && (
                    <Chip
                      label="Chờ duyệt"
                      size="small"
                      color="warning"
                      sx={{ height: 20, fontSize: "0.65rem" }}
                    />
                  )}
                </Stack>

                <Typography fontSize="0.78rem" color="text.secondary" flexShrink={0}>
                  {formatDate(review.createdAt)}
                </Typography>
              </Stack>

              <Rating value={review.rating} readOnly size="small" sx={{ mt: 0.5 }} />
            </Box>
          </Stack>

          {/* Comment */}
          <Typography
            variant="body2"
            sx={{ whiteSpace: "pre-line", color: "text.primary", lineHeight: 1.7 }}
          >
            {review.comment}
          </Typography>

          {/* Images */}
          {images.length > 0 && (
            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
              {images.map((img, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <Tooltip title="Xem ảnh">
                    <Box
                      component="img"
                      src={img}
                      onClick={() => handleImageClick(img, idx)}
                      sx={{
                        width: 72,
                        height: 72,
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: "divider",
                        objectFit: "cover",
                        cursor: "pointer",
                        transition: "border-color 0.2s",
                        "&:hover": { borderColor: "#f25c05" },
                      }}
                    />
                  </Tooltip>
                </motion.div>
              ))}
            </Stack>
          )}

          {/* Footer: Helpful + Admin */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            gap={1}
          >
            {/* Nút hữu ích */}
            <Tooltip
              title={!currentUserId ? "Đăng nhập để đánh dấu hữu ích" : ""}
            >
              <span>
                <Button
                  size="small"
                  variant="text"
                  disabled={!currentUserId || helpfulLoading}
                  onClick={handleHelpful}
                  startIcon={
                    (review.helpfulCount ?? 0) > 0 ? (
                      <ThumbUpAltIcon sx={{ fontSize: "1rem" }} />
                    ) : (
                      <ThumbUpAltOutlinedIcon sx={{ fontSize: "1rem" }} />
                    )
                  }
                  sx={{
                    color: "text.secondary",
                    fontSize: "0.78rem",
                    textTransform: "none",
                    px: 1,
                    "&:hover": { color: "#f25c05", bgcolor: "transparent" },
                  }}
                >
                  Hữu ích{" "}
                  {(review.helpfulCount ?? 0) > 0 && `(${review.helpfulCount})`}
                </Button>
              </span>
            </Tooltip>

            {/* Admin Actions */}
            {isAdmin && (
              <Button
                size="small"
                variant="outlined"
                color={review.approved ? "error" : "success"}
                onClick={() => setConfirmDialog(true)}
                startIcon={
                  review.approved ? <VisibilityOffIcon /> : <CheckCircleIcon />
                }
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  fontSize: "0.78rem",
                }}
              >
                {review.approved ? "Ẩn đánh giá" : "Duyệt đánh giá"}
              </Button>
            )}
          </Stack>
        </Stack>
      </Box>

      {/* Confirm Dialog */}
      <Dialog
        open={confirmDialog}
        onClose={() => setConfirmDialog(false)}
        maxWidth="xs"
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography fontWeight={700}>
            {review.approved ? "Ẩn đánh giá?" : "Duyệt đánh giá?"}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            {review.approved
              ? "Đánh giá sẽ không còn hiển thị công khai. Bạn có chắc chắn?"
              : "Đánh giá sẽ được hiển thị công khai. Bạn có chắc chắn?"}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setConfirmDialog(false)}>Hủy</Button>
          <Button
            variant="contained"
            color={review.approved ? "error" : "success"}
            onClick={() => {
              onToggleApproval(review.id);
              setConfirmDialog(false);
            }}
          >
            {review.approved ? "Ẩn" : "Duyệt"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Image Zoom Modal */}
      <Dialog
        open={openImage}
        onClose={() => setOpenImage(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{ sx: { bgcolor: "rgba(0,0,0,0.95)", color: "#fff" } }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
          <IconButton onClick={() => setOpenImage(false)} sx={{ color: "#fff" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
        >
          {images.length > 1 && (
            <>
              <IconButton
                onClick={handlePrevImage}
                sx={{
                  position: "absolute",
                  left: 16,
                  color: "#fff",
                  bgcolor: "rgba(0,0,0,0.5)",
                  "&:hover": { bgcolor: "rgba(242,92,5,0.8)" },
                }}
              >
                <NavigateBeforeIcon />
              </IconButton>
              <IconButton
                onClick={handleNextImage}
                sx={{
                  position: "absolute",
                  right: 16,
                  color: "#fff",
                  bgcolor: "rgba(0,0,0,0.5)",
                  "&:hover": { bgcolor: "rgba(242,92,5,0.8)" },
                }}
              >
                <NavigateNextIcon />
              </IconButton>
            </>
          )}
          <Zoom in={true}>
            <Box
              component="img"
              src={selectedImage || ""}
              sx={{ maxWidth: "100%", maxHeight: "70vh", objectFit: "contain" }}
            />
          </Zoom>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Typography variant="body2" sx={{ color: "#fff" }}>
            {imageIndex + 1} / {images.length}
          </Typography>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ReviewCard;
