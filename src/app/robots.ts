import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cuonghoa.vn";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/api/",
          "/auth/",
          "/_next/",
          "/checkout/",
          "/profile/",
          "/order/",
        ],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
