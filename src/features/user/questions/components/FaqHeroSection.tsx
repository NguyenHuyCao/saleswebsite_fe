"use client";

import {
  Box,
  Typography,
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
  Button,
} from "@mui/material";
import { motion } from "framer-motion";
import Image from "next/image";
import SearchIcon from "@mui/icons-material/Search";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import PhoneIcon from "@mui/icons-material/Phone";
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
      component="section"
      sx={{
        background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 60%, #3a1a00 100%)",
        py: { xs: 6, md: 8 },
        px: 2,
        position: "relative",
      }}
    >
      {/* Decorative glows — clipped to the section only */}
      <Box sx={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        <Box
          sx={{
            position: "absolute",
            top: -60,
            right: -60,
            width: 320,
            height: 320,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(242,92,5,0.25) 0%, transparent 70%)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -40,
            left: "10%",
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,183,0,0.12) 0%, transparent 70%)",
          }}
        />
      </Box>

      <Container maxWidth="lg" sx={{ position: "relative" }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          alignItems="center"
          spacing={{ xs: 5, md: 6 }}
        >
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            style={{ flex: 1 }}
          >
            <Box sx={{ maxWidth: 580 }}>
              <Chip
                icon={<HelpOutlineIcon sx={{ fontSize: "1rem !important", color: "#ffb700 !important" }} />}
                label="TRUNG TÂM HỖ TRỢ"
                sx={{
                  bgcolor: "rgba(242,92,5,0.2)",
                  color: "#ffb700",
                  fontWeight: 700,
                  mb: 3,
                  border: "1px solid rgba(242,92,5,0.4)",
                }}
              />

              <Typography
                component="h1"
                fontWeight={900}
                sx={{
                  fontSize: { xs: "2rem", sm: "2.6rem", md: "3.2rem" },
                  color: "#fff",
                  lineHeight: 1.2,
                  mb: 2,
                }}
              >
                Bạn cần hỗ trợ?
                <Box component="span" sx={{ color: "#f25c05", display: "block" }}>
                  Chúng tôi sẵn sàng!
                </Box>
              </Typography>

              <Typography
                variant="body1"
                sx={{ color: "rgba(255,255,255,0.75)", mb: 4, lineHeight: 1.7 }}
              >
                Tìm câu trả lời nhanh trong{" "}
                <Box component="span" sx={{ color: "#ffb700", fontWeight: 600 }}>
                  {faqData.reduce((s, c) => s + c.questions.length, 0)} câu hỏi thường gặp
                </Box>{" "}
                hoặc gửi thắc mắc trực tiếp cho đội ngũ hỗ trợ.
              </Typography>

              {/* Search Bar */}
              <ClickAwayListener onClickAway={() => setOpen(false)}>
                <Box sx={{ position: "relative", maxWidth: 520, mb: 4 }}>
                  <Paper
                    elevation={4}
                    sx={{
                      p: 0.5,
                      pl: 2,
                      display: "flex",
                      alignItems: "center",
                      borderRadius: 4,
                    }}
                  >
                    <SearchIcon sx={{ color: "#999", mr: 1, flexShrink: 0 }} />
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
                        px: { xs: 2, sm: 4 },
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
                      elevation={6}
                      sx={{
                        position: "absolute",
                        top: "calc(100% + 8px)",
                        left: 0,
                        right: 0,
                        zIndex: 1300,
                        borderRadius: 3,
                        overflow: "hidden",
                        maxHeight: 320,
                        overflowY: "auto",
                      }}
                    >
                      {faqSuggestions.length > 0 && (
                        <>
                          <Box sx={{ px: 2, py: 1, bgcolor: "#f9f9f9" }}>
                            <Typography variant="caption" fontWeight={700} color="text.secondary"
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
                                sx={{ px: 2, "&:hover": { bgcolor: "#fff8f0" } }}
                              >
                                <ListItemIcon sx={{ minWidth: 32 }}>
                                  <QuestionAnswerIcon sx={{ fontSize: 18, color: "#ffb700" }} />
                                </ListItemIcon>
                                <ListItemText
                                  primary={q}
                                  slotProps={{ primary: { fontSize: "0.9rem" } }}
                                />
                              </ListItemButton>
                            ))}
                          </List>
                          <Divider />
                        </>
                      )}

                      <ListItemButton
                        onClick={handleProductSearch}
                        sx={{ px: 2, py: 1.5, "&:hover": { bgcolor: "#fff3e0" } }}
                      >
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <ShoppingBagIcon sx={{ fontSize: 18, color: "#f25c05" }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography fontSize="0.9rem">
                              Tìm sản phẩm:{" "}
                              <Box component="span" fontWeight={700} color="#f25c05">
                                &quot;{searchTerm}&quot;
                              </Box>
                            </Typography>
                          }
                        />
                      </ListItemButton>

                      {faqSuggestions.length === 0 && (
                        <Box sx={{ px: 2, py: 1.5 }}>
                          <Typography variant="body2" color="text.secondary" fontSize="0.88rem">
                            Không tìm thấy câu hỏi phù hợp.
                          </Typography>
                        </Box>
                      )}
                    </Paper>
                  )}
                </Box>
              </ClickAwayListener>

              {/* Quick stats */}
              <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ gap: 1.5 }}>
                {[
                  { value: String(faqData.reduce((s, c) => s + c.questions.length, 0)) + "+", label: "Câu hỏi" },
                  { value: "24/7", label: "Hỗ trợ" },
                  { value: "< 15'", label: "Phản hồi" },
                ].map(({ value, label }) => (
                  <Paper
                    key={label}
                    elevation={0}
                    sx={{ p: 1.5, minWidth: 80, bgcolor: "rgba(255,255,255,0.1)", borderRadius: 3, textAlign: "center", border: "1px solid rgba(255,255,255,0.15)" }}
                  >
                    <Typography variant="h5" fontWeight={800} color="#f25c05">
                      {value}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.75)" }}>
                      {label}
                    </Typography>
                  </Paper>
                ))}
              </Stack>

              {/* Hotline CTA */}
              <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<PhoneIcon />}
                  href="tel:0392923392"
                  sx={{ borderColor: "rgba(255,255,255,0.4)", color: "#fff", "&:hover": { borderColor: "#f25c05", color: "#f25c05" } }}
                >
                  0392 923 392
                </Button>
              </Stack>
            </Box>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ flex: 1 }}
          >
            <Box
              sx={{
                display: { xs: "none", md: "block" },
                position: "relative",
                width: "100%",
                height: 340,
              }}
            >
              <Image
                src="/images/about/May-cua-xich-chay-pin-STIHL-MSA-120.jpg"
                alt="Hỗ trợ khách hàng Cường Hoa - Máy 2 thì chính hãng"
                fill
                style={{ objectFit: "contain", filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.5))" }}
                priority
              />
            </Box>
          </motion.div>
        </Stack>
      </Container>
    </Box>
  );
}
