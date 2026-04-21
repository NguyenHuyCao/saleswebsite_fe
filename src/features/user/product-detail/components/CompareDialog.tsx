"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  IconButton,
  Chip,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import Image from "next/image";
import Link from "next/link";

const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/files/`;
const getImg = (src: string) => (src?.startsWith("http") ? src : `${baseUrl}${src}`);

const FEATURES = [
  { key: "price",          label: "Giá bán",      type: "price"  },
  { key: "power",          label: "Công suất",    type: "text"   },
  { key: "fuelType",       label: "Nhiên liệu",   type: "text"   },
  { key: "engineType",     label: "Động cơ",      type: "text"   },
  { key: "weight",         label: "Trọng lượng",  type: "weight" },
  { key: "tankCapacity",   label: "Dung tích",    type: "volume" },
  { key: "dimensions",     label: "Kích thước",   type: "text"   },
  { key: "warrantyMonths", label: "Bảo hành",     type: "month"  },
  { key: "origin",         label: "Xuất xứ",      type: "text"   },
  { key: "inStock",        label: "Tình trạng",   type: "stock"  },
];

function formatValue(item: Product, feature: (typeof FEATURES)[0]): string {
  const value = item[feature.key as keyof Product];
  if (value === undefined || value === null || value === "" || value === 0) return "—";
  switch (feature.type) {
    case "price":  return `${(value as number).toLocaleString("vi-VN")}₫`;
    case "weight": return `${value}kg`;
    case "volume": return `${value}L`;
    case "month":  return `${value} tháng`;
    case "stock":  return (value as boolean) ? "Còn hàng" : "Hết hàng";
    default:       return String(value);
  }
}

function bestValue(feature: (typeof FEATURES)[0], list: Product[]): number | null {
  if (feature.type === "price") {
    const prices = list.map((p) => p.price).filter((v) => v > 0);
    return prices.length ? Math.min(...prices) : null;
  }
  if (feature.key === "warrantyMonths") {
    const vals = list.map((p) => p.warrantyMonths ?? 0).filter((v) => v > 0);
    return vals.length ? Math.max(...vals) : null;
  }
  return null;
}

interface Props {
  open: boolean;
  onClose: () => void;
  compareList: Product[];
  onRemove: (id: number) => void;
  onClear: () => void;
}

export default function CompareDialog({ open, onClose, compareList, onRemove, onClear }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const triggerAiCompare = () => {
    if (compareList.length < 2) return;
    const names = compareList.map((p) => p.name).join(", ");
    window.dispatchEvent(
      new CustomEvent("aiChatTrigger", {
        detail: {
          message: `Hãy so sánh chi tiết các sản phẩm sau và tư vấn tôi nên chọn sản phẩm nào phù hợp nhất: ${names}`,
        },
      })
    );
    onClose();
  };

  if (!compareList.length) return null;

  // ── Sizing constants ──────────────────────────────────────────
  const LABEL_W  = isMobile ? 88  : 160;   // sticky label column width (px)
  const COL_W    = isMobile ? 128 : 0;     // product column width; 0 = 1fr on desktop
  const TABLE_MIN_W = isMobile
    ? LABEL_W + compareList.length * COL_W
    : 640;
  const GRID_COLS = isMobile
    ? `${LABEL_W}px repeat(${compareList.length}, ${COL_W}px)`
    : `${LABEL_W}px repeat(${compareList.length}, 1fr)`;
  const IMG_SIZE  = isMobile ? 52 : 80;
  const FONT_SM   = isMobile ? "0.68rem" : "0.875rem";
  const FONT_LABEL = isMobile ? "0.67rem" : "0.875rem";

  // Shared style for the sticky label cell in each row
  const stickyLabelSx = (bg: string) => ({
    position: "sticky" as const,
    left: 0,
    zIndex: 2,
    bgcolor: bg,
    display: "flex",
    alignItems: "center",
    pl: isMobile ? 1 : 2,
    pr: 0.75,
    borderRight: "1px solid #efefef",
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 3,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          ...(isMobile && { m: 0, height: "100dvh", maxHeight: "100dvh" }),
        },
      }}
    >
      {/* ── Header ─────────────────────────────────────────────── */}
      <DialogTitle
        component="div"
        sx={{
          bgcolor: "#f25c05",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          py: isMobile ? 1.25 : 1.75,
          px: isMobile ? 1.5 : 3,
          flexShrink: 0,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <CompareArrowsIcon sx={{ fontSize: isMobile ? 20 : 24 }} />
          <Typography fontWeight={700} sx={{ fontSize: isMobile ? "0.95rem" : "1.25rem" }}>
            So sánh sản phẩm
          </Typography>
          <Chip
            label={`${compareList.length}`}
            size="small"
            sx={{
              bgcolor: "rgba(255,255,255,0.25)",
              color: "#fff",
              fontWeight: 700,
              height: 20,
              fontSize: "0.7rem",
            }}
          />
        </Stack>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ color: "#fff", "&:hover": { bgcolor: "rgba(255,255,255,0.15)" } }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* ── Scroll hint — mobile only, 3+ products ─────────────── */}
      {isMobile && compareList.length >= 3 && (
        <Box
          sx={{
            bgcolor: "#fff8f0",
            borderBottom: "1px solid #ffe0cc",
            py: 0.5,
            px: 2,
            display: "flex",
            alignItems: "center",
            gap: 0.75,
            flexShrink: 0,
          }}
        >
          <Typography sx={{ fontSize: "0.68rem", color: "#f25c05", fontWeight: 500 }}>
            ← Vuốt ngang để xem thêm →
          </Typography>
        </Box>
      )}

      {/* ── Scrollable content ─────────────────────────────────── */}
      <DialogContent
        sx={{
          p: 0,
          overflow: "auto",
          bgcolor: "#fafafa",
          flexGrow: 1,
          // Custom scrollbar for desktop
          "&::-webkit-scrollbar": { width: 6, height: 6 },
          "&::-webkit-scrollbar-thumb": { bgcolor: "#ddd", borderRadius: 3 },
        }}
      >
        <Box sx={{ minWidth: TABLE_MIN_W }}>

          {/* ── Product header row — sticky top ─────────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: GRID_COLS,
              position: "sticky",
              top: 0,
              zIndex: 10,
              bgcolor: "#fafafa",
              borderBottom: "2px solid #f25c05",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            {/* Corner cell */}
            <Box sx={{ ...stickyLabelSx("#fafafa"), zIndex: 12, minHeight: isMobile ? 100 : 130 }} />

            {compareList.map((p) => (
              <Box
                key={p.id}
                sx={{
                  textAlign: "center",
                  bgcolor: "#fafafa",
                  px: isMobile ? 0.5 : 1.5,
                  py: isMobile ? 1 : 1.5,
                }}
              >
                {/* Thumbnail */}
                <Box
                  sx={{
                    position: "relative",
                    width: IMG_SIZE,
                    height: IMG_SIZE,
                    mx: "auto",
                    mb: 0.75,
                    borderRadius: 2,
                    overflow: "hidden",
                    bgcolor: "#fff",
                    border: "1px solid #ebebeb",
                  }}
                >
                  <Image
                    src={getImg(p.imageAvt)}
                    alt={p.name}
                    fill
                    unoptimized
                    style={{ objectFit: "cover" }}
                  />
                </Box>

                {/* Name */}
                <Typography
                  fontWeight={700}
                  sx={{
                    fontSize: FONT_SM,
                    lineHeight: 1.3,
                    mb: 0.25,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {p.name}
                </Typography>

                {/* Price */}
                <Typography
                  fontWeight={700}
                  color="error.main"
                  sx={{ fontSize: FONT_SM }}
                >
                  {p.price > 0 ? `${p.price.toLocaleString("vi-VN")}₫` : "Liên hệ"}
                </Typography>

                {/* Remove */}
                <IconButton
                  size="small"
                  onClick={() => onRemove(p.id)}
                  sx={{ mt: 0.25, p: 0.4, "&:hover": { color: "#f25c05" } }}
                >
                  <CloseIcon sx={{ fontSize: isMobile ? 12 : 14 }} />
                </IconButton>
              </Box>
            ))}
          </Box>

          {/* ── Feature rows ────────────────────────────────────── */}
          {FEATURES.map((feature, fi) => {
            const best = bestValue(feature, compareList);
            const rowBg = fi % 2 === 0 ? "#ffffff" : "#f5f5f5";

            return (
              <Box
                key={feature.key}
                sx={{
                  display: "grid",
                  gridTemplateColumns: GRID_COLS,
                  bgcolor: rowBg,
                  minHeight: isMobile ? 44 : 52,
                  borderBottom: "1px solid #efefef",
                  "&:hover": { bgcolor: "#fff8f4" },
                  "&:hover .sticky-label": { bgcolor: "#fff8f4" },
                  transition: "background-color 0.15s",
                }}
              >
                {/* Sticky label */}
                <Box
                  className="sticky-label"
                  sx={{ ...stickyLabelSx(rowBg), transition: "background-color 0.15s" }}
                >
                  <Typography
                    fontWeight={600}
                    color="text.secondary"
                    sx={{ fontSize: FONT_LABEL, lineHeight: 1.3 }}
                  >
                    {feature.label}
                  </Typography>
                </Box>

                {/* Values */}
                {compareList.map((p) => {
                  const raw = p[feature.key as keyof Product];
                  const display = formatValue(p, feature);
                  const isBest = best !== null && raw === best;
                  return (
                    <Box
                      key={p.id}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        px: isMobile ? 0.5 : 1,
                        textAlign: "center",
                      }}
                    >
                      {feature.key === "inStock" ? (
                        p.inStock ? (
                          <Chip
                            icon={<CheckCircleIcon />}
                            label="Còn hàng"
                            size="small"
                            color="success"
                            sx={{
                              fontWeight: 600,
                              fontSize: isMobile ? "0.6rem" : "0.75rem",
                              height: isMobile ? 20 : 26,
                              "& .MuiChip-icon": { fontSize: isMobile ? 11 : 14 },
                            }}
                          />
                        ) : (
                          <Chip
                            icon={<CancelIcon />}
                            label="Hết hàng"
                            size="small"
                            color="error"
                            sx={{
                              fontWeight: 600,
                              fontSize: isMobile ? "0.6rem" : "0.75rem",
                              height: isMobile ? 20 : 26,
                              "& .MuiChip-icon": { fontSize: isMobile ? 11 : 14 },
                            }}
                          />
                        )
                      ) : (
                        <Typography
                          fontWeight={isBest ? 700 : 400}
                          sx={{
                            fontSize: FONT_SM,
                            color: isBest ? "#f25c05" : "text.primary",
                            lineHeight: 1.3,
                          }}
                        >
                          {display}
                          {isBest && (
                            <Box
                              component="span"
                              sx={{ ml: 0.25, fontSize: "0.58rem", color: "#f25c05" }}
                            >
                              ✦
                            </Box>
                          )}
                        </Typography>
                      )}
                    </Box>
                  );
                })}
              </Box>
            );
          })}

          {/* ── CTA row ─────────────────────────────────────────── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: GRID_COLS,
              bgcolor: "#fff",
              borderTop: "2px solid #f25c05",
              py: isMobile ? 1 : 1.5,
            }}
          >
            <Box sx={{ ...stickyLabelSx("#fff") }}>
              <Typography
                fontWeight={600}
                color="text.secondary"
                sx={{ fontSize: FONT_LABEL }}
              >
                Chi tiết
              </Typography>
            </Box>
            {compareList.map((p) => (
              <Box
                key={p.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  px: isMobile ? 0.5 : 1,
                }}
              >
                <Button
                  variant="contained"
                  size="small"
                  component={Link}
                  href={`/product/detail?name=${p.slug}`}
                  onClick={onClose}
                  fullWidth
                  sx={{
                    bgcolor: "#f25c05",
                    color: "#fff",
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: 2,
                    fontSize: isMobile ? "0.63rem" : "0.8rem",
                    py: isMobile ? 0.5 : 0.75,
                    whiteSpace: "nowrap",
                    "&:hover": { bgcolor: "#d94f00" },
                  }}
                >
                  {isMobile ? "Xem" : "Xem chi tiết"}
                </Button>
              </Box>
            ))}
          </Box>
        </Box>
      </DialogContent>

      {/* ── Footer actions ─────────────────────────────────────── */}
      <DialogActions
        sx={{
          px: isMobile ? 1.5 : 3,
          py: isMobile ? 1 : 1.5,
          borderTop: "1px solid #f0f0f0",
          flexShrink: 0,
          gap: 1,
          flexDirection: isMobile ? "column" : "row",
          alignItems: "stretch",
        }}
      >
        {/* AI button — full width on mobile, left-aligned on desktop */}
        <Button
          variant="outlined"
          size={isMobile ? "medium" : "medium"}
          startIcon={<SmartToyIcon />}
          onClick={triggerAiCompare}
          fullWidth={isMobile}
          sx={{
            textTransform: "none",
            borderColor: "#f25c05",
            color: "#f25c05",
            fontWeight: 600,
            fontSize: isMobile ? "0.8rem" : "0.875rem",
            "&:hover": { bgcolor: "#fff3e0", borderColor: "#d94f00" },
            order: isMobile ? 0 : 0,
          }}
        >
          Nhờ AI tư vấn
        </Button>

        {/* Spacer for desktop */}
        {!isMobile && <Box flex={1} />}

        {/* Clear + Close */}
        <Stack
          direction="row"
          spacing={1}
          sx={{ width: isMobile ? "100%" : "auto" }}
        >
          <Button
            onClick={onClear}
            color="error"
            variant="outlined"
            size="small"
            fullWidth={isMobile}
            sx={{
              textTransform: "none",
              fontSize: isMobile ? "0.75rem" : "0.875rem",
              borderColor: "error.light",
            }}
          >
            Xóa tất cả
          </Button>
          <Button
            onClick={onClose}
            variant="outlined"
            size="small"
            fullWidth={isMobile}
            sx={{ textTransform: "none", fontSize: isMobile ? "0.75rem" : "0.875rem" }}
          >
            Đóng
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
