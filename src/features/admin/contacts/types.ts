export interface Contact {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  messageContent: string;
  createdAt: string;
  createdBy: string;
}

export interface ApiMeta {
  page: number;
  pageSize: number;
  pages: number;
  total: number;
}

/** payload thực sự BE trả trong field data */
export interface ContactsList {
  result: Contact[];
  meta?: ApiMeta;
}
