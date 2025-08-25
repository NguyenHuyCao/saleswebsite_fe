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

export interface ContactsApiResponse {
  status: number;
  message?: string;
  data?: {
    result: Contact[];
    meta?: {
      page: number;
      pageSize: number;
      pages: number;
      total: number;
    };
  };
}
