"use client";

import {
  Box,
  Typography,
  Avatar,
  Rating,
  Paper,
  Divider,
  Stack,
  Pagination,
  Button,
  TextField,
  Collapse,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert,
  Switch,
  FormControlLabel,
  Tooltip,
} from "@mui/material";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { UserReviewList } from "./UserReviewList";

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
  productId: number;
}

export const ProductReviewList = ({ productId }: Props) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [ratingFilter, setRatingFilter] = useState<number | "all">("all");
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [showUserReviews, setShowUserReviews] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [rating, setRating] = useState<number | null>(0);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const pageSize = 5;

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    try {
      const parsed = storedUser ? JSON.parse(storedUser) : null;
      setUserEmail(parsed?.email || null);
    } catch {
      setUserEmail(null);
    }
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products/${productId}/reviews?page=1&size=100`
      );
      const data = await res.json();
      const list: Review[] = data?.data?.result || [];
      list.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setReviews(list);
    } catch (e) {
      console.error("Fetch review error:", e);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

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
      fetchReviews();
      setComment("");
      setImages([]);
      setRating(0);
      setShowForm(false);
    } catch {
      setError("Không thể gửi đánh giá, vui lòng thử lại.");
    }
  };

  const toggleApproval = async (id: number) => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/reviews/${id}/approved`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    fetchReviews();
  };

  const filtered = reviews.filter((r) =>
    ratingFilter === "all"
      ? r.approved
      : r.approved && r.rating === ratingFilter
  );
  const hidden = reviews.filter((r) => !r.approved);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", md: "center" }}
        flexDirection={{ xs: "column", md: "row" }}
        mb={3}
        gap={2}
      >
        <Typography variant="h6" fontWeight={700}>
          Đánh giá sản phẩm ({filtered.length})
        </Typography>

        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          flexWrap="wrap"
          rowGap={1}
        >
          <FormControlLabel
            control={
              <Switch
                checked={showUserReviews}
                onChange={() => setShowUserReviews(!showUserReviews)}
                color="primary"
              />
            }
            label="Xem đánh giá của tôi"
          />
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Lọc theo sao</InputLabel>
            <Select
              label="Lọc theo sao"
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              MenuProps={{
                disableScrollLock: true,
              }}
            >
              <MenuItem value="all">Tất cả</MenuItem>
              {[5, 4, 3, 2, 1].map((val) => (
                <MenuItem key={val} value={val}>
                  {val} sao
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            onClick={() => setShowForm(!showForm)}
            endIcon={
              showForm ? <ChevronUp size={16} /> : <ChevronDown size={16} />
            }
          >
            Viết đánh giá
          </Button>
        </Stack>
      </Box>

      <Collapse in={showForm}>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
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
              <Typography fontSize={13}>
                {images.length} ảnh được chọn
              </Typography>
              <Button variant="contained" onClick={handleSubmit}>
                Gửi đánh giá
              </Button>
            </Stack>
          </Paper>
        </motion.div>
      </Collapse>

      {showUserReviews ? (
        <UserReviewList productId={productId} />
      ) : paginated.length === 0 ? (
        <Typography color="text.secondary">Chưa có đánh giá nào.</Typography>
      ) : (
        <Stack spacing={3}>
          {paginated.map((review) => (
            <Box key={review.id}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar>{review.createdBy.charAt(0).toUpperCase()}</Avatar>
                <Box>
                  <Typography fontWeight={600}>{review.createdBy}</Typography>
                  <Rating value={review.rating} readOnly size="small" />
                  <Typography fontSize={13} color="text.secondary">
                    {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                  </Typography>
                </Box>
              </Stack>
              <Typography mt={1.5}>{review.comment}</Typography>
              <Stack direction="row" spacing={1} mt={1}>
                {[review.image1, review.image2, review.image3]
                  .filter(Boolean)
                  .map((img, idx) => (
                    <Tooltip title="Ảnh minh họa" key={idx}>
                      <Box
                        component="img"
                        src={`${img}`}
                        sx={{
                          width: 80,
                          height: 80,
                          borderRadius: 1,
                          border: "1px solid #ccc",
                          objectFit: "cover",
                        }}
                      />
                    </Tooltip>
                  ))}
              </Stack>
              {userEmail === "admin@gmail.com" && (
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  sx={{ mt: 1 }}
                  onClick={() => toggleApproval(review.id)}
                >
                  Ẩn đánh giá
                </Button>
              )}
              <Divider sx={{ mt: 2 }} />
            </Box>
          ))}
        </Stack>
      )}

      {filtered.length > pageSize && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={Math.ceil(filtered.length / pageSize)}
            page={page}
            onChange={(_, newPage) => setPage(newPage)}
          />
        </Box>
      )}
    </Paper>
  );
};
