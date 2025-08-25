const BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

const authHeader = () => ({
  Authorization: `Bearer ${
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : ""
  }`,
});

export async function fetchCategories(page = 1, size = 1000) {
  const res = await fetch(
    `${BASE}/api/v1/categories?page=${page}&size=${size}`,
    {
      headers: authHeader(),
      cache: "no-store",
    }
  );
  const json = await res.json();
  if (!res.ok) throw new Error(json?.message || "Không tải được danh mục");
  return json.data; // { result, meta }
}

export async function createCategory(fd: FormData) {
  const res = await fetch(`${BASE}/api/v1/categories`, {
    method: "POST",
    headers: authHeader(),
    body: fd,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.message || "Thêm danh mục thất bại");
  return json.data;
}

export async function updateCategory(id: number, fd: FormData) {
  const res = await fetch(`${BASE}/api/v1/categories/${id}`, {
    method: "PUT",
    headers: authHeader(),
    body: fd,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.message || "Cập nhật danh mục thất bại");
  return json.data;
}

export async function deleteCategory(id: number) {
  const res = await fetch(`${BASE}/api/v1/categories/${id}`, {
    method: "DELETE",
    headers: authHeader(),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.message || "Xóa danh mục thất bại");
  return json.data;
}
