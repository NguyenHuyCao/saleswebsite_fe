import FaqSupportPage from "@/components/question/FaqSupportPage";
import PageViewTracker from "@/components/common/traffic/PageViewTracker";
import { Container } from "@mui/material";

const QuestionsPage = () => {
  return (
    <Container>
      <PageViewTracker />
      <FaqSupportPage />
    </Container>
  );
};

export default QuestionsPage;
