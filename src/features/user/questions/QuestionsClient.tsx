"use client";

import { useState } from "react";
import {
  Container,
  Box,
  Typography,
  Chip,
  Stack,
  Breadcrumbs,
  Link,
  Divider,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import HomeIcon from "@mui/icons-material/Home";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import FaqHeroSection from "./components/FaqHeroSection";
import FaqSection from "./components/FaqSection";
import ContactForm from "./components/ContactForm";
import ContactInfo from "./components/ContactInfo";
import PopularQuestions from "./components/PopularQuestions";
import QuestionCTA from "./components/QuestionCTA";
import { faqData } from "./constants/faqData";

export default function QuestionsClient() {
  const [searchTerm, setSearchTerm] = useState("");
  const totalFaqs = faqData.reduce((s, c) => s + c.questions.length, 0);

  return (
    <>
      <FaqHeroSection searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Breadcrumb */}
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          sx={{ mb: 3, "& .MuiBreadcrumbs-separator": { color: "#ccc" } }}
        >
          <Link
            href="/"
            underline="hover"
            sx={{
              display: "flex", alignItems: "center", gap: 0.5,
              color: "text.secondary", fontSize: "0.875rem",
            }}
          >
            <HomeIcon sx={{ fontSize: 16 }} />
            Trang chủ
          </Link>
          <Typography
            color="#f25c05" fontWeight={600} fontSize="0.875rem"
            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
          >
            <HelpOutlineIcon sx={{ fontSize: 16 }} />
            Câu hỏi thường gặp
          </Typography>
        </Breadcrumbs>

        {/* Stats chips */}
        <Stack direction="row" spacing={2} sx={{ mb: 4, flexWrap: "wrap", gap: 1.5 }}>
          <Chip
            label={`📚 ${totalFaqs} câu hỏi thường gặp`}
            sx={{ bgcolor: "#f25c05", color: "#fff", fontWeight: 600, px: 1 }}
          />
          <Chip
            label="⏱️ Phản hồi trong 24h"
            sx={{ bgcolor: "#ffb700", color: "#000", fontWeight: 600, px: 1 }}
          />
          <Chip
            label="📞 0392 923 392"
            component="a"
            href="tel:0392923392"
            clickable
            sx={{ bgcolor: "#4caf50", color: "#fff", fontWeight: 600, px: 1 }}
          />
        </Stack>

        {/* ── FAQ — full width ─────────────────────────────────────────── */}
        <FaqSection searchTerm={searchTerm} onSearchChange={setSearchTerm} />

        {/* ── Support section divider ──────────────────────────────────── */}
        <Box sx={{ my: { xs: 5, md: 7 } }}>
          <Divider>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ px: 2 }}>
              <SupportAgentIcon sx={{ color: "#f25c05", fontSize: 22 }} />
              <Typography fontWeight={700} color="#555" fontSize="1rem">
                Không tìm thấy câu trả lời? Liên hệ ngay với chúng tôi
              </Typography>
            </Stack>
          </Divider>
        </Box>

        {/* ── Support section — balanced 2-col grid ───────────────────── */}
        <Grid container spacing={4} alignItems="flex-start">
          {/* Left: Contact Form — primary action */}
          <Grid size={{ xs: 12, md: 7 }}>
            <ContactForm />
          </Grid>

          {/* Right: Info + Popular Questions stacked */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Stack spacing={3}>
              <ContactInfo />
              <PopularQuestions onQuestionClick={setSearchTerm} />
            </Stack>
          </Grid>
        </Grid>
      </Container>

      {/* Bottom CTA */}
      <QuestionCTA />
    </>
  );
}
