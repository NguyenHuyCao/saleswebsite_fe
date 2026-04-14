import { api } from "@/lib/api/http";

export type PaymentTransaction = {
  id: number;
  orderId: number | null;
  orderCode: string | null;
  paymentMethod: string;
  webhookSource: string;
  transferContent: string | null;
  amountExpected: number | null;
  amountReceived: number;
  difference: number | null;
  status: TransactionStatus;
  bankReference: string | null;
  senderName: string | null;
  senderAccount: string | null;
  receivedAt: string | null;
  confirmedAt: string | null;
  confirmedBy: string | null;
  note: string | null;
};

export type TransactionStatus =
  | "PENDING"
  | "RECEIVED"
  | "OVERPAID"
  | "UNDERPAID"
  | "CONFIRMED"
  | "FAILED"
  | "REFUND_PENDING"
  | "LATE_PAYMENT"
  | "UNMATCHED";

export type PageResult<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
};

export async function getTransactions(params: {
  status?: string;
  method?: string;
  page?: number;
  size?: number;
}): Promise<PageResult<PaymentTransaction>> {
  const p: Record<string, string> = {};
  if (params.status) p.status = params.status;
  if (params.method) p.method = params.method;
  p.page = String(params.page ?? 0);
  p.size = String(params.size ?? 20);
  p.sort = "receivedAt,desc";
  return api.get<PageResult<PaymentTransaction>>("/api/v1/admin/payments/transactions", { params: p });
}

export async function getUnmatched(): Promise<PaymentTransaction[]> {
  return api.get<PaymentTransaction[]>("/api/v1/admin/payments/unmatched");
}

export async function confirmTransaction(id: number, note?: string): Promise<void> {
  return api.put<void, { note?: string }>(`/api/v1/admin/payments/transactions/${id}/confirm`, { note });
}

export async function rejectTransaction(id: number, reason: string): Promise<void> {
  return api.put<void, { reason: string }>(`/api/v1/admin/payments/transactions/${id}/reject`, { reason });
}

export async function assignTransaction(id: number, orderId: number, note?: string): Promise<void> {
  return api.put<void, { orderId: number; note?: string }>(
    `/api/v1/admin/payments/transactions/${id}/assign`,
    { orderId, note }
  );
}
