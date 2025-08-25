import PageViewTracker from "@/components/common/traffic/PageViewTracker";
import MomoPaymentView from "@/features/user/payment/momo/MomoPaymentView";

export default function MomoPaymentPage() {
  return (
    <>
      <PageViewTracker />
      <MomoPaymentView />
    </>
  );
}
