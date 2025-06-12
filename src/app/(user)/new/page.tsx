import NewsPage from "@/components/new/NewsPage";
import PageViewTracker from "@/components/common/traffic/PageViewTracker";
import { Container } from "@mui/material";
import FreezeScrollOnReload from "@/components/common/FreezeScrollOnReload";

const NewPage = () => {
  return (
    <Container>
      <PageViewTracker />
      <NewsPage />
      <FreezeScrollOnReload />
    </Container>
  );
};

export default NewPage;
