// questions/QuestionsView.tsx
import PageViewTracker from "@/components/common/traffic/PageViewTracker";
import QuestionsClient from "./QuestionsClient";

export default async function QuestionsView() {
  return (
    <>
      <PageViewTracker />
      <QuestionsClient />
    </>
  );
}
