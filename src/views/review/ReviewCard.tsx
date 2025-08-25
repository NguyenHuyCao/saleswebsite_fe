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
} from "@mui/material";

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

const ReviewCard = ({ review, userEmail, onToggleApproval }: Props) => (
  <Box>
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
              src={img || undefined}
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
        onClick={() => onToggleApproval(review.id)}
      >
        Ẩn đánh giá
      </Button>
    )}
    <Divider sx={{ mt: 2 }} />
  </Box>
);

export default ReviewCard;
