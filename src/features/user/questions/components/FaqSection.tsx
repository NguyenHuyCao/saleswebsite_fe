"use client";

import React, { useMemo, useState } from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  InputAdornment,
  Paper,
  Chip,
  Stack,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Collapse,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { motion, AnimatePresence } from "framer-motion";
import { faqData } from "../constants/faqData";

interface Props {
  searchTerm: string;
  onSearchChange: (val: string) => void;
}

interface FaqAccordionItemProps {
  panelId: string;
  index: number;
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

function FaqAccordionItem({ panelId, index, question, answer, isOpen, onToggle }: FaqAccordionItemProps) {
  return (
    <motion.div
      key={panelId}
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
    >
      <Accordion
        expanded={isOpen}
        onChange={(_e, exp) => { if (exp !== isOpen) onToggle(); }}
        sx={{
          mb: 1, borderRadius: "10px !important",
          border: "1px solid",
          borderColor: isOpen ? "#f25c05" : "#eeeeee",
          boxShadow: isOpen ? "0 4px 16px rgba(242,92,5,0.1)" : "0 1px 3px rgba(0,0,0,0.05)",
          bgcolor: isOpen ? "#fff8f0" : "#fff",
          "&:before": { display: "none" },
          transition: "all 0.2s",
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: isOpen ? "#f25c05" : "#999" }} />}
          sx={{ py: 0.5 }}
        >
          <Stack direction="row" alignItems="flex-start" spacing={1.5} sx={{ pr: 1 }}>
            <Box
              sx={{
                width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
                bgcolor: isOpen ? "#f25c05" : "#f5f5f5",
                display: "flex", alignItems: "center", justifyContent: "center",
                mt: 0.2, transition: "background 0.2s",
              }}
            >
              <Typography variant="caption" fontWeight={700} fontSize="0.7rem" sx={{ color: isOpen ? "#fff" : "#999" }}>
                {index + 1}
              </Typography>
            </Box>
            <Typography fontWeight={600} fontSize="0.95rem" lineHeight={1.5}>
              {question}
            </Typography>
          </Stack>
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0, pl: { xs: 2, sm: 6 } }}>
          <Typography
            whiteSpace="pre-line" color="text.secondary"
            lineHeight={1.9} fontSize="0.92rem"
            sx={{ borderLeft: "3px solid #ffb700", pl: 2 }}
          >
            {answer}
          </Typography>
        </AccordionDetails>
      </Accordion>
    </motion.div>
  );
}

const ALL = "__all__";

