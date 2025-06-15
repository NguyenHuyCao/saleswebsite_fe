export async function getBrands(): Promise<Brand[]> {
  const res = await fetch(`${process.env.BACKEND_URL}/api/v1/brands`, {
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  const raw = await res.json();
  return raw.data?.result || [];
}
