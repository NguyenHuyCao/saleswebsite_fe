import { api } from "@/lib/api/http";

export type QrPaymentInitResponse = {
  orderId: number;
  orderCode: string;
  amount: number;
  paymentMethod: string;
  bankCode: string;
  accountNumber: string;
  accountName: string;
  transferContent: string;
  qrUrl: string;
  expiredAt: number; // unix ms
};

export type PaymentStatusResponse = {
  orderId: number;
  orderCode: string;
  orderStatus: string;
  paymentStatus: string;
  paid: boolean;
  paidAmount: number | null;
};

/** Khởi tạo thanh toán QR – trả về thông tin QR + mã chuyển khoản */
export async function initiateQrPayment(
  orderId: number,
  paymentMethod: "MOMO" | "VNPAY"
): Promise<QrPaymentInitResponse> {
  return api.post<QrPaymentInitResponse, void>(
    `/api/v1/payments/qr/initiate/${orderId}?paymentMethod=${paymentMethod}`
  );
}

/** Polling: kiểm tra trạng thái thanh toán của đơn */
export async function getPaymentStatus(orderId: number): Promise<PaymentStatusResponse> {
  return api.get<PaymentStatusResponse>(`/api/v1/payments/qr/status/${orderId}`);
}
