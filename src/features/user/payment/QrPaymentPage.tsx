"use client";

import QrPaymentView from "./QrPaymentView";

interface Props {
  orderId: number;
  paymentMethod: "MOMO" | "VNPAY";
}

export default function QrPaymentPage({ orderId, paymentMethod }: Props) {
  return <QrPaymentView orderId={orderId} paymentMethod={paymentMethod} />;
}
