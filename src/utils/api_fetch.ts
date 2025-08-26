import queryString from "query-string";
export const sendRequest = async <T>(props: IRequest) => {
  const {
    url: path,
    method,
    body,
    queryParams = {},
    useCredentials = false,
    headers = {},
    nextOption = {},
  } = props;

  let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}${path}`;

  if (queryParams) {
    const query = queryString.stringify(queryParams);
    url += `?${query}`;
  }

  const options: RequestInit = {
    method,
    headers: new Headers({ "Content-Type": "application/json", ...headers }),
    body: body ? JSON.stringify(body) : null,
    ...nextOption,
  };

  if (useCredentials) options.credentials = "include";

  try {
    const response = await fetch(url, options);
    const json = await response.json();

    // Chuẩn hóa output với field 'status' (không phải 'statusCode')
    return {
      status: json.status || response.status,
      message: json.message || "",
      data: json.data ?? null,
    } as T;
  } catch (error: any) {
    console.error("Fetch error:", error);
    return {
      status: 500,
      message: "Lỗi kết nối đến máy chủ",
      data: null,
    } as T;
  }
};

// export const fetchDefaultImages = (type: string) => {
//   if (type === "GITHUB") return "/user/default-github.png";
//   if (type === "GOOGLE") return "/user/default-google.png";
//   return "/user/default-user.png";
// };

// export const convertSlugUrl = (str: string) => {
//   if (!str) return "";
//   return slugify(str, {
//     lower: true,
//     locale: "vi",
//   });
// };
