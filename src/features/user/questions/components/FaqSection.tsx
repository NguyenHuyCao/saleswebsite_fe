// questions/components/FaqSection.tsx
"use client";

import React, { useMemo } from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  InputAdornment,
  Tab,
  Tabs,
  Paper,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { faqData } from "../constants/faqData";

interface Props {
  searchTerm: string;
  onSearchChange: (val: string) => void;
}

export default function FaqSection({ searchTerm, onSearchChange }: Props) {
  const [expanded, setExpanded] = useState<string | false>(false);
  const [selectedCategory, setSelectedCategory] = useState(0);

  const handleChange = (panel: string) => (_: any, isExpanded: boolean) =>
    setExpanded(isExpanded ? panel : false);

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return faqData;
    const term = searchTerm.toLowerCase();
    return faqData
      .map((category) => ({
        ...category,
        questions: category.questions.filter(
          (q) =>
            q.q.toLowerCase().includes(term) ||
            q.a.toLowerCase().includes(term),
        ),
      }))
      .filter((category) => category.questions.length > 0);
  }, [searchTerm]);

  const categories = faqData.map((c) => c.category);

  return (
    <Box id="faq-section">
      {/* Search Bar */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 3 }}>
        <TextField
          fullWidth
          placeholder="Tìm kiếm câu hỏi..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              sx: { borderRadius: 2 },
            },
          }}
        />
      </Paper>

      {/* Category Tabs */}
      <Tabs
        value={selectedCategory}
        onChange={(_, value) => setSelectedCategory(value)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          mb: 3,
          "& .MuiTab-root": { textTransform: "none", fontWeight: 600 },
          "& .Mui-selected": { color: "#f25c05" },
          "& .MuiTabs-indicator": { bgcolor: "#f25c05" },
        }}
      >
        {categories.map((cat) => (
          <Tab key={cat} label={cat} />
        ))}
      </Tabs>

      {/* FAQ List */}
      <AnimatePresence mode="wait">
        {filteredData.length > 0 ? (
          filteredData.map((section, sectionIdx) => (
            <motion.div
              key={section.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {(!searchTerm || selectedCategory === sectionIdx) && (
                <Box mb={4}>
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    mb={2}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      borderBottom: "3px solid #ffb700",
                      pb: 0.5,
                      width: "fit-content",
                    }}
                  >
                    <span>{section.icon}</span>
                    {section.category}
                  </Typography>

                  {section.questions.map((item, i) => {
                    const panelId = `${sectionIdx}-${i}`;
                    return (
                      <motion.div
                        key={panelId}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <Accordion
                          expanded={expanded === panelId}
                          onChange={handleChange(panelId)}
                          sx={{
                            mb: 1,
                            borderRadius: 2,
                            boxShadow: 1,
                            "&.Mui-expanded": {
                              bgcolor: "#fff8f0",
                              border: "1px solid #f25c05",
                            },
                          }}
                        >
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography fontWeight={600}>
                              {`${i + 1}. ${item.q}`}
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Typography
                              whiteSpace="pre-line"
                              color="text.secondary"
                              sx={{ pl: 2, borderLeft: "3px solid #ffb700" }}
                            >
                              {item.a}
                            </Typography>
                          </AccordionDetails>
                        </Accordion>
                      </motion.div>
                    );
                  })}
                </Box>
              )}
            </motion.div>
          ))
        ) : (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography color="text.secondary">
              Không tìm thấy câu hỏi phù hợp.
            </Typography>
          </Box>
        )}
      </AnimatePresence>
    </Box>
  );
}
