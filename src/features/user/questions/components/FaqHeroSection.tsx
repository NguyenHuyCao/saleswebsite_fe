// questions/components/FaqHeroSection.tsx
"use client";

import {
  Box,
  Typography,
  Button,
  Stack,
  Chip,
  Container,
  TextField,
  Paper,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import { motion } from "framer-motion";
import Image from "next/image";
import SearchIcon from "@mui/icons-material/Search";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { faqData } from "../constants/faqData";

interface Props {
  searchTerm: string;
  onSearchChange: (val: string) => void;
}

export default function FaqHeroSection({ searchTerm, onSearchChange }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const faqSuggestions = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const term = searchTerm.toLowerCase();
    return faqData
      .flatMap((c) => c.questions)
      .filter((q) => q.q.toLowerCase().includes(term))
      .slice(0, 5)
      .map((q) => q.q);
  }, [searchTerm]);

  const scrollToFaq = () => {
    document.getElementById("faq-section")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSearch = () => {
    setOpen(false);
    scrollToFaq();
  };

  const handleSuggestionClick = (question: string) => {
    onSearchChange(question);
    setOpen(false);
    setTimeout(scrollToFaq, 100);
  };

  const handleProductSearch = () => {
    if (searchTerm.trim()) {
      router.push(`/product?search=${encodeURIComponent(searchTerm.trim())}`);
    }
    setOpen(false);
  };

  const showDropdown = open && searchTerm.trim().length > 0;

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: { xs: 500, md: 550 },
        bgcolor: "#f5f5f5",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(circle at 30% 50%, #f25c05 0%, transparent 50%)",
          opacity: 0.1,
        }}
      />

      {/* Decorative Circles */}
      <Box
        sx={{
          position: "absolute",
          top: -50,
          right: -50,
          width: 200,
          height: 200,
          borderRadius: "50%",
          bgcolor: "#ffb700",
          opacity: 0.05,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -30,
          left: -30,
          width: 150,
          height: 150,
          borderRadius: "50%",
          bgcolor: "#f25c05",
          opacity: 0.05,
        }}
      />

      <Container
        maxWidth="lg"
        sx={{ position: "relative", py: { xs: 6, md: 8 } }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          alignItems="center"
          spacing={{ xs: 6, md: 4 }}
          sx={{ width: "100%" }}
        >
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            style={{ flex: 1 }}
          >
            <Box sx={{ maxWidth: 600 }}>
              {/* Badge */}
              <Chip
                icon={<HelpOutlineIcon />}
                label="TRUNG TÂM HỖ TRỢ"
                sx={{
                  bgcolor: "#f25c05",
                  color: "#fff",
                  fontWeight: 700,
                  mb: 3,
                  px: 2,
                  py: 1.5,
                  fontSize: "0.85rem",
                  "& .MuiChip-icon": { color: "#fff" },
                }}
              />

              {/* Title */}
              <Typography
                variant="h2"
                fontWeight={900}
                sx={{
                  fontSize: { xs: "2.2rem", md: "3.2rem" },
                  mb: 2,
                  lineHeight: 1.2,
                }}
              >
                Bạn cần hỗ trợ?
                <Box
                  component="span"
                  sx={{ color: "#f25c05", display: "block", mt: 1 }}
                >
                  Chúng tôi sẵn sàng giúp đỡ!
                </Box>
              </Typography>

              {/* Description */}
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mb: 4, fontSize: "1.1rem", maxWidth: 500 }}
              >
                Tìm câu trả lời nhanh chóng với hàng trăm bài viết hướng dẫn
                hoặc liên hệ trực tiếp với đội ngũ hỗ trợ của chúng tôi.
              </Typography>

              {/* Search Bar with Suggestion Dropdown */}
              <ClickAwayListener onClickAway={() => setOpen(false)}>
                <Box sx={{ position: "relative", maxWidth: 500, mb: 4 }}>
                  <Paper
                    elevation={2}
                    sx={{
                      p: 0.5,
                      pl: 2,
                      display: "flex",
                      alignItems: "center",
                      borderRadius: 4,
                    }}
                  >
                    <SearchIcon sx={{ color: "#999", mr: 1 }} />
                    <TextField
                      fullWidth
                      placeholder="Tìm kiếm câu hỏi thường gặp..."
                      variant="standard"
                      value={searchTerm}
                      onChange={(e) => {
                        onSearchChange(e.target.value);
                        setOpen(true);
                      }}
                      onFocus={() => setOpen(true)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSearch();
                        if (e.key === "Escape") setOpen(false);
                      }}
                      slotProps={{
                        input: {
                          disableUnderline: true,
                          sx: { fontSize: "0.95rem" },
                        },
                      }}
                    />
                    <Button
                      variant="contained"
                      onClick={handleSearch}
                      sx={{
                        bgcolor: "#f25c05",
                        color: "#fff",
                        px: 4,
                        py: 1.5,
                        borderRadius: 3,
                        flexShrink: 0,
                        "&:hover": { bgcolor: "#e64a19" },
                      }}
                    >
                      Tìm
                    </Button>
                  </Paper>

                  {/* Suggestion Dropdown */}
                  {showDropdown && (
                    <Paper
                      elevation={4}
                      sx={{
                        position: "absolute",
                        top: "calc(100% + 8px)",
                        left: 0,
                        right: 0,
                        zIndex: 1300,
                        borderRadius: 3,
                        overflow: "hidden",
                        maxHeight: 340,
                        overflowY: "auto",
                      }}
                    >
                      {/* FAQ Suggestions */}
                      {faqSuggestions.length > 0 && (
                        <>
                          <Box sx={{ px: 2, py: 1, bgcolor: "#f9f9f9" }}>
                            <Typography
                              variant="caption"
                              fontWeight={700}
                              color="text.secondary"
                              sx={{ textTransform: "uppercase", letterSpacing: 1 }}
                            >
                              Câu hỏi thường gặp
                            </Typography>
                          </Box>
                          <List dense disablePadding>
                            {faqSuggestions.map((q, i) => (
                              <ListItemButton
                                key={i}
                                onClick={() => handleSuggestionClick(q)}
                                sx={{
                                  px: 2,
                                  "&:hover": { bgcolor: "#fff8f0" },
                                }}
                              >
                                <ListItemIcon sx={{ minWidth: 32 }}>
                                  <QuestionAnswerIcon
                                    sx={{ fontSize: 18, color: "#ffb700" }}
                                  />
                                </ListItemIcon>
                                <ListItemText
                                  primary={q}
                                  slotProps={{
                                    primary: { fontSize: "0.9rem" },
                                  }}
                                />
                              </ListItemButton>
                            ))}
                          </List>
                          <Divider />
                        </>
                      )}

                      {/* Product Search Option */}
                      <ListItemButton
                        onClick={handleProductSearch}
                        sx={{
                          px: 2,
                          py: 1.5,
                          "&:hover": { bgcolor: "#fff3e0" },
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <ShoppingBagIcon
                            sx={{ fontSize: 18, color: "#f25c05" }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography fontSize="0.9rem">
                              Tìm sản phẩm:{" "}
                              <Box
                                component="span"
                                fontWeight={700}
                                color="#f25c05"
                              >
                                &quot;{searchTerm}&quot;
                              </Box>
                            </Typography>
                          }
                        />
                      </ListItemButton>

                      {/* No FAQ results */}
                      {faqSuggestions.length === 0 && (
                        <Box sx={{ px: 2, py: 1.5 }}>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            fontSize="0.88rem"
                          >
                            Không tìm thấy câu hỏi phù hợp — thử tìm trong sản phẩm bên trên.
                          </Typography>
                        </Box>
                      )}
                    </Paper>
                  )}
                </Box>
              </ClickAwayListener>

              {/* Quick Stats */}
              <Stack
                direction="row"
                spacing={{ xs: 2, sm: 4 }}
                sx={{ flexWrap: "wrap", gap: 2 }}
              >
                {[
                  { value: "50+", label: "Câu hỏi" },
                  { value: "24/7", label: "Hỗ trợ" },
                  { value: "15'", label: "Phản hồi" },
                ].map(({ value, label }) => (
                  <Paper
                    key={label}
                    elevation={0}
                    sx={{
                      p: 2,
                      minWidth: 100,
                      bgcolor: "#fff",
                      borderRadius: 3,
                      textAlign: "center",
                    }}
                  >
                    <Typography variant="h4" fontWeight={800} color="#f25c05">
                      {value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {label}
                    </Typography>
                  </Paper>
                ))}
              </Stack>

              {/* Trust Badge */}
              <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
                <Chip
                  label="✓ Hỗ trợ tận tâm"
                  size="small"
                  sx={{ bgcolor: "#f5f5f5" }}
                />
                <Chip
                  label="✓ Giải đáp nhanh chóng"
                  size="small"
                  sx={{ bgcolor: "#f5f5f5" }}
                />
              </Stack>
            </Box>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ flex: 1 }}
          >
            <Box
              sx={{
                display: { xs: "none", md: "block" },
                position: "relative",
                width: "100%",
                height: 350,
              }}
            >
              <Image
                src="/images/about/May-cua-xich-chay-pin-STIHL-MSA-120.jpg"
                alt="Trung tâm hỗ trợ Dola"
                fill
                style={{ objectFit: "contain" }}
                priority
              />
            </Box>
          </motion.div>
        </Stack>
      </Container>
    </Box>
  );
}
