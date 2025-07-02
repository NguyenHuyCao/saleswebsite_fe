"use client";

import {
  Box,
  Card,
  Stack,
  Typography,
  LinearProgress,
  IconButton,
  CardHeader,
  CardContent,
  Button,
  Divider,
  Menu,
  MenuItem,
  Modal,
  Fade,
  Avatar,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useState } from "react";
import StarIcon from "@mui/icons-material/Star";
import DotsVertical from "mdi-material-ui/DotsVertical";

const formatDate = (date: string) =>
  new Date(date).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

type ReviewData = {
  createdAt: string;
  productImage: string;
  rating: number;
  comment: string;
  productName: string;
  username: string;
};

const UserRatingPage = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [timeRange, setTimeRange] = useState<"weekly" | "monthly" | "yearly">(
    "monthly"
  );
  const [ratings, setRatings] = useState<number[]>([0, 0, 0, 0, 0]);
  const [reviewDetails, setReviewDetails] = useState<ReviewData[]>([]);
  const [openModal, setOpenModal] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const total = ratings.reduce((a, b) => a + b, 0);
  const percents = ratings.map((r) => (total === 0 ? 0 : (r / total) * 100));
  const positiveRate =
    total === 0 ? 0 : Math.round(((ratings[0] + ratings[1]) / total) * 100);

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = (range: "weekly" | "monthly" | "yearly") => {
    setTimeRange(range);
    setAnchorEl(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/dashboard/overview/review-stats`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

        const json = await res.json();

        if (json.status === 200 && json.data) {
          const data = json.data[timeRange] as number[][];
          const ratingMap = [0, 0, 0, 0, 0];
          data.forEach(([_, rating, count]) => {
            if (rating >= 1 && rating <= 5) ratingMap[5 - rating] += count;
          });
          setRatings(ratingMap);
          setReviewDetails(json.data.reviewDetails || []);
        } else {
          console.error("Invalid response:", json);
          setRatings([0, 0, 0, 0, 0]);
          setReviewDetails([]);
        }
      } catch (error) {
        console.error("Failed to fetch review stats:", error);
        setRatings([0, 0, 0, 0, 0]);
        setReviewDetails([]);
      }
    };

    fetchData();
  }, [timeRange]);

  return (
    <Card>
      <CardHeader
        title="Đánh giá người dùng"
        subheader="Tổng hợp theo thang điểm 5"
        titleTypographyProps={{
          sx: {
            lineHeight: "1.2 !important",
            letterSpacing: "0.31px !important",
          },
        }}
        action={
          <>
            <IconButton onClick={handleMenuOpen}>
              <DotsVertical />
            </IconButton>
            <Menu
              disableScrollLock
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              <MenuItem onClick={() => handleMenuClose("weekly")}>
                Tuần
              </MenuItem>
              <MenuItem onClick={() => handleMenuClose("monthly")}>
                Tháng
              </MenuItem>
              <MenuItem onClick={() => handleMenuClose("yearly")}>Năm</MenuItem>
            </Menu>
          </>
        }
      />

      <CardContent sx={{ pt: 2 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 4 }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="h4" fontWeight={600}>
              {total === 0
                ? "0.0"
                : (
                    ratings.reduce((a, c, i) => a + c * (5 - i), 0) / total
                  ).toFixed(1)}
            </Typography>
            <StarIcon sx={{ color: "#ffb400" }} />
          </Stack>
          <Typography variant="subtitle1" color="success.main">
            +{positiveRate}%
          </Typography>
        </Stack>

        {[5, 4, 3, 2, 1].map((r, i) => (
          <Box key={r} sx={{ mb: 3 }}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" fontWeight={500}>
                {r} sao
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {ratings[5 - r]} lượt
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={percents[5 - r]}
              sx={{
                mt: 1,
                height: 8,
                borderRadius: 5,
                backgroundColor: theme.palette.grey[200],
                "& .MuiLinearProgress-bar": {
                  borderRadius: 5,
                  backgroundColor: "#a855f7",
                },
              }}
            />
          </Box>
        ))}

        <Divider sx={{ my: 2 }} />
        <Typography variant="body2" sx={{ mb: 1 }}>
          Tổng lượt đánh giá: <strong>{total}</strong>
        </Typography>
        <Typography variant="body2">
          Tỷ lệ đánh giá tích cực: <strong>{positiveRate}%</strong>
        </Typography>
        <Button
          variant="outlined"
          size="small"
          fullWidth
          sx={{ mt: 3, textTransform: "none" }}
          onClick={() => setOpenModal(true)}
        >
          Xem tất cả đánh giá
        </Button>
      </CardContent>

      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        disableScrollLock
      >
        <Fade in={openModal}>
          <Box
            sx={{
              maxWidth: 700,
              mx: "auto",
              mt: isMobile ? 4 : 10,
              bgcolor: "background.paper",
              borderRadius: 2,
              boxShadow: 24,
              p: 4,
              maxHeight: "90vh",
              overflowY: "auto",
              "&::-webkit-scrollbar": { width: "8px" },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "#f1f1f1",
                borderRadius: "8px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#a855f7",
                borderRadius: "8px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                backgroundColor: "#9333ea",
              },
              scrollbarWidth: "thin",
              scrollbarColor: "#a855f7 #f1f1f1",
            }}
          >
            <Typography variant="h6" mb={3}>
              Chi tiết đánh giá
            </Typography>
            {reviewDetails.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                Không có đánh giá nào trong khoảng thời gian này.
              </Typography>
            ) : (
              <Stack spacing={3}>
                {reviewDetails.map((review, i) => (
                  <Stack
                    key={i}
                    direction="row"
                    spacing={2}
                    alignItems="flex-start"
                  >
                    <Avatar
                      src={`/images/products/${review.productImage}`}
                      variant="rounded"
                    />
                    <Box>
                      <Typography fontWeight={600}>
                        {review.productName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(review.createdAt)} - {review.username}
                      </Typography>
                      <Typography variant="body2" color="warning.main">
                        {Array(review.rating).fill("⭐").join("")}
                      </Typography>
                      <Typography variant="body2" mt={0.5}>
                        {review.comment}
                      </Typography>
                    </Box>
                  </Stack>
                ))}
              </Stack>
            )}
            <Stack alignItems="flex-end" mt={4}>
              <Button onClick={() => setOpenModal(false)}>Đóng</Button>
            </Stack>
          </Box>
        </Fade>
      </Modal>
    </Card>
  );
};

export default UserRatingPage;
