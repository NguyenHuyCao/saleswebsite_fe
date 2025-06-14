"use client";

import {
  Box,
  Stack,
  Dialog,
  DialogContent,
  useTheme,
  useMediaQuery,
  IconButton,
} from "@mui/material";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CloseIcon from "@mui/icons-material/Close";

interface Props {
  product: {
    imageAvt: string;
    imageDetail1: string | null;
    imageDetail2: string | null;
    imageDetail3: string | null;
    name: string;
  };
}

export const ImageGallery = ({ product }: Props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/files/`;
  const images = [
    product.imageAvt,
    product.imageDetail1,
    product.imageDetail2,
    product.imageDetail3,
  ].filter((img): img is string => Boolean(img));

  const [open, setOpen] = useState(false);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  const handleOpen = (src: string) => {
    setSelectedImg(src.startsWith("http") ? src : `${baseUrl}${src}`);
    setOpen(true);
  };

  return (
    <Box>
      {/* Ảnh chính */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.25 }}
        onClick={() => handleOpen(product.imageAvt)}
        style={{
          width: "100%",
          aspectRatio: "1 / 1",
          borderRadius: 12,
          overflow: "hidden",
          cursor: "zoom-in",
          backgroundColor: "#fafafa",
          position: "relative",
        }}
      >
        <Image
          src={product.imageAvt}
          alt={product.name}
          fill
          style={{ objectFit: "cover", transition: "opacity 0.3s" }}
          sizes="(max-width: 600px) 100vw, 400px"
        />
      </motion.div>

      {/* Danh sách ảnh nhỏ */}
      <Stack
        direction="row"
        spacing={1}
        mt={2}
        overflow="auto"
        sx={{
          "&::-webkit-scrollbar": { display: "none" },
          scrollbarWidth: "none",
        }}
      >
        {images.map((src, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Box
              onClick={() => handleOpen(src)}
              sx={{
                flex: "0 0 auto",
                width: 70,
                height: 70,
                borderRadius: 2,
                border: "1px solid #ddd",
                overflow: "hidden",
                cursor: "pointer",
                bgcolor: "#fff",
                "&:hover": { borderColor: "#f25c05" },
                position: "relative",
              }}
            >
              <Image
                src={src.startsWith("http") ? src : `${baseUrl}${src}`}
                alt={`Ảnh chi tiết ${i + 1}`}
                fill
                style={{ objectFit: "cover" }}
              />
            </Box>
          </motion.div>
        ))}
      </Stack>

      {/* Lightbox Dialog với animation */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="lg"
        disableScrollLock={true}
        PaperProps={{
          sx: {
            backgroundColor: "rgba(0,0,0,0.8)",
            boxShadow: "none",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
        }}
      >
        <DialogContent sx={{ p: 0, position: "relative" }}>
          <IconButton
            onClick={() => setOpen(false)}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              zIndex: 10,
              color: "#fff",
            }}
          >
            <CloseIcon />
          </IconButton>

          <AnimatePresence>
            {selectedImg && (
              <motion.div
                key={selectedImg}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <Box
                  sx={{
                    width: isMobile ? "90vw" : "70vw",
                    height: isMobile ? "90vw" : "70vh",
                    position: "relative",
                  }}
                >
                  <Image
                    src={selectedImg}
                    alt="Xem ảnh lớn"
                    fill
                    style={{ objectFit: "contain" }}
                  />
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </Box>
  );
};
