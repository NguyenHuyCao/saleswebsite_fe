// questions/types.ts
export type FaqQA = { q: string; a: string };
export type FaqCategory = { category: string; questions: FaqQA[] };

export type ContactPayload = {
  fullName: string;
  email: string;
  phone: string;
  messageContent: string;
  subject?: string;
};
