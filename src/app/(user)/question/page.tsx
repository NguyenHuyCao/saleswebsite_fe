import FaqSupportPage from "@/components/question/FaqSupportPage";
import PageViewTracker from "@/components/common/traffic/PageViewTracker";
import { Container } from "@mui/material";
// import FreezeScrollOnReload from "@/components/common/FreezeScrollOnReload";

const QuestionsPage = () => {
  return (
    <Container>
      <PageViewTracker />
      <FaqSupportPage />
      {/* <FreezeScrollOnReload /> */}
    </Container>
  );
};

export default QuestionsPage;
