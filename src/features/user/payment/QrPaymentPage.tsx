"use client";

import QrPaymentView from "./QrPaymentView";
import BankTransferView from "./BankTransferView";

interface Props {
  orderId: number;
  paymentMethod: "MOMO" | "VNPAY" | "BANK_TRANSFER";
}

export default function QrPaymentPage({ orderId, paymentMethod }: Props) {
  if (paymentMethod === "BANK_TRANSFER") {
    return <BankTransferView orderId={orderId} />;
  }
  return <QrPaymentView orderId={orderId} paymentMethod={paymentMethod} />;
}
