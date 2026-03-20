// questions/QuestionsClient.tsx
"use client";

import { useState } from "react";
import { Container, Box, Typography, Chip, Stack } from "@mui/material";
import Grid from "@mui/material/Grid";
import FaqHeroSection from "./components/FaqHeroSection";
import FaqSection from "./components/FaqSection";
import ContactForm from "./components/ContactForm";
import ContactInfo from "./components/ContactInfo";
import PopularQuestions from "./components/PopularQuestions";

export default function QuestionsClient() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <>
      <FaqHeroSection searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      <Container sx={{ py: 4 }}>
        {/* Breadcrumb */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Trang chủ / Hỗ trợ / Câu hỏi thường gặp
          </Typography>
        </Box>

        {/* Stats Overview */}
        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          sx={{ mb: 4, flexWrap: "wrap", gap: 2 }}
        >
          <Chip
            label="📚 50+ câu hỏi thường gặp"
            sx={{ bgcolor: "#f25c05", color: "#fff", px: 2 }}
          />
          <Chip
            label="⏱️ Phản hồi trong 24h"
            sx={{ bgcolor: "#ffb700", color: "#000", px: 2 }}
          />
          <Chip
            label="📞 Hotline: 1900 6750"
            sx={{ bgcolor: "#4caf50", color: "#fff", px: 2 }}
          />
        </Stack>

        <Grid container spacing={4}>
          {/* Main FAQ Section */}
          <Grid size={{ xs: 12, md: 7 }}>
            <FaqSection searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          </Grid>

          {/* Sidebar */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Stack spacing={3}>
              <ContactInfo />
              <ContactForm />
              <PopularQuestions />
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
