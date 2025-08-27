export type ContactTopic =
  | "Báo giá"
  | "Bảo hành"
  | "Kỹ thuật"
  | "Hợp tác đại lý"
  | string;

export interface ContactPayload {
  fullName: string;
  email: string;
  phone: string;
  subject: ContactTopic;
  messageContent: string;
}

/** tuỳ BE trả về gì; để mở rộng an toàn */
export interface ContactResult {
  id?: number | string;
  status?: number;
  message?: string;
}
