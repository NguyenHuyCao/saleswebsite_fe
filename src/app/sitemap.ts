import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cuonghoa.vn";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/product`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/promotion`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/new`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/store`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/questions`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/cart`, lastModified: now, changeFrequency: "never", priority: 0.3 },
  ];

  return staticRoutes;
}
