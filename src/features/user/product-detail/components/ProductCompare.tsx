// components/product/ProductCompare.tsx
"use client";

import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Alert,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useState, useEffect } from "react";

interface Props {
  product: Product;
}

// Key features to compare
const compareFeatures = [
  { key: "price", label: "Giá bán", type: "price" },
  { key: "power", label: "Công suất", type: "text" },
  { key: "fuelType", label: "Nhiên liệu", type: "text" },
  { key: "engineType", label: "Động cơ", type: "text" },
  { key: "weight", label: "Trọng lượng", type: "weight" },
  { key: "tankCapacity", label: "Dung tích bình", type: "volume" },
  { key: "warrantyMonths", label: "Bảo hành", type: "month" },
  { key: "origin", label: "Xuất xứ", type: "text" },
  { key: "inStock", label: "Tình trạng", type: "stock" },
];

const COMPARE_LIST_KEY = "product_compare_list";

export default function ProductCompare({ product }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = useState(false);
  const [compareList, setCompareList] = useState<Product[]>([]);

  // Load compare list from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(COMPARE_LIST_KEY);
    if (saved) {
      try {
        setCompareList(JSON.parse(saved));
      } catch {
        setCompareList([]);
      }
    }
  }, []);

  // Save to localStorage
  const saveCompareList = (list: Product[]) => {
    localStorage.setItem(COMPARE_LIST_KEY, JSON.stringify(list));
    setCompareList(list);
  };

  const isInCompare = compareList.some((p) => p.id === product.id);

  const handleAddToCompare = () => {
    if (compareList.length >= 4) {
      alert("Chỉ có thể so sánh tối đa 4 sản phẩm");
      return;
    }
    if (!isInCompare) {
      const newList = [...compareList, product];
      saveCompareList(newList);
    }
  };

  const handleRemoveFromCompare = () => {
    const newList = compareList.filter((p) => p.id !== product.id);
    saveCompareList(newList);
  };

  const handleClearCompare = () => {
    saveCompareList([]);
  };

  const handleOpenCompare = () => {
    if (compareList.length >= 2) {
      setOpen(true);
    }
  };

  const formatValue = (item: Product, feature: (typeof compareFeatures)[0]) => {
    const value = item[feature.key as keyof Product];

    if (value === undefined || value === null) return "—";

    switch (feature.type) {
      case "price":
        return `${(value as number).toLocaleString()}₫`;
      case "weight":
        return `${value}kg`;
      case "volume":
        return `${value}L`;
      case "month":
        return `${value} tháng`;
      case "stock":
        return (value as boolean) ? "Còn hàng" : "Hết hàng";
      default:
        return String(value);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Paper
          elevation={2}
          sx={{
            p: 2,
            borderRadius: 2,
            border: "1px solid #eee",
            bgcolor: "#fff",
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{ mb: 1.5 }}
          >
            <CompareArrowsIcon sx={{ color: "#f25c05" }} />
            <Typography variant="body1" fontWeight={600}>
              So sánh sản phẩm
            </Typography>
            {compareList.length > 0 && (
              <Chip
                label={`${compareList.length}/4`}
                size="small"
                sx={{ bgcolor: "#f25c05", color: "#fff", ml: "auto" }}
              />
            )}
          </Stack>

          <Stack spacing={1.5}>
            {/* Current product status */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 1,
                bgcolor: isInCompare ? "#fff8e1" : "transparent",
                borderRadius: 1,
              }}
            >
              <Typography variant="body2" noWrap sx={{ maxWidth: 150 }}>
                {product.name}
              </Typography>
              {isInCompare ? (
                <Button
                  size="small"
                  color="error"
                  startIcon={<RemoveIcon />}
                  onClick={handleRemoveFromCompare}
                  sx={{ textTransform: "none" }}
                >
                  Bỏ so sánh
                </Button>
              ) : (
                <Button
                  size="small"
                  color="warning"
                  startIcon={<AddIcon />}
                  onClick={handleAddToCompare}
                  disabled={compareList.length >= 4}
                  sx={{ textTransform: "none" }}
                >
                  Thêm
                </Button>
              )}
            </Box>

            {/* Compare list summary */}
            {compareList.length > 0 && (
              <>
                <Divider />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Danh sách so sánh:
                  </Typography>
                  <Stack spacing={0.5} sx={{ mt: 0.5 }}>
                    {compareList.map((p) => (
                      <Box
                        key={p.id}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          fontSize: "0.8rem",
                        }}
                      >
                        <Typography
                          variant="caption"
                          noWrap
                          sx={{ maxWidth: 150 }}
                        >
                          • {p.name}
                        </Typography>
                        <Chip
                          label="x"
                          size="small"
                          onClick={() => {
                            const newList = compareList.filter(
                              (item) => item.id !== p.id,
                            );
                            saveCompareList(newList);
                          }}
                          sx={{
                            height: 18,
                            width: 18,
                            fontSize: "0.6rem",
                            bgcolor: "#f5f5f5",
                          }}
                        />
                      </Box>
                    ))}
                  </Stack>
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  size="small"
                  onClick={handleOpenCompare}
                  disabled={compareList.length < 2}
                  sx={{
                    bgcolor: "#f25c05",
                    color: "#fff",
                    textTransform: "none",
                    "&:disabled": { bgcolor: "#f5f5f5", color: "#999" },
                  }}
                >
                  So sánh ngay ({compareList.length} sản phẩm)
                </Button>

                {compareList.length >= 2 && (
                  <Button
                    fullWidth
                    variant="text"
                    size="small"
                    onClick={handleClearCompare}
                    sx={{ textTransform: "none", color: "#999" }}
                  >
                    Xóa tất cả
                  </Button>
                )}
              </>
            )}
          </Stack>
        </Paper>
      </motion.div>

      {/* Compare Dialog */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="lg"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle sx={{ bgcolor: "#f25c05", color: "#fff" }}>
          <Box display="flex" alignItems="center" gap={1}>
            <CompareArrowsIcon />
            <Typography variant="h6">So sánh sản phẩm</Typography>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ p: 3, overflowX: "auto" }}>
          {compareList.length >= 2 ? (
            <Box sx={{ minWidth: isMobile ? "100%" : 800 }}>
              {/* Header - Product names */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: `200px repeat(${compareList.length}, 1fr)`,
                  gap: 2,
                  mb: 2,
                  position: "sticky",
                  top: 0,
                  bgcolor: "#fff",
                  zIndex: 1,
                  pb: 2,
                }}
              >
                <Box />
                {compareList.map((p) => (
                  <Box key={p.id} sx={{ textAlign: "center" }}>
                    <img
                      src={p.imageAvt}
                      alt={p.name}
                      style={{
                        width: 80,
                        height: 80,
                        objectFit: "cover",
                        borderRadius: 8,
                        margin: "0 auto 8px",
                      }}
                    />
                    <Typography variant="body2" fontWeight={600} noWrap>
                      {p.name}
                    </Typography>
                  </Box>
                ))}
              </Box>

              {/* Comparison rows */}
              {compareFeatures.map((feature) => (
                <Box
                  key={feature.key}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: `200px repeat(${compareList.length}, 1fr)`,
                    gap: 2,
                    py: 1.5,
                    borderBottom: "1px solid #f0f0f0",
                    "&:hover": { bgcolor: "#fafafa" },
                  }}
                >
                  <Typography variant="body2" fontWeight={600}>
                    {feature.label}
                  </Typography>
                  {compareList.map((p) => (
                    <Box key={p.id} sx={{ textAlign: "center" }}>
                      {feature.key === "inStock" ? (
                        p.inStock ? (
                          <CheckCircleIcon sx={{ color: "#4caf50" }} />
                        ) : (
                          <CancelIcon sx={{ color: "#f44336" }} />
                        )
                      ) : (
                        <Typography variant="body2">
                          {formatValue(p, feature)}
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Box>
              ))}

              {/* Actions row */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: `200px repeat(${compareList.length}, 1fr)`,
                  gap: 2,
                  mt: 3,
                }}
              >
                <Box />
                {compareList.map((p) => (
                  <Box key={p.id} sx={{ textAlign: "center" }}>
                    <Button
                      variant="contained"
                      size="small"
                      href={`/product/detail?name=${p.slug}`}
                      sx={{
                        bgcolor: "#f25c05",
                        color: "#fff",
                        textTransform: "none",
                      }}
                    >
                      Xem chi tiết
                    </Button>
                  </Box>
                ))}
              </Box>
            </Box>
          ) : (
            <Alert severity="info">
              Cần ít nhất 2 sản phẩm để so sánh. Hiện tại bạn đang có{" "}
              {compareList.length} sản phẩm.
            </Alert>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Đóng</Button>
          <Button onClick={handleClearCompare} color="error" variant="outlined">
            Xóa tất cả
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
