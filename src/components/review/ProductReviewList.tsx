// 📁 components/review/ProductReviewList.tsx
"use client";

import {
  Box,
  Typography,
  Paper,
  Stack,
  Collapse,
  Button,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  Pagination,
} from "@mui/material";
import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";
import UserReviewList from "./UserReviewList";
import ReviewForm from "./ReviewForm";
import ReviewCard from "./ReviewCard";

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

const ProductReviewList = ({ productId }: Props) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [ratingFilter, setRatingFilter] = useState<number | "all">("all");
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [showUserReviews, setShowUserReviews] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
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
              MenuProps={{ disableScrollLock: true }}
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
          <ReviewForm productId={productId} onSuccess={fetchReviews} />
        </motion.div>
      </Collapse>

      {showUserReviews ? (
        <UserReviewList productId={productId} />
      ) : paginated.length === 0 ? (
        <Typography color="text.secondary">Chưa có đánh giá nào.</Typography>
      ) : (
        <Stack spacing={3}>
          {paginated.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              userEmail={userEmail}
              onToggleApproval={toggleApproval}
            />
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

export default ProductReviewList;
