import { api } from "@/lib/api/http";
import type { ContactsList } from "./types";

/** Lấy all để filter client-side */
export async function getAllContacts(): Promise<ContactsList> {
  return api.get<ContactsList>("/api/v1/contacts", {
    params: { page: 1, size: 1000 },
  });
}
