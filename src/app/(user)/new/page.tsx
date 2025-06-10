import NewsPage from "@/components/new/NewsPage";
import PageViewTracker from "@/components/traffic/PageViewTracker";
import { Container } from "@mui/material";

const NewPage = () => {
  return (
    <Container>
      <PageViewTracker />
      <NewsPage />
    </Container>
  );
};

export default NewPage;
