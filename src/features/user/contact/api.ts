import { api } from "@/lib/api/http";
import type { ContactPayload, ContactResult } from "./types";

/** Gửi form liên hệ */
export async function sendContact(
  payload: ContactPayload
): Promise<ContactResult> {
  return api.post<ContactResult, ContactPayload>("/api/v1/contacts", payload);
}
