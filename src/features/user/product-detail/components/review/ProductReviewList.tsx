"use client";

import {
  Box,
  Typography,
  Paper,
  Stack,
  Collapse,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Pagination,
  Skeleton,
  Alert,
  Divider,
  LinearProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useState, useCallback } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ReviewForm from "./ReviewForm";
import ReviewCard, { type Review } from "./ReviewCard";
import UserReviewSection from "./UserReviewList";
import ReviewStats from "./ReviewStats";
import { api, http } from "@/lib/api/http";

/* ─── Types ─────────────────────────────────────────────── */

interface Meta {
  page: number;
  pageSize: number;
  pages: number;
  total: number;
}

interface StatsData {
  averageRating: number;
  totalCount: number;
  distribution: { star: number; count: number; percentage: number }[];
}

interface ReviewStatus {
  hasPurchased: boolean;
  reviewCount: number;
  maxReviews: number;
  canReview: boolean;
  myReviews: Review[];
}

interface Props {
  productId: number;
}

/* ─── Constants ─────────────────────────────────────────── */

const PAGE_SIZE = 5;

const sortToSpring: Record<string, string> = {
  newest: "createdAt,desc",
  oldest: "createdAt,asc",
  highest: "rating,desc",
  lowest: "rating,asc",
  helpful: "helpfulCount,desc",
};

/* ─── Component ─────────────────────────────────────────── */

