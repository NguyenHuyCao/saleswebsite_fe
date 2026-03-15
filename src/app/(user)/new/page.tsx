import PageViewTracker from "@/components/common/traffic/PageViewTracker";
import { NewsListView } from "@/features/user/news";
import { Container } from "@mui/material";

export default function NewPage() {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <PageViewTracker />
      <NewsListView />
    </Container>
  );
}
