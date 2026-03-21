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
  Chip,
  Rating,
  LinearProgress,
  Skeleton,
  Alert,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useMemo, useState, useCallback } from "react";
import { ChevronDown, ChevronUp, Star, Filter, SortAsc } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import UserReviewList from "./UserReviewList";
import ReviewForm from "./ReviewForm";
import ReviewCard from "./ReviewCard";
import ReviewStats from "./ReviewStats";

import { api, http } from "@/lib/api/http";

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

const pageSize = 5;

const ProductReviewList = ({ productId }: Props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [ratingFilter, setRatingFilter] = useState<number | "all">("all");
  const [sortBy, setSortBy] = useState<
    "newest" | "oldest" | "highest" | "lowest"
  >("newest");
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [showUserReviews, setShowUserReviews] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    try {
      const parsed = storedUser ? JSON.parse(storedUser) : null;
      setUserEmail(parsed?.email || null);
    } catch {
      setUserEmail(null);
    }
  }, []);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get<{ result: Review[] }>(
        `/api/v1/products/${productId}/reviews`,
        { params: { page: 1, size: 100 } },
      );
      const list: Review[] = data?.result || [];
      setReviews(list);
      setPage(1);
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const toggleApproval = async (id: number) => {
    try {
      await http.patch(`/api/v1/reviews/${id}/approve`);
      fetchReviews();
    } catch {
      // silently fail
    }
  };

  // Filter và sort reviews
  const processedReviews = useMemo(() => {
    let filtered = reviews.filter((r) => r.approved);

    if (ratingFilter !== "all") {
      filtered = filtered.filter((r) => r.rating === ratingFilter);
    }

    switch (sortBy) {
      case "newest":
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;
      case "oldest":
        filtered.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
        break;
      case "highest":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "lowest":
        filtered.sort((a, b) => a.rating - b.rating);
        break;
    }

    return filtered;
  }, [reviews, ratingFilter, sortBy]);

  const paginated = useMemo(
    () => processedReviews.slice((page - 1) * pageSize, page * pageSize),
    [processedReviews, page],
  );

  // Tính toán thống kê
  const stats = useMemo(() => {
    const total = reviews.filter((r) => r.approved).length;
    const average =
      total > 0
        ? reviews
            .filter((r) => r.approved)
            .reduce((sum, r) => sum + r.rating, 0) / total
        : 0;

    const distribution = [5, 4, 3, 2, 1].map((star) => ({
      rating: star,
      count: reviews.filter((r) => r.approved && r.rating === star).length,
      percentage:
        total > 0
          ? (reviews.filter((r) => r.approved && r.rating === star).length /
              total) *
            100
          : 0,
    }));

    return { total, average, distribution };
  }, [reviews]);

  if (loading) {
    return (
      <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
        <Skeleton variant="text" width={200} height={40} sx={{ mb: 2 }} />
        <Skeleton variant="rounded" height={100} sx={{ mb: 2 }} />
        <Skeleton variant="rounded" height={100} />
      </Paper>
    );
  }

  return (
    <Paper elevation={2} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 3 }}>
      {/* Header với thống kê */}
      <ReviewStats stats={stats} />

      <Divider sx={{ my: 3 }} />

      {/* Filter và Actions */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", md: "center" }}
        flexDirection={{ xs: "column", md: "row" }}
        mb={3}
        gap={2}
      >
        <Typography variant="h6" fontWeight={700}>
          Đánh giá từ khách hàng ({processedReviews.length})
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems="center"
          flexWrap="wrap"
          rowGap={1}
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          {/* Filter theo sao */}
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Lọc theo sao</InputLabel>
            <Select
              label="Lọc theo sao"
              value={ratingFilter}
              onChange={(e) => {
                setRatingFilter(e.target.value as number | "all");
                setPage(1);
              }}
              MenuProps={{ disableScrollLock: true }}
            >
              <MenuItem value="all">Tất cả ({stats.total})</MenuItem>
              {[5, 4, 3, 2, 1].map((val) => (
                <MenuItem key={val} value={val}>
                  {val} sao (
                  {stats.distribution.find((d) => d.rating === val)?.count || 0}
                  )
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Sort */}
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Sắp xếp</InputLabel>
            <Select
              label="Sắp xếp"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              MenuProps={{ disableScrollLock: true }}
            >
              <MenuItem value="newest">Mới nhất</MenuItem>
              <MenuItem value="oldest">Cũ nhất</MenuItem>
              <MenuItem value="highest">Đánh giá cao nhất</MenuItem>
              <MenuItem value="lowest">Đánh giá thấp nhất</MenuItem>
            </Select>
          </FormControl>

          {/* Switch xem đánh giá của tôi */}
          <FormControlLabel
            control={
              <Switch
                checked={showUserReviews}
                onChange={() => setShowUserReviews(!showUserReviews)}
                color="primary"
              />
            }
            label="Đánh giá của tôi"
          />

          {/* Nút viết đánh giá */}
          <Button
            variant="contained"
            onClick={() => setShowForm(!showForm)}
            endIcon={
              showForm ? <ChevronUp size={16} /> : <ChevronDown size={16} />
            }
            sx={{
              bgcolor: "#f25c05",
              color: "#fff",
              "&:hover": { bgcolor: "#e64a19" },
              whiteSpace: "nowrap",
            }}
          >
            Viết đánh giá
          </Button>
        </Stack>
      </Box>

      {/* Form viết đánh giá */}
      <Collapse in={showForm}>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ReviewForm productId={productId} onSuccess={fetchReviews} />
        </motion.div>
      </Collapse>

      {/* Danh sách đánh giá */}
      <AnimatePresence mode="wait">
        {showUserReviews ? (
          <UserReviewList productId={productId} />
        ) : paginated.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Alert severity="info" sx={{ borderRadius: 2 }}>
              Chưa có đánh giá nào phù hợp với bộ lọc.
            </Alert>
          </motion.div>
        ) : (
          <Stack spacing={3}>
            {paginated.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <ReviewCard
                  review={review}
                  userEmail={userEmail}
                  onToggleApproval={toggleApproval}
                />
              </motion.div>
            ))}
          </Stack>
        )}
      </AnimatePresence>

      {/* Pagination */}
      {processedReviews.length > pageSize && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={Math.ceil(processedReviews.length / pageSize)}
            page={page}
            onChange={(_, newPage) => setPage(newPage)}
            color="primary"
            shape="rounded"
            size={isMobile ? "small" : "medium"}
            sx={{
              "& .MuiPaginationItem-root": {
                "&.Mui-selected": {
                  bgcolor: "#f25c05",
                  color: "#fff",
                },
              },
            }}
          />
        </Box>
      )}
    </Paper>
  );
};

export default ProductReviewList;