const ProductReviewList = ({ productId }: Props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  /* User state */
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  /* Review write section */
  const [showForm, setShowForm] = useState(false);
  const [reviewStatus, setReviewStatus] = useState<ReviewStatus | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);

  /* Review list */
  const [reviews, setReviews] = useState<Review[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);

  /* Stats */
  const [stats, setStats] = useState<StatsData | null>(null);

  /* Filters */
  const [ratingFilter, setRatingFilter] = useState<number | "all">("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [page, setPage] = useState(1);

  /* ── Init user ── */
  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw) {
        const u = JSON.parse(raw);
        setCurrentUserId(u?.id ?? null);
        // Case-insensitive so "ADMIN" / "admin" both work
        setIsAdmin(u?.role?.toUpperCase() === "ADMIN");
        setIsLoggedIn(true);
      }
    } catch {
      // ignore
    }
  }, []);

  /* ── Fetch review status (authenticated only) ── */
  const fetchStatus = useCallback(async () => {
    if (!isLoggedIn) return;
    setStatusLoading(true);
    try {
      const raw = await api.get<unknown>(`/api/v1/products/${productId}/review-status`);
      const s = (raw as { data: ReviewStatus })?.data ?? (raw as ReviewStatus);
      setReviewStatus(s);
    } catch {
      setReviewStatus(null);
    } finally {
      setStatusLoading(false);
    }
  }, [productId, isLoggedIn]);

  /* ── Fetch stats ── */
  const fetchStats = useCallback(async () => {
    try {
      const raw = await api.get<unknown>(`/api/v1/products/${productId}/reviews/stats`);
      const s = (raw as { data: StatsData })?.data ?? (raw as StatsData);
      setStats(s);
    } catch {
      // keep null
    }
  }, [productId]);

  /* ── Fetch reviews ── */
  const fetchReviews = useCallback(
    async (p: number) => {
      setLoading(true);
      try {
        const params: Record<string, unknown> = {
          page: p,
          size: PAGE_SIZE,
          sort: sortToSpring[sortBy] ?? "createdAt,desc",
        };
        if (ratingFilter !== "all") params.rating = ratingFilter;
        if (isAdmin) params.includeUnapproved = true;

        const data = await api.get<{ meta: Meta; result: Review[] }>(
          `/api/v1/products/${productId}/reviews`,
          { params },
        );
        setReviews(data?.result ?? []);
        setMeta(data?.meta ?? null);
      } catch {
        setReviews([]);
        setMeta(null);
      } finally {
        setLoading(false);
      }
    },
    [productId, ratingFilter, sortBy, isAdmin],
  );

  useEffect(() => { fetchStats(); }, [fetchStats]);
  useEffect(() => { fetchStatus(); }, [fetchStatus]);
  useEffect(() => { fetchReviews(page); }, [fetchReviews, page]);

  /* ── Handlers ── */

  const handleRatingChange = (v: number | "all") => { setRatingFilter(v); setPage(1); };
  const handleSortChange = (v: string) => { setSortBy(v); setPage(1); };

  const toggleApproval = async (id: number) => {
    try {
      await http.patch(`/api/v1/reviews/${id}/approve`);
      fetchReviews(page);
      fetchStats();
    } catch { /* silent */ }
  };

  const handleHelpfulToggled = (updated: Review) =>
    setReviews((prev) =>
      prev.map((r) => (r.id === updated.id ? { ...r, helpfulCount: updated.helpfulCount } : r)),
    );

  const handleWriteSuccess = () => {
    setShowForm(false);
    fetchStatus();
    fetchReviews(1);
    fetchStats();
    setPage(1);
  };

  const handleMyReviewUpdated = (updated: Review) => {
    setReviewStatus((prev) =>
      prev
        ? { ...prev, myReviews: prev.myReviews.map((r) => (r.id === updated.id ? updated : r)) }
        : prev,
    );
    fetchReviews(page);
    fetchStats();
  };

  const handleMyReviewDeleted = (deletedId: number) => {
    setReviewStatus((prev) => {
      if (!prev) return prev;
      const newList = prev.myReviews.filter((r) => r.id !== deletedId);
      return {
        ...prev,
        myReviews: newList,
        reviewCount: newList.length,
        canReview: prev.hasPurchased && newList.length < prev.maxReviews,
      };
    });
    fetchReviews(page);
    fetchStats();
  };

  /* ── Stats normalization ── */
  const normalizedStats = stats
    ? {
        total: stats.totalCount,
        average: stats.averageRating,
        distribution: stats.distribution.map((d) => ({
          rating: d.star,
          count: d.count,
          percentage: d.percentage,
        })),
      }
    : { total: 0, average: 0, distribution: [] };

  /* ── Write CTA block ── */
  const renderWriteArea = () => {
    /* Not logged in */
    if (!isLoggedIn) {
      return (
        <Alert
          severity="info"
          icon={<LockOutlinedIcon fontSize="small" />}
          sx={{ borderRadius: 2, fontSize: "0.85rem" }}
          action={
            <Button
              size="small"
              href="/login"
              sx={{ color: "#1976d2", fontWeight: 600, textTransform: "none" }}
            >
              Đăng nhập
            </Button>
          }
        >
          Đăng nhập để chia sẻ đánh giá của bạn
        </Alert>
      );
    }

    /* Status still loading */
    if (statusLoading) {
      return <Skeleton variant="rounded" height={44} sx={{ borderRadius: 2 }} />;
    }

    /* Not purchased */
    if (reviewStatus && !reviewStatus.hasPurchased) {
      return (
        <Alert
          severity="warning"
          icon={<ShoppingBagOutlinedIcon fontSize="small" />}
          sx={{ borderRadius: 2, fontSize: "0.85rem" }}
        >
          Bạn cần mua và nhận sản phẩm trước khi có thể đánh giá
        </Alert>
      );
    }

    const hasMyReviews = (reviewStatus?.myReviews?.length ?? 0) > 0;
    const canReview = reviewStatus?.canReview ?? false;
    const reviewCount = reviewStatus?.reviewCount ?? 0;
    const maxReviews = reviewStatus?.maxReviews ?? 3;

    return (
      <Stack spacing={2}>
        {/* Existing reviews by this user */}
        {hasMyReviews && (
          <Stack spacing={1}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle2" fontWeight={700} color="text.primary">
                Đánh giá của bạn
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {reviewCount}/{maxReviews} lần đánh giá
              </Typography>
            </Stack>

            {/* Quota progress bar */}
            <Box>
              <LinearProgress
                variant="determinate"
                value={(reviewCount / maxReviews) * 100}
                sx={{
                  height: 5,
                  borderRadius: 3,
                  bgcolor: "#f0f0f0",
                  "& .MuiLinearProgress-bar": {
                    bgcolor: reviewCount >= maxReviews ? "#e53935" : "#f25c05",
                  },
                }}
              />
            </Box>

            <UserReviewSection
              reviews={reviewStatus!.myReviews}
              onUpdated={handleMyReviewUpdated}
              onDeleted={handleMyReviewDeleted}
            />
          </Stack>
        )}

        {/* Write new review button (only when quota remaining) */}
        {canReview && (
          <Stack spacing={1}>
            <Button
              variant="contained"
              onClick={() => setShowForm((v) => !v)}
              endIcon={showForm ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              sx={{
                bgcolor: "#f25c05",
                color: "#fff",
                "&:hover": { bgcolor: "#e64a19" },
                textTransform: "none",
                borderRadius: 2,
                alignSelf: "flex-start",
              }}
            >
              {showForm
                ? "Đóng form"
                : hasMyReviews
                ? `Viết thêm đánh giá (còn ${maxReviews - reviewCount} lần)`
                : "Viết đánh giá"}
            </Button>

            <Collapse in={showForm}>
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                <ReviewForm productId={productId} onSuccess={handleWriteSuccess} />
              </motion.div>
            </Collapse>
          </Stack>
        )}

        {/* Quota exhausted */}
        {!canReview && reviewStatus?.hasPurchased && reviewCount >= maxReviews && (
          <Alert severity="success" sx={{ borderRadius: 2, fontSize: "0.82rem" }}>
            Bạn đã sử dụng hết {maxReviews} lần đánh giá cho sản phẩm này. Cảm ơn bạn đã phản hồi!
          </Alert>
        )}
      </Stack>
    );
  };

  /* ─────────────────────────── Render ─────────────────────────── */

  return (
    <Paper elevation={2} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 3 }}>
      {/* Stats */}
      <ReviewStats stats={normalizedStats} />

      <Divider sx={{ my: 3 }} />

      {/* Write area — contextual */}
      {renderWriteArea()}

      <Divider sx={{ my: 3 }} />

      {/* Filter & Sort */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", md: "center" }}
        flexDirection={{ xs: "column", md: "row" }}
        mb={2.5}
        gap={2}
      >
        <Typography variant="h6" fontWeight={700}>
          Đánh giá từ khách hàng{meta ? ` (${meta.total})` : ""}
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          alignItems="center"
          flexWrap="wrap"
          rowGap={1}
        >
          <FormControl size="small" sx={{ minWidth: 130 }}>
            <InputLabel>Lọc theo sao</InputLabel>
            <Select
              label="Lọc theo sao"
              value={ratingFilter}
              onChange={(e) => handleRatingChange(e.target.value as number | "all")}
              MenuProps={{ disableScrollLock: true }}
            >
              <MenuItem value="all">Tất cả</MenuItem>
              {[5, 4, 3, 2, 1].map((val) => (
                <MenuItem key={val} value={val}>
                  {val} sao
                  {stats
                    ? ` (${stats.distribution.find((d) => d.star === val)?.count ?? 0})`
                    : ""}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 155 }}>
            <InputLabel>Sắp xếp</InputLabel>
            <Select
              label="Sắp xếp"
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              MenuProps={{ disableScrollLock: true }}
            >
              <MenuItem value="newest">Mới nhất</MenuItem>
              <MenuItem value="oldest">Cũ nhất</MenuItem>
              <MenuItem value="highest">Đánh giá cao nhất</MenuItem>
              <MenuItem value="lowest">Đánh giá thấp nhất</MenuItem>
              <MenuItem value="helpful">Hữu ích nhất</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Box>

      {/* Review list */}
      <AnimatePresence mode="wait">
        {loading ? (
          <Stack spacing={2}>
            {[1, 2, 3].map((i) => <Skeleton key={i} variant="rounded" height={120} />)}
          </Stack>
        ) : reviews.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Alert severity="info" sx={{ borderRadius: 2 }}>
              Chưa có đánh giá nào phù hợp với bộ lọc.
            </Alert>
          </motion.div>
        ) : (
          <Stack spacing={2.5}>
            {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.04 }}
              >
                <ReviewCard
                  review={review}
                  isAdmin={isAdmin}
                  currentUserId={currentUserId}
                  onToggleApproval={toggleApproval}
                  onHelpfulToggled={handleHelpfulToggled}
                />
              </motion.div>
            ))}
          </Stack>
        )}
      </AnimatePresence>

      {/* Pagination */}
      {meta && meta.pages > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={meta.pages}
            page={page}
            onChange={(_, p) => setPage(p)}
            color="primary"
            shape="rounded"
            size={isMobile ? "small" : "medium"}
            sx={{
              "& .MuiPaginationItem-root.Mui-selected": {
                bgcolor: "#f25c05",
                color: "#fff",
              },
            }}
          />
        </Box>
      )}
    </Paper>
  );
};

export default ProductReviewList;
