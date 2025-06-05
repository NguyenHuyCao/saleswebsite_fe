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
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [hiddenReviews, setHiddenReviews] = useState<Review[]>([]);
  const [page, setPage] = useState(1);
  const [ratingFilter, setRatingFilter] = useState<number | "all">("all");
  const [showForm, setShowForm] = useState(false);
  const [showUserReviews, setShowUserReviews] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [rating, setRating] = useState<number | null>(0);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const pageSize = 5;

  const fetchReviews = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/v1/products/${productId}/reviews?page=1&size=100`
      );
      const data = await res.json();

      const sorted = (data?.data?.result || []).sort(
        (a: Review, b: Review) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setAllReviews(sorted);
      setFilteredReviews(
        sorted.filter((r: any) =>
          ratingFilter === "all"
            ? r.approved
            : r.approved && r.rating === ratingFilter
        )
      );
      setHiddenReviews(sorted.filter((r: any) => !r.approved));
    } catch (error) {
      console.error("Lỗi khi lấy đánh giá:", error);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUserEmail(parsed.email);
      } catch {
        console.error("Lỗi khi đọc user");
      }
    }
    fetchReviews();
  }, [productId]);

  useEffect(() => {
    const updated = allReviews.filter((r) =>
      ratingFilter === "all"
        ? r.approved
        : r.approved && r.rating === ratingFilter
    );
    setFilteredReviews(updated);
    setHiddenReviews(allReviews.filter((r) => !r.approved));
    setPage(1);
  }, [ratingFilter, allReviews]);

  const handleToggleApprove = async (reviewId: number) => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    try {
      const res = await fetch(
        `http://localhost:8080/api/v1/reviews/${reviewId}/approved`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (res.ok) fetchReviews();
    } catch (err) {
      console.error("Toggle error", err);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    if (files.length > 3) {
      setError("Chỉ được tải lên tối đa 3 ảnh");
      return;
    }
    setImages(files);
    setError(null);
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token || !rating || !comment.trim()) {
      setError("Vui lòng nhập đủ thông tin");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("rating", String(rating));
      formData.append("comment", comment);
      images.forEach((img) => formData.append("imageReviews", img));

      const res = await fetch(
        `http://localhost:8080/api/v1/reviews/${productId}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );
      if (!res.ok) throw new Error("Lỗi khi gửi đánh giá");
      setRating(0);
      setComment("");
      setImages([]);
      setError(null);
      setShowForm(false);
      fetchReviews();
    } catch (err) {
      setError("Gửi đánh giá thất bại");
      console.log(err);
    }
  };

  const paginatedReviews = filteredReviews.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

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
          Đánh giá sản phẩm ({filteredReviews.length})
        </Typography>

        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          flexWrap="wrap"
          justifyContent={{ xs: "flex-start", md: "flex-end" }}
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
            sx={{ minWidth: 180 }}
          />

          <FormControl sx={{ minWidth: 140 }} size="small">
            <InputLabel>Lọc theo sao</InputLabel>
            <Select
              label="Lọc theo sao"
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              MenuProps={{
                disablePortal: true,
                disableScrollLock: true,
                PaperProps: { sx: { mt: 1, zIndex: 1300 } },
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
            onClick={() => setShowForm((prev) => !prev)}
            endIcon={
              showForm ? <ChevronUp size={16} /> : <ChevronDown size={16} />
            }
            sx={{ whiteSpace: "nowrap", height: 40 }}
          >
            Viết đánh giá
          </Button>
        </Stack>
      </Box>

      {showUserReviews ? (
        <UserReviewList productId={productId} />
      ) : (
        <>
          <Collapse in={showForm}>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: "#f9f9f9" }}>
                <Stack spacing={2}>
                  <Typography fontWeight={600}>Gửi đánh giá của bạn</Typography>
                  {error && <Alert severity="error">{error}</Alert>}
                  <Rating
                    value={rating}
                    onChange={(_, val) => setRating(val)}
                  />
                  <TextField
                    multiline
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Nội dung đánh giá"
                    fullWidth
                  />
                  <Button variant="outlined" component="label">
                    Tải lên ảnh (tối đa 3)
                    <input
                      hidden
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                    />
                  </Button>
                  <Typography variant="body2" color="text.secondary">
                    {images.length} ảnh được chọn
                  </Typography>
                  <Button variant="contained" onClick={handleSubmit}>
                    Gửi đánh giá
                  </Button>
                </Stack>
              </Paper>
            </motion.div>
          </Collapse>

          {paginatedReviews.length === 0 ? (
            <Typography color="text.secondary">
              Chưa có đánh giá nào.
            </Typography>
          ) : (
            <Stack spacing={3}>
              {paginatedReviews.map((review) => (
                <Box key={review.id}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar>{review.createdBy.charAt(0).toUpperCase()}</Avatar>
                    <Box>
                      <Typography fontWeight={600}>
                        {review.createdBy}
                      </Typography>
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
                          src={`http://localhost:8080/api/v1/files/${img}`}
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
                  {userEmail === "admin@gmail.com" && (
                    <Box mt={1}>
                      <Button
                        size="small"
                        variant="outlined"
                        color={review.approved ? "error" : "success"}
                        onClick={() => handleToggleApprove(review.id)}
                      >
                        {review.approved ? "Ẩn đánh giá" : "Hiện đánh giá"}
                      </Button>
                    </Box>
                  )}
                  <Divider sx={{ mt: 2 }} />
                </Box>
              ))}
            </Stack>
          )}

          {filteredReviews.length > pageSize && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination
                count={Math.ceil(filteredReviews.length / pageSize)}
                page={page}
                onChange={(_, newPage) => setPage(newPage)}
                color="primary"
              />
            </Box>
          )}

          {userEmail === "admin@gmail.com" && hiddenReviews.length > 0 && (
            <Box mt={6}>
              <Typography variant="h6" fontWeight={700} mb={2}>
                Đánh giá đã ẩn ({hiddenReviews.length})
              </Typography>
              <Stack spacing={3}>
                {hiddenReviews.map((review) => (
                  <Box key={review.id}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar>
                        {review.createdBy.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography fontWeight={600}>
                          {review.createdBy}
                        </Typography>
                        <Rating value={review.rating} readOnly size="small" />
                        <Typography variant="body2" color="text.secondary">
                          {new Date(review.createdAt).toLocaleDateString(
                            "vi-VN"
                          )}
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
                            src={`http://localhost:8080/api/v1/files/${img}`}
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
                        color="success"
                        onClick={() => handleToggleApprove(review.id)}
                      >
                        Hiện đánh giá
                      </Button>
                    </Box>
                    <Divider sx={{ mt: 2 }} />
                  </Box>
                ))}
              </Stack>
            </Box>
          )}
        </>
      )}
    </Paper>
  );
};
