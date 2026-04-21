"use client";

import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  Chip,
  IconButton,
  Tooltip,
  Divider,
  InputBase,
  CircularProgress,
  Collapse,
} from "@mui/material";
import { motion } from "framer-motion";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import Image from "next/image";
import { useState, useEffect, useCallback, useRef } from "react";
import { http } from "@/lib/api/http";
import {
  getCompareList,
  addToCompare,
  removeFromCompare,
  clearCompare,
  COMPARE_EVENT,
  COMPARE_MAX,
} from "@/lib/utils/compareStorage";
import CompareDialog from "./CompareDialog";

interface Props {
  product: Product;
}

interface SearchResult {
  name: string;
  slug: string;
  imageAvt: string;
  price: number;
  id: number;
  inStock: boolean;
}

const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/files/`;
const getImg = (src: string) => (src?.startsWith("http") ? src : `${baseUrl}${src}`);

export default function ProductCompare({ product }: Props) {
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Search state
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const sync = useCallback(() => setCompareList(getCompareList()), []);

  useEffect(() => {
    sync();
    window.addEventListener(COMPARE_EVENT, sync);
    return () => window.removeEventListener(COMPARE_EVENT, sync);
  }, [sync]);

  // Debounced search
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) { setResults([]); return; }

    const timer = setTimeout(async () => {
      abortRef.current?.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      setSearching(true);
      try {
        const res = await http.get(`/api/v1/products?search=${encodeURIComponent(trimmed)}`, { signal: ctrl.signal });
        const data = (res as any)?.data?.data ?? (res as any)?.data;
        let raw: any[] = Array.isArray(data) ? data : (data?.result ?? data?.items ?? data?.rows ?? []);
        const compareIds = new Set(getCompareList().map((p) => p.id));
        setResults(
          raw.slice(0, 6).map((p: any) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            imageAvt: p.imageAvt,
            price: p.pricePerUnit ?? p.price ?? 0,
            inStock: p.active === true && (p.stockQuantity ?? 0) > 0,
          })).filter((r) => r.id !== product.id) // exclude current product
        );
      } catch { /* abort or error — ignore */ } finally { setSearching(false); }
    }, 320);

    return () => { clearTimeout(timer); abortRef.current?.abort(); };
  }, [query, product.id]);

  const inCompare = compareList.some((p) => p.id === product.id);
  const canAddMore = compareList.length < COMPARE_MAX;

  const handleToggleCurrent = () => {
    if (inCompare) {
      removeFromCompare(product.id);
    } else {
      addToCompare(product);
    }
  };

  const handleAddFromSearch = (r: SearchResult) => {
    const alreadyIn = compareList.some((p) => p.id === r.id);
    if (alreadyIn || !canAddMore) return;
    // Build a minimal Product shape from search result
    addToCompare({
      id: r.id,
      name: r.name,
      slug: r.slug,
      imageAvt: r.imageAvt,
      price: r.price,
      pricePerUnit: r.price,
      originalPrice: r.price,
      sale: false,
      inStock: r.inStock,
      label: r.inStock ? "Còn hàng" : "Hết hàng",
      stockQuantity: 0,
      totalStock: 0,
      status: [],
    } as unknown as Product);
    setQuery("");
    setResults([]);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: 2.5,
            border: "1.5px solid",
            borderColor: inCompare ? "#f25c05" : "#ebebeb",
            bgcolor: inCompare ? "#fff8f4" : "#fff",
            transition: "border-color 0.2s, background-color 0.2s",
          }}
        >
          {/* Header */}
          <Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
            <Box sx={{ bgcolor: "#f25c05", width: 32, height: 32, borderRadius: 1.5, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <CompareArrowsIcon sx={{ color: "#fff", fontSize: 18 }} />
            </Box>
            <Typography variant="body1" fontWeight={700} flex={1}>
              So sánh sản phẩm
            </Typography>
            {compareList.length > 0 && (
              <Chip label={`${compareList.length}/${COMPARE_MAX}`} size="small" sx={{ bgcolor: "#f25c05", color: "#fff", fontWeight: 700, height: 22, fontSize: "0.72rem" }} />
            )}
          </Stack>

          {/* Toggle current product */}
          <Button
            fullWidth
            variant={inCompare ? "outlined" : "contained"}
            size="small"
            startIcon={inCompare ? <RemoveIcon /> : <AddIcon />}
            onClick={handleToggleCurrent}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 2,
              py: 0.9,
              ...(inCompare
                ? { borderColor: "#f25c05", color: "#f25c05", "&:hover": { borderColor: "#d94f00", bgcolor: "#fff3e0" } }
                : { bgcolor: "#f25c05", "&:hover": { bgcolor: "#d94f00" }, boxShadow: "0 3px 10px rgba(242,92,5,0.25)" }),
            }}
          >
            {inCompare ? "Bỏ so sánh sản phẩm này" : "Thêm sản phẩm này vào so sánh"}
          </Button>

          {/* ── Search to add other products ── */}
          {canAddMore && (
            <Box mt={1.5}>
              {!searchOpen ? (
                <Button
                  fullWidth
                  variant="text"
                  size="small"
                  startIcon={<SearchIcon sx={{ fontSize: 16 }} />}
                  onClick={() => { setSearchOpen(true); setTimeout(() => inputRef.current?.focus(), 50); }}
                  sx={{ textTransform: "none", color: "#666", justifyContent: "flex-start", px: 1, py: 0.6, borderRadius: 1.5, "&:hover": { bgcolor: "#f5f5f5", color: "#f25c05" } }}
                >
                  Tìm sản phẩm khác để so sánh…
                </Button>
              ) : (
                <Box>
                  {/* Search input */}
                  <Box sx={{ display: "flex", alignItems: "center", border: "1.5px solid #f25c05", borderRadius: 2, px: 1.25, py: 0.5, bgcolor: "#fff" }}>
                    <SearchIcon sx={{ fontSize: 16, color: "#f25c05", mr: 0.75, flexShrink: 0 }} />
                    <InputBase
                      inputRef={inputRef}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Tìm sản phẩm…"
                      sx={{ flex: 1, fontSize: "0.85rem" }}
                    />
                    {searching ? (
                      <CircularProgress size={14} sx={{ color: "#f25c05", flexShrink: 0 }} />
                    ) : (
                      <IconButton size="small" sx={{ p: 0.25 }} onClick={() => { setSearchOpen(false); setQuery(""); setResults([]); }}>
                        <CloseIcon sx={{ fontSize: 14, color: "#999" }} />
                      </IconButton>
                    )}
                  </Box>

                  {/* Results dropdown */}
                  <Collapse in={results.length > 0}>
                    <Box sx={{ mt: 0.75, border: "1px solid #f0f0f0", borderRadius: 2, overflow: "hidden", bgcolor: "#fff", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
                      {results.map((r, i) => {
                        const alreadyIn = compareList.some((p) => p.id === r.id);
                        return (
                          <Box
                            key={r.id}
                            onClick={() => !alreadyIn && handleAddFromSearch(r)}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              px: 1.25,
                              py: 0.9,
                              cursor: alreadyIn ? "default" : "pointer",
                              borderTop: i > 0 ? "1px solid #f5f5f5" : "none",
                              bgcolor: alreadyIn ? "#fafafa" : "#fff",
                              opacity: alreadyIn ? 0.65 : 1,
                              "&:hover": !alreadyIn ? { bgcolor: "#fff8f4" } : {},
                              transition: "background-color 0.15s",
                            }}
                          >
                            <Box sx={{ width: 36, height: 36, borderRadius: 1, overflow: "hidden", position: "relative", flexShrink: 0, bgcolor: "#f5f5f5" }}>
                              <Image src={getImg(r.imageAvt)} alt={r.name} fill unoptimized style={{ objectFit: "cover" }} />
                            </Box>
                            <Box flex={1} minWidth={0}>
                              <Typography variant="caption" fontWeight={600} display="block" sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {r.name}
                              </Typography>
                              <Typography variant="caption" color={r.price > 0 ? "error.main" : "text.secondary"} fontWeight={700}>
                                {r.price > 0 ? `${r.price.toLocaleString("vi-VN")}₫` : "Liên hệ"}
                              </Typography>
                            </Box>
                            {alreadyIn ? (
                              <Chip label="Đã thêm" size="small" sx={{ bgcolor: "#fff3e0", color: "#f25c05", height: 20, fontSize: "0.6rem", fontWeight: 700 }} />
                            ) : (
                              <AddIcon sx={{ fontSize: 16, color: "#f25c05", flexShrink: 0 }} />
                            )}
                          </Box>
                        );
                      })}
                    </Box>
                  </Collapse>

                  {query.trim() && !searching && results.length === 0 && (
                    <Typography variant="caption" color="text.secondary" display="block" textAlign="center" mt={0.75}>
                      Không tìm thấy sản phẩm phù hợp
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
          )}

          {/* Compare list */}
          {compareList.length > 0 && (
            <>
              <Divider sx={{ my: 1.5 }} />
              <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" mb={1}>
                ĐANG SO SÁNH ({compareList.length})
              </Typography>
              <Stack spacing={0.75}>
                {compareList.map((p) => (
                  <Box
                    key={p.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      p: 0.75,
                      borderRadius: 1.5,
                      bgcolor: p.id === product.id ? "#fff3e0" : "#fafafa",
                      border: "1px solid",
                      borderColor: p.id === product.id ? "#f25c05" : "#f0f0f0",
                    }}
                  >
                    <Box sx={{ width: 34, height: 34, borderRadius: 1, overflow: "hidden", flexShrink: 0, position: "relative", bgcolor: "#f5f5f5" }}>
                      <Image src={getImg(p.imageAvt)} alt={p.name} fill unoptimized style={{ objectFit: "cover" }} />
                    </Box>
                    <Typography
                      variant="caption"
                      fontWeight={p.id === product.id ? 700 : 500}
                      sx={{
                        flex: 1, overflow: "hidden", textOverflow: "ellipsis",
                        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                        lineHeight: 1.3, color: p.id === product.id ? "#f25c05" : "text.primary",
                      }}
                    >
                      {p.name}
                      {p.id === product.id && (
                        <Box component="span" sx={{ ml: 0.5, fontSize: "0.6rem", bgcolor: "#f25c05", color: "#fff", px: 0.5, py: 0.1, borderRadius: 0.5 }}>
                          Đang xem
                        </Box>
                      )}
                    </Typography>
                    <Tooltip title="Xóa khỏi so sánh">
                      <IconButton size="small" onClick={() => removeFromCompare(p.id)} sx={{ flexShrink: 0, p: 0.25, "&:hover": { color: "#f25c05" } }}>
                        <CloseIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                ))}
              </Stack>

              <Stack direction="row" spacing={1} mt={1.5}>
                <Button
                  fullWidth
                  variant="contained"
                  size="small"
                  disabled={compareList.length < 2}
                  onClick={() => setDialogOpen(true)}
                  sx={{
                    textTransform: "none", fontWeight: 700, borderRadius: 2,
                    bgcolor: "#f25c05", "&:hover": { bgcolor: "#d94f00" },
                    "&:disabled": { bgcolor: "#f5f5f5", color: "#bbb" },
                  }}
                >
                  So sánh ngay ({compareList.length})
                </Button>
                <Tooltip title="Xóa tất cả">
                  <IconButton size="small" onClick={clearCompare} sx={{ border: "1px solid #e0e0e0", borderRadius: 1.5, "&:hover": { borderColor: "#f25c05", color: "#f25c05" } }}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>

              {compareList.length < 2 && (
                <Typography variant="caption" color="text.secondary" display="block" textAlign="center" mt={0.75}>
                  Cần ít nhất 2 sản phẩm để so sánh
                </Typography>
              )}
            </>
          )}
        </Paper>
      </motion.div>

      <CompareDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        compareList={compareList}
        onRemove={removeFromCompare}
        onClear={clearCompare}
      />
    </>
  );
}
