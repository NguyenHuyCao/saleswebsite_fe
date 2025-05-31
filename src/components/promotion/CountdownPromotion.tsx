"use client";

import { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Stack,
  IconButton,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Chip,
  Rating,
} from "@mui/material";
import BoltIcon from "@mui/icons-material/Bolt";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { motion } from "framer-motion";

const promoProducts = Array.from({ length: 20 }).map((_, index) => ({
  name: `Sản phẩm demo ${index + 1}`,
  image: "/images/product/mpd-daewoo-dag-9900dbx-1_20210514115542.jpg",
  price: 1000000 + index * 100000,
  oldPrice: 1200000 + index * 100000,
  tags: index % 2 === 0 ? ["Bán chạy"] : ["Mới"],
  rating: 4,
  soldOut: index % 5 === 0,
}));

const CountdownPromotion = ({ deadline }: { deadline: string }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [hasMounted, setHasMounted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [liked, setLiked] = useState<number[]>([]);

  const calculateTimeLeft = () => {
    const difference = +new Date(deadline) - +new Date();
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  };

  useEffect(() => {
    setHasMounted(true);
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [deadline]);

  const updateScrollButtons = () => {
    const container = scrollRef.current;
    if (container) {
      const { scrollLeft, clientWidth, scrollWidth } = container;
      const isScrollable = scrollWidth > clientWidth;
      setCanScrollLeft(isScrollable && scrollLeft > 0);
      setCanScrollRight(
        isScrollable && scrollLeft + clientWidth < scrollWidth - 1
      );
    }
  };

  useEffect(() => {
    updateScrollButtons();
    const container = scrollRef.current;
    if (!container) return;
    container.addEventListener("scroll", updateScrollButtons);
    window.addEventListener("resize", updateScrollButtons);
    return () => {
      container.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, []);

  const scroll = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;
    const scrollAmount = 600;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const toggleLike = (idx: number) => {
    setLiked((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const renderTimeBox = (value: number, label: string) => (
    <Paper
      elevation={3}
      sx={{
        px: 2,
        py: 1,
        mx: 0.5,
        backgroundColor: "#2563eb",
        color: "white",
        borderRadius: 2,
        textAlign: "center",
        minWidth: 50,
        transition: "all 0.3s ease",
        animation: "pulse 1s ease-in-out infinite",
        "@keyframes pulse": {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.1)" },
          "100%": { transform: "scale(1)" },
        },
      }}
    >
      <Typography variant="h5" fontWeight="bold">
        {String(value).padStart(2, "0")}
      </Typography>
      <Typography fontSize={12}>{label}</Typography>
    </Paper>
  );

  if (!hasMounted) return null;

  return (
    <Box textAlign="center" py={4}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        spacing={1}
        mb={2}
      >
        <BoltIcon sx={{ color: "#f25c05" }} />
        <Typography
          variant="h6"
          fontWeight="bold"
          textAlign="center"
          mb={2}
          mt={3}
          color="black"
        >
          THỜI GIAN CHỈ CÒN
        </Typography>
      </Stack>
      <Grid container justifyContent="center">
        {renderTimeBox(timeLeft.days, "Days")}
        {renderTimeBox(timeLeft.hours, "Hours")}
        {renderTimeBox(timeLeft.minutes, "Minutes")}
        {renderTimeBox(timeLeft.seconds, "Seconds")}
      </Grid>

      <Box mt={5} position="relative">
        <Typography variant="h6" fontWeight={700} mb={2} textAlign="center">
          SẢN PHẨM ĐANG KHUYẾN MÃI
        </Typography>

        {canScrollLeft && (
          <IconButton
            onClick={() => scroll("left")}
            sx={{
              position: "absolute",
              top: "50%",
              left: 0,
              transform: "translate(-50%, -50%)",
              zIndex: 10,
              bgcolor: "white",
              boxShadow: 2,
              border: "1px solid #ddd",
              transition: "all 0.3s",
              "&:hover": { bgcolor: "grey.100" },
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
        )}

        {canScrollRight && (
          <IconButton
            onClick={() => scroll("right")}
            sx={{
              position: "absolute",
              top: "50%",
              right: 0,
              transform: "translate(50%, -50%)",
              zIndex: 10,
              bgcolor: "white",
              boxShadow: 2,
              border: "1px solid #ddd",
              transition: "all 0.3s",
              "&:hover": { bgcolor: "grey.100" },
            }}
          >
            <ChevronRightIcon />
          </IconButton>
        )}

        <Box
          ref={scrollRef}
          sx={{
            display: "flex",
            gap: 2,
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            pb: 1,
            px: 1,
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {promoProducts.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: idx * 0.05, ease: "easeOut" }}
              whileHover={{
                scale: 1.02,
                boxShadow: "0px 8px 20px rgba(0,0,0,0.08)",
              }}
              style={{ minWidth: 180, maxWidth: 180 }}
            >
              <Card
                sx={{
                  flexShrink: 0,
                  scrollSnapAlign: "start",
                  position: "relative",
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                {item.tags.map((tag, i) => (
                  <Chip
                    key={i}
                    label={tag}
                    color={
                      tag === "Mới"
                        ? "warning"
                        : tag === "Bán chạy"
                        ? "success"
                        : "error"
                    }
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 8,
                      left: 8,
                      zIndex: 2,
                      fontSize: 12,
                    }}
                  />
                ))}
                <IconButton
                  onClick={() => toggleLike(idx)}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    bgcolor: "white",
                    borderRadius: 1,
                    transition: "all 0.3s",
                    "&:hover": {
                      bgcolor: liked.includes(idx) ? "#ffe5e5" : "grey.100",
                    },
                  }}
                >
                  {liked.includes(idx) ? (
                    <FavoriteIcon fontSize="small" color="error" />
                  ) : (
                    <FavoriteBorderIcon fontSize="small" />
                  )}
                </IconButton>
                <CardMedia
                  component="img"
                  image={item.image}
                  alt={item.name}
                  sx={{ height: 130, objectFit: "cover" }}
                />
                <CardContent sx={{ p: 1 }}>
                  <Typography variant="body2" fontWeight={600} noWrap>
                    {item.name}
                  </Typography>
                  <Rating value={item.rating} readOnly size="small" />
                  <Typography
                    variant="body2"
                    color="error.main"
                    fontWeight={700}
                  >
                    {item.price.toLocaleString()}₫
                    <Typography
                      component="span"
                      variant="caption"
                      sx={{
                        textDecoration: "line-through",
                        color: "text.secondary",
                        ml: 0.5,
                      }}
                    >
                      {item.oldPrice.toLocaleString()}₫
                    </Typography>
                  </Typography>
                </CardContent>
                <CardActions sx={{ px: 1, pb: 1 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    color={item.soldOut ? "inherit" : "warning"}
                    disabled={item.soldOut}
                    sx={{
                      fontWeight: 600,
                      borderRadius: 2,
                      fontSize: 12,
                      py: 0.5,
                    }}
                  >
                    {item.soldOut ? "HẾT HÀNG" : "THÊM VÀO GIỎ"}
                  </Button>
                </CardActions>
              </Card>
            </motion.div>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default CountdownPromotion;
