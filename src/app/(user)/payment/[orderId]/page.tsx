import QrPaymentPage from "@/features/user/payment/QrPaymentPage";

export const metadata = {
  title: "Thanh toán QR",
  robots: { index: false },
};

interface Props {
  params: { orderId: string };
  searchParams: { method?: string };
}

export default function PaymentQrRoutePage({ params, searchParams }: Props) {
  const orderId = parseInt(params.orderId, 10);
  const method = (searchParams.method?.toUpperCase() ?? "MOMO") as "MOMO" | "VNPAY";

  return <QrPaymentPage orderId={orderId} paymentMethod={method} />;
}
