// warranty/api.ts
export async function submitWarrantyRequest(payload: Record<string, any>) {
  const endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/warranty/requests`;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("SUBMIT_WARRANTY_FAILED");
  return res.json();
}
