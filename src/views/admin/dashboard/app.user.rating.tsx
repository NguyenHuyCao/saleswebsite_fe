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
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import DotsVertical from "mdi-material-ui/DotsVertical";

const UserRatingPage = () => {
  const ratings = [5, 4, 3, 2, 1];
  const counts = [384, 145, 24, 1, 0];
  const percents = [70, 35, 25, 10, 0];
  const total = counts.reduce((sum, val) => sum + val, 0);
  const positiveRate = Math.round(((counts[0] + counts[1]) / total) * 100);

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
          <IconButton
            size="small"
            aria-label="tùy chọn"
            className="card-more-options"
            sx={{ color: "text.secondary" }}
          >
            <DotsVertical />
          </IconButton>
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
              4.7
            </Typography>
            <StarIcon sx={{ color: "#ffb400" }} />
          </Stack>
          <Typography variant="subtitle1" color="success.main">
            +0.4
          </Typography>
        </Stack>

        {ratings.map((rating, idx) => (
          <Box key={rating} sx={{ mb: 3 }}>
            <Stack direction="row" justifyContent="space-between">
              <Typography
                variant="body2"
                sx={{ fontWeight: 500, color: "text.primary" }}
              >
                {rating} sao
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {counts[idx]} lượt
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={percents[idx]}
              sx={{
                mt: 1,
                height: 8,
                borderRadius: 5,
                backgroundColor: (theme) => theme.palette.grey[200],
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
        >
          Xem tất cả đánh giá
        </Button>
      </CardContent>
    </Card>
  );
};

export default UserRatingPage;
