import QrPaymentPage from "@/features/user/payment/QrPaymentPage";

export const metadata = {
  title: "Thanh toán",
  robots: { index: false },
};

interface Props {
  params: Promise<{ orderId: string }>;
  searchParams: Promise<{ method?: string }>;
}

export default async function PaymentQrRoutePage({ params, searchParams }: Props) {
  const { orderId: orderIdStr } = await params;
  const { method } = await searchParams;
  const orderId = parseInt(orderIdStr, 10);
  const paymentMethod = (method?.toUpperCase() ?? "BANK_TRANSFER") as
    | "MOMO"
    | "VNPAY"
    | "BANK_TRANSFER";

  return <QrPaymentPage orderId={orderId} paymentMethod={paymentMethod} />;
}
