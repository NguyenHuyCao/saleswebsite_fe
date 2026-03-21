import PaymentPendingView from "@/features/user/payment/pending/PaymentPendingView";

export const metadata = {
  title: "Chờ thanh toán",
  robots: { index: false },
};

export default function PaymentPendingPage() {
  return <PaymentPendingView />;
}
