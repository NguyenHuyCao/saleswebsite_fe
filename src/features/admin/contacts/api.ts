import type { ContactsApiResponse } from "./types";

const BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function fetchContactsAll(): Promise<ContactsApiResponse> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  const res = await fetch(`${BASE}/api/v1/contacts?page=1&size=1000`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  let json: ContactsApiResponse;
  try {
    json = await res.json();
  } catch {
    json = { status: res.status, message: "Invalid JSON" };
  }

  if (!res.ok)
    throw new Error(json?.message || "Lỗi khi tải danh sách liên hệ");
  return json;
}
