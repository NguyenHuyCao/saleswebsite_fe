export const fetcherWithToken = async (url: string) => {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${url}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) return 0;

  const json = await res.json();
  return json.data;
};