export default function FaqSection({ searchTerm, onSearchChange }: Props) {
  const [expanded, setExpanded] = useState<string | false>(false);
  const [activeCat, setActiveCat] = useState(ALL);
  // Which category groups are open in "Tất cả" mode
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set());

  const toggleGroup = (cat: string) => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
    setExpanded(false);
  };

  const isSearching = searchTerm.trim().length > 0;

  const displayData = useMemo(() => {
    const term = searchTerm.toLowerCase();

    if (isSearching) {
      return faqData
        .map((cat) => ({
          ...cat,
          questions: cat.questions.filter(
            (q) =>
              q.q.toLowerCase().includes(term) ||
              q.a.toLowerCase().includes(term)
          ),
        }))
        .filter((cat) => cat.questions.length > 0);
    }

    if (activeCat === ALL) return faqData;
    return faqData.filter((cat) => cat.category === activeCat);
  }, [searchTerm, activeCat, isSearching]);

  const totalMatches = isSearching
    ? displayData.reduce((s, c) => s + c.questions.length, 0)
    : 0;

  const handleCatClick = (cat: string) => {
    setActiveCat(cat);
    setExpanded(false);
  };

  return (
    <Box id="faq-section" sx={{ scrollMarginTop: "80px" }}>
      {/* ── Search bar ─────────────────────────────────────────────────── */}
      <Box sx={{ position: "relative", mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Tìm kiếm trong 52 câu hỏi thường gặp..."
          value={searchTerm}
          onChange={(e) => {
            onSearchChange(e.target.value);
            setExpanded(false);
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#f25c05" }} />
                </InputAdornment>
              ),
              endAdornment: isSearching ? (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => onSearchChange("")}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ) : null,
              sx: { borderRadius: 3, bgcolor: "#fff" },
            },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#e0e0e0" },
              "&:hover fieldset": { borderColor: "#f25c05" },
              "&.Mui-focused fieldset": { borderColor: "#f25c05" },
            },
          }}
        />
        {isSearching && (
          <Stack direction="row" spacing={1} sx={{ mt: 1.5 }} flexWrap="wrap" alignItems="center">
            <Typography variant="caption" color="text.secondary">
              Tìm thấy <strong>{totalMatches}</strong> kết quả cho &quot;{searchTerm}&quot;
            </Typography>
            {displayData.map((cat) => (
              <Chip
                key={cat.category}
                label={`${cat.icon} ${cat.category} (${cat.questions.length})`}
                size="small"
                sx={{ fontSize: "0.72rem", bgcolor: "#fff8f0", color: "#f25c05", border: "1px solid #ffd4b8" }}
              />
            ))}
          </Stack>
        )}
      </Box>

      {/* ── Main 2-col layout ──────────────────────────────────────────── */}
      <Grid container spacing={3} alignItems="flex-start">

        {/* Left: Category navigation — hidden during search on mobile */}
        <Grid
          size={{ xs: 12, md: 3 }}
          sx={{ display: isSearching ? { xs: "none", md: "block" } : "block" }}
        >
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              border: "1px solid #f0f0f0",
              overflow: "hidden",
              position: { md: "sticky" },
              top: { md: 88 },
            }}
          >
            {/* "All" item */}
            <List disablePadding>
              <ListItemButton
                selected={activeCat === ALL && !isSearching}
                onClick={() => handleCatClick(ALL)}
                sx={{
                  px: 2.5, py: 1.5,
                  borderBottom: "1px solid #f5f5f5",
                  "&.Mui-selected": {
                    bgcolor: "#fff8f0",
                    borderLeft: "3px solid #f25c05",
                    pl: "17px",
                  },
                  "&.Mui-selected:hover": { bgcolor: "#fff0e6" },
                  "&:hover": { bgcolor: "#fafafa" },
                }}
              >
                <ListItemText
                  primary="Tất cả câu hỏi"
                  slotProps={{
                    primary: {
                      fontWeight: activeCat === ALL ? 700 : 500,
                      fontSize: "0.9rem",
                      color: activeCat === ALL ? "#f25c05" : "inherit",
                    },
                  }}
                />
                <Chip
                  label={faqData.reduce((s, c) => s + c.questions.length, 0)}
                  size="small"
                  sx={{ height: 20, fontSize: "0.7rem", bgcolor: activeCat === ALL ? "#f25c05" : "#f0f0f0", color: activeCat === ALL ? "#fff" : "#666" }}
                />
              </ListItemButton>

              {faqData.map((cat) => {
                const isActive = activeCat === cat.category && !isSearching;
                return (
                  <ListItemButton
                    key={cat.category}
                    selected={isActive}
                    onClick={() => handleCatClick(cat.category)}
                    sx={{
                      px: 2.5, py: 1.25,
                      borderBottom: "1px solid #f5f5f5",
                      "&:last-child": { borderBottom: "none" },
                      "&.Mui-selected": {
                        bgcolor: "#fff8f0",
                        borderLeft: "3px solid #f25c05",
                        pl: "17px",
                      },
                      "&.Mui-selected:hover": { bgcolor: "#fff0e6" },
                      "&:hover": { bgcolor: "#fafafa" },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 28, fontSize: "1rem" }}>
                      <span style={{ fontSize: "1.1rem" }}>{cat.icon}</span>
                    </ListItemIcon>
                    <ListItemText
                      primary={cat.category}
                      slotProps={{
                        primary: {
                          fontWeight: isActive ? 700 : 500,
                          fontSize: "0.88rem",
                          color: isActive ? "#f25c05" : "inherit",
                        },
                      }}
                    />
                    <Chip
                      label={cat.questions.length}
                      size="small"
                      sx={{
                        height: 20, fontSize: "0.7rem",
                        bgcolor: isActive ? "#f25c05" : "#f0f0f0",
                        color: isActive ? "#fff" : "#666",
                      }}
                    />
                  </ListItemButton>
                );
              })}
            </List>
          </Paper>
        </Grid>

        {/* Right: FAQ Accordions */}
        <Grid size={{ xs: 12, md: 9 }}>
          <AnimatePresence mode="wait">
            {displayData.length > 0 ? (
              <motion.div
                key={isSearching ? `search-${searchTerm}` : activeCat}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                {/* ── "Tất cả" mode: collapsible category groups ─────── */}
                {!isSearching && activeCat === ALL ? (
                  <>
                    {faqData.map((section, sIdx) => {
                      const isGroupOpen = openGroups.has(section.category);
                      return (
                        <motion.div
                          key={section.category}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: sIdx * 0.04 }}
                        >
                          <Box sx={{ mb: 1.5 }}>
                            {/* Category group header */}
                            <Box
                              onClick={() => toggleGroup(section.category)}
                              sx={{
                                display: "flex", alignItems: "center", gap: 1.5,
                                p: 2, borderRadius: 2, cursor: "pointer",
                                border: "1px solid",
                                borderColor: isGroupOpen ? "#f25c05" : "#e8e8e8",
                                bgcolor: isGroupOpen ? "#fff8f0" : "#fafafa",
                                transition: "all 0.2s",
                                "&:hover": { borderColor: "#ffb700", bgcolor: "#fff8f0" },
                                userSelect: "none",
                              }}
                            >
                              <span style={{ fontSize: "1.3rem", lineHeight: 1 }}>{section.icon}</span>
                              <Typography fontWeight={700} fontSize="0.98rem" sx={{ flex: 1, color: isGroupOpen ? "#f25c05" : "#222" }}>
                                {section.category}
                              </Typography>
                              <Chip
                                label={`${section.questions.length} câu`}
                                size="small"
                                sx={{
                                  height: 22, fontSize: "0.7rem", fontWeight: 700,
                                  bgcolor: isGroupOpen ? "#f25c05" : "#eeeeee",
                                  color: isGroupOpen ? "#fff" : "#666",
                                  transition: "all 0.2s",
                                }}
                              />
                              <ExpandMoreIcon
                                sx={{
                                  color: isGroupOpen ? "#f25c05" : "#bbb",
                                  transform: isGroupOpen ? "rotate(180deg)" : "rotate(0deg)",
                                  transition: "transform 0.25s",
                                  fontSize: 20,
                                }}
                              />
                            </Box>

                            {/* Collapsible questions */}
                            <Collapse in={isGroupOpen} timeout={250}>
                              <Box sx={{ pt: 1, pl: { xs: 0, sm: 1 } }}>
                                {section.questions.map((item, i) => {
                                  const panelId = `${section.category}-${i}`;
                                  const isOpen = expanded === panelId;
                                  return (
                                    <FaqAccordionItem
                                      key={panelId}
                                      panelId={panelId}
                                      index={i}
                                      question={item.q}
                                      answer={item.a}
                                      isOpen={isOpen}
                                      onToggle={() => setExpanded(isOpen ? false : panelId)}
                                    />
                                  );
                                })}
                              </Box>
                            </Collapse>
                          </Box>
                        </motion.div>
                      );
                    })}
                  </>
                ) : (
                  /* ── Single category or search mode ──────────────── */
                  displayData.map((section) => (
                    <Box key={section.category} mb={isSearching ? 4 : 0}>
                      {/* Header — show when searching */}
                      {isSearching && (
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                          <span style={{ fontSize: "1.2rem" }}>{section.icon}</span>
                          <Typography variant="h6" fontWeight={800} sx={{ color: "#333", pb: 0.5, borderBottom: "2px solid #ffb700" }}>
                            {section.category}
                          </Typography>
                          <Chip
                            label={`${section.questions.length} câu`}
                            size="small"
                            sx={{ bgcolor: "#ffb700", color: "#000", fontWeight: 700, fontSize: "0.7rem" }}
                          />
                        </Stack>
                      )}

                      {section.questions.map((item, i) => {
                        const panelId = `${section.category}-${i}`;
                        const isOpen = expanded === panelId;
                        return (
                          <FaqAccordionItem
                            key={panelId}
                            panelId={panelId}
                            index={i}
                            question={item.q}
                            answer={item.a}
                            isOpen={isOpen}
                            onToggle={() => setExpanded(isOpen ? false : panelId)}
                          />
                        );
                      })}
                    </Box>
                  ))
                )}
              </motion.div>
            ) : (
              <Box sx={{ textAlign: "center", py: 8 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Không tìm thấy câu hỏi phù hợp
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Thử từ khóa khác hoặc{" "}
                  <Box
                    component="span"
                    sx={{ color: "#f25c05", cursor: "pointer", fontWeight: 600 }}
                    onClick={() => onSearchChange("")}
                  >
                    xem tất cả câu hỏi
                  </Box>
                </Typography>
              </Box>
            )}
          </AnimatePresence>
        </Grid>
      </Grid>
    </Box>
  );
}
