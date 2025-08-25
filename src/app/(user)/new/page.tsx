import PageViewTracker from "@/components/common/traffic/PageViewTracker";
import NewsListView from "@/features/user/news/NewsListView";
import { Container } from "@mui/material";

export default function NewPage() {
  return (
    <Container sx={{ py: 4 }}>
      <PageViewTracker />
      <NewsListView />
    </Container>
  );
}
