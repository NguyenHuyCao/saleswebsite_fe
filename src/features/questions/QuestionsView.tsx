// questions/QuestionsView.tsx
import { Container } from "@mui/material";
import Grid from "@mui/material/Grid";
import PageViewTracker from "@/components/common/traffic/PageViewTracker";
import FaqSection from "./components/FaqSection";
import ContactForm from "./components/ContactForm";

export default async function QuestionsView() {
  return (
    <Container>
      <PageViewTracker />
      <Grid container spacing={4} sx={{ px: { xs: 2, md: 4 }, py: 6 }}>
        <Grid size={{ xs: 12, md: 7 }}>
          <FaqSection />
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <ContactForm />
        </Grid>
      </Grid>
    </Container>
  );
}
