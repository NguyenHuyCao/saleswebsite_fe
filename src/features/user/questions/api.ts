// questions/api.ts
import type { ContactPayload } from "./types";
import { CONTACT_ENDPOINT } from "./queries";

/**
 * Client-side helper gửi form liên hệ.
 * Trả về true khi tạo thành công (201).
 */
export async function createContact(payload: ContactPayload): Promise<boolean> {
  const res = await fetch(CONTACT_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...payload,
      subject: payload.subject ?? "Giải đáp thắc mắc",
    }),
  });

  // API đang trả về { status: 201, ... }
  try {
    const data = await res.json();
    return data?.status === 201;
  } catch {
    return res.ok;
  }
}
