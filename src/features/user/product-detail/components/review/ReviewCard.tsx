"use client";

import {
  Box,
  Typography,
  Avatar,
  Stack,
  Rating,
  Divider,
  Button,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
  Zoom,
  Paper,
} from "@mui/material";
import { useState } from "react";
import { motion } from "framer-motion";
import CloseIcon from "@mui/icons-material/Close";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface Review {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  createdBy: string;
  image1?: string | null;
  image2?: string | null;
  image3?: string | null;
  approved: boolean;
}

interface Props {
  review: Review;
  userEmail: string | null;
  onToggleApproval: (id: number) => void;
}

const ReviewCard = ({ review, userEmail, onToggleApproval }: Props) => {
  const [openImage, setOpenImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [confirmDialog, setConfirmDialog] = useState(false);

  const images = [review.image1, review.image2, review.image3].filter(
    Boolean,
  ) as string[];

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

  const handleToggleConfirm = () => {
    if (userEmail === "admin@gmail.com") {
      setConfirmDialog(true);
    } else {
      onToggleApproval(review.id);
    }
  };

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          bgcolor: "#fff",
          border: "1px solid #f0f0f0",
          transition: "all 0.3s",
          "&:hover": {
            borderColor: "#ffb700",
            boxShadow: "0 4px 12px rgba(242,92,5,0.1)",
          },
        }}
      >
        <Stack spacing={2}>
          {/* Header - User Info */}
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              sx={{
                bgcolor: "#f25c05",
                width: 48,
                height: 48,
                fontSize: "1.2rem",
              }}
            >
              {review.createdBy.charAt(0).toUpperCase()}
            </Avatar>

            <Box sx={{ flex: 1 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                flexWrap="wrap"
                gap={1}
              >
                <Typography fontWeight={600} fontSize="1rem">
                  {review.createdBy}
                </Typography>

                <Typography fontSize="0.8rem" color="text.secondary">
                  {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                </Typography>
              </Stack>

              <Stack direction="row" alignItems="center" spacing={1}>
                <Rating value={review.rating} readOnly size="small" />
                {!review.approved && userEmail === "admin@gmail.com" && (
                  <Chip
                    label="Chờ duyệt"
                    size="small"
                    color="warning"
                    sx={{ height: 20, fontSize: "0.6rem" }}
                  />
                )}
              </Stack>
            </Box>
          </Stack>

          {/* Comment */}
          <Typography
            variant="body2"
            sx={{
              whiteSpace: "pre-line",
              color: "#333",
              lineHeight: 1.6,
            }}
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
                        width: 70,
                        height: 70,
                        borderRadius: 2,
                        border: "1px solid #e0e0e0",
                        objectFit: "cover",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        "&:hover": {
                          borderColor: "#f25c05",
                        },
                      }}
                    />
                  </Tooltip>
                </motion.div>
              ))}
            </Stack>
          )}

          {/* Admin Actions */}
          {userEmail === "admin@gmail.com" && (
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                size="small"
                variant="outlined"
                color={review.approved ? "error" : "success"}
                onClick={handleToggleConfirm}
                startIcon={
                  review.approved ? <VisibilityOffIcon /> : <CheckCircleIcon />
                }
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  borderColor: review.approved ? "#f44336" : "#4caf50",
                  color: review.approved ? "#f44336" : "#4caf50",
                  "&:hover": {
                    borderColor: review.approved ? "#d32f2f" : "#388e3c",
                    bgcolor: review.approved ? "#ffebee" : "#e8f5e9",
                  },
                }}
              >
                {review.approved ? "Ẩn đánh giá" : "Duyệt đánh giá"}
              </Button>
            </Box>
          )}
        </Stack>
      </Paper>

      {/* Confirm Dialog for Admin */}
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
        PaperProps={{
          sx: {
            bgcolor: "rgba(0,0,0,0.95)",
            color: "#fff",
          },
        }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
          <IconButton
            onClick={() => setOpenImage(false)}
            sx={{ color: "#fff" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
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
              sx={{
                maxWidth: "100%",
                maxHeight: "70vh",
                objectFit: "contain",
              }}
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
