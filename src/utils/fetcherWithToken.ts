export const fetcherWithToken = async (url: string) => {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(`http://localhost:8080${url}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) return 0;

  const json = await res.json();
  return json.data;
};
