import { api, http } from "@/lib/api/http";
import type { Contact, ContactsList, ContactStatus } from "./types";

export async function getAllContacts(): Promise<ContactsList> {
  return api.get<ContactsList>("/api/v1/contacts", {
    params: { page: 1, size: 1000 },
  });
}

export async function updateContactStatus(id: number, status: ContactStatus): Promise<Contact> {
  return api.patch<Contact>(`/api/v1/contacts/${id}/status`, { status });
}

export async function deleteContact(id: number): Promise<void> {
  // ResponseEntity<Void> — không có data để unwrap, dùng http trực tiếp
  await http.delete(`/api/v1/contacts/${id}`);
}
