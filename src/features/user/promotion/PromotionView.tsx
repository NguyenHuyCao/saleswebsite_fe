// promotion/PromotionView.tsx
import PageViewTracker from "@/components/common/traffic/PageViewTracker";
import PromotionViewClient from "./PromotionViewClient";

export default function PromotionView() {
  return (
    <>
      <PageViewTracker />
      <PromotionViewClient />
    </>
  );
}
