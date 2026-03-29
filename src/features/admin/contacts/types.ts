export type ContactStatus = "NEW" | "READ" | "REPLIED" | "CLOSED";

export interface Contact {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  messageContent: string;
  status: ContactStatus;
  createdAt: string;
}

export interface ApiMeta {
  page: number;
  pageSize: number;
  pages: number;
  total: number;
}

export interface ContactsList {
  result: Contact[];
  meta?: ApiMeta;
}
