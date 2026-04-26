"use client";

import { useState, useEffect, useCallback } from "react";
import { Box, Button, IconButton, Typography, Tooltip, Stack, Chip } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import {
  getCompareList,
  removeFromCompare,
  clearCompare,
  COMPARE_EVENT,
} from "@/lib/utils/compareStorage";
import CompareDialog from "@/features/user/product-detail/components/CompareDialog";

const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/files/`;
const getImg = (src: string) => (src?.startsWith("http") ? src : `${baseUrl}${src}`);

export default function CompareFloatingBar() {
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const sync = useCallback(() => setCompareList(getCompareList()), []);

  useEffect(() => {
    sync();
    window.addEventListener(COMPARE_EVENT, sync);
    return () => window.removeEventListener(COMPARE_EVENT, sync);
  }, [sync]);

  const visible = compareList.length >= 1;

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 1300,
              display: "flex",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            <Box
              sx={{
                width: "100%",
                maxWidth: 860,
                mx: { xs: 0, sm: 2 },
                mb: { xs: 0, sm: 2 },
                bgcolor: "#1a1a1a",
                borderRadius: { xs: "12px 12px 0 0", sm: 3 },
                boxShadow: "0 -4px 32px rgba(0,0,0,0.35)",
                px: { xs: 1.5, sm: 3 },
                py: 1.5,
                display: "flex",
                alignItems: "center",
                gap: { xs: 1, sm: 2 },
                pointerEvents: "auto",
                flexWrap: "nowrap",
                overflow: "hidden",
              }}
            >
              {/* Icon + label */}
              <Stack direction="row" alignItems="center" spacing={1} flexShrink={0}>
                <CompareArrowsIcon sx={{ color: "#f25c05", fontSize: 22 }} />
                <Box sx={{ display: { xs: "none", sm: "block" } }}>
                  <Typography variant="caption" color="rgba(255,255,255,0.6)" display="block" lineHeight={1}>
                    So sánh
                  </Typography>
                  <Typography variant="body2" color="#fff" fontWeight={700} lineHeight={1.2}>
                    {compareList.length} sản phẩm
                  </Typography>
                </Box>
                <Chip
                  label={`${compareList.length}/4`}
                  size="small"
                  sx={{ bgcolor: "#f25c05", color: "#fff", fontWeight: 700, fontSize: "0.7rem", height: 20, display: { xs: "flex", sm: "none" } }}
                />
              </Stack>

              {/* Thumbnail strip */}
              <Stack direction="row" spacing={0.75} flex={1} overflow="hidden" alignItems="center">
                {compareList.map((p) => (
                  <Tooltip key={p.id} title={p.name} arrow>
                    <Box
                      sx={{
                        position: "relative",
                        width: { xs: 40, sm: 48 },
                        height: { xs: 40, sm: 48 },
                        flexShrink: 0,
                        borderRadius: 1.5,
                        overflow: "hidden",
                        border: "2px solid rgba(255,255,255,0.2)",
                        bgcolor: "#333",
                        cursor: "pointer",
                        "&:hover .remove-overlay": { opacity: 1 },
                      }}
                    >
                      <Image src={getImg(p.imageAvt)} alt={p.name} fill unoptimized style={{ objectFit: "cover" }} />
                      <Box
                        className="remove-overlay"
                        onClick={() => removeFromCompare(p.id)}
                        sx={{
                          position: "absolute",
                          inset: 0,
                          bgcolor: "rgba(242,92,5,0.85)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          opacity: 0,
                          transition: "opacity 0.15s",
                        }}
                      >
                        <CloseIcon sx={{ color: "#fff", fontSize: 18 }} />
                      </Box>
                    </Box>
                  </Tooltip>
                ))}
                {/* Empty slots */}
                {Array.from({ length: 4 - compareList.length }).map((_, i) => (
                  <Box
                    key={`empty-${i}`}
                    sx={{
                      width: { xs: 40, sm: 48 },
                      height: { xs: 40, sm: 48 },
                      flexShrink: 0,
                      borderRadius: 1.5,
                      border: "2px dashed rgba(255,255,255,0.2)",
                      display: { xs: "none", sm: "flex" },
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography variant="caption" color="rgba(255,255,255,0.25)" fontSize="1.2rem">+</Typography>
                  </Box>
                ))}
              </Stack>

              {/* Actions */}
              <Stack direction="row" spacing={1} flexShrink={0} alignItems="center">
                <Button
                  variant="contained"
                  size="small"
                  disabled={compareList.length < 2}
                  onClick={() => setDialogOpen(true)}
                  sx={{
                    bgcolor: "#f25c05",
                    color: "#fff",
                    fontWeight: 700,
                    textTransform: "none",
                    borderRadius: 2,
                    px: { xs: 1.5, sm: 2.5 },
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    "&:hover": { bgcolor: "#d94f00" },
                    "&:disabled": { bgcolor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.3)" },
                    whiteSpace: "nowrap",
                  }}
                >
                  {compareList.length < 2 ? "Thêm 1 nữa" : "So sánh ngay"}
                </Button>
                <Tooltip title="Xóa tất cả">
                  <IconButton
                    onClick={clearCompare}
                    size="small"
                    sx={{ color: "rgba(255,255,255,0.5)", "&:hover": { color: "#f25c05" } }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

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
