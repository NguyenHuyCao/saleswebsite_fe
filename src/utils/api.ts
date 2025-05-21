import queryString from "query-string";
// import slugify from "slugify";

export const sendRequest = async <T>(props: IRequest) => {
  let { url } = props; // chỉ mình nó sẽ bị thay đổi

  const {
    method,
    body,
    queryParams = {},
    useCredentials = false,
    headers = {},
    nextOption = {},
  } = props;

  const options: any = {
    method,
    headers: new Headers({ "content-type": "application/json", ...headers }),
    body: body ? JSON.stringify(body) : null,
    ...nextOption,
  };

  if (useCredentials) options.credentials = "include";
  if (queryParams) url = `${url}?${queryString.stringify(queryParams)}`;

  return fetch(url, options).then(async (res) => {
    const json = await res.json();
    if (res.ok) return json as T;

    return {
      statusCode: res.status,
      message: json?.message ?? "",
      error: json?.error ?? "",
    } as T;
  });
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
