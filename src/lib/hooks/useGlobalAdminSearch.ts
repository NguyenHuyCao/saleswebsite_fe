"use client";

import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api/http";

/* ─── Result types ─── */

export type ResultKind =
  | "product"
  | "order"
  | "user"
  | "contact"
  | "brand"
  | "category"
  | "promotion";

export interface SearchResult {
  id: string;              // unique key
  kind: ResultKind;
  primary: string;         // line 1
  secondary?: string;      // line 2
  badge?: string;          // status chip
  badgeColor?: "success" | "warning" | "error" | "default" | "info";
  navigatePath: string;    // trang điều hướng khi click
  searchKeyword?: string;  // từ khoá đặt vào redux search khi điều hướng
}

/* ─── helpers ─── */

const norm = (s: string) =>
  (s ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const matches = (haystack: string, needle: string) =>
  norm(haystack).includes(norm(needle));

const vnd = (n: number) => n.toLocaleString("vi-VN") + "₫";

function orderBadge(status: string): SearchResult["badgeColor"] {
  const m: Record<string, SearchResult["badgeColor"]> = {
    PENDING: "warning",
    PROCESSING: "info",
    SHIPPED: "info",
    DELIVERED: "success",
    CANCELLED: "error",
    REFUNDED: "error",
  };
  return m[status] ?? "default";
}

function promoColor(status: string): SearchResult["badgeColor"] {
  const m: Record<string, SearchResult["badgeColor"]> = {
    ACTIVE: "success",
    UPCOMING: "warning",
    EXPIRED: "default",
    CLOSED: "error",
  };
  return m[status] ?? "default";
}

/* ─── Main hook ─── */

/**
 * Global admin content search.
 * Debounce 350ms, fetch all endpoints in parallel, filter client-side.
 * Cached per session so subsequent searches don't re-fetch unchanged data.
 */
export function useGlobalAdminSearch(query: string) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  // In-memory cache for the current session
  const cache = useRef<{
    products?: any[];
    orders?: any[];
    users?: any[];
    contacts?: any[];
    brands?: any[];
    categories?: any[];
    promotions?: any[];
  }>({});

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const q = query.trim();

    // Xoá results và bỏ qua nếu query quá ngắn
    if (q.length < 2) {
      setResults([]);
      return;
    }

    // Debounce
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        // ── Fetch các endpoint chưa cache ──
        const fetches: Promise<void>[] = [];

        if (!cache.current.products) {
          fetches.push(
            api
              .get<any>(`/api/v1/products?page=1&size=500`)
              .then((r) => {
                cache.current.products = r?.result ?? [];
              })
              .catch(() => {
                cache.current.products = [];
              })
          );
        }
        if (!cache.current.orders) {
          fetches.push(
            api
              .get<any>(`/api/v1/orders?page=1&size=500`)
              .then((r) => {
                cache.current.orders = r?.result ?? [];
              })
              .catch(() => {
                cache.current.orders = [];
              })
          );
        }
        if (!cache.current.users) {
          fetches.push(
            api
              .get<any>(`/api/v1/users?page=1&size=500`)
              .then((r) => {
                cache.current.users = r?.result ?? [];
              })
              .catch(() => {
                cache.current.users = [];
              })
          );
        }
        if (!cache.current.contacts) {
          fetches.push(
            api
              .get<any>(`/api/v1/contacts?page=1&size=500`)
              .then((r) => {
                cache.current.contacts = r?.result ?? [];
              })
              .catch(() => {
                cache.current.contacts = [];
              })
          );
        }
        if (!cache.current.brands) {
          fetches.push(
            api
              .get<any>(`/api/v1/brands?page=1&size=200`)
              .then((r) => {
                cache.current.brands = r?.result ?? [];
              })
              .catch(() => {
                cache.current.brands = [];
              })
          );
        }
        if (!cache.current.categories) {
          fetches.push(
            api
              .get<any>(`/api/v1/categories?page=1&size=200`)
              .then((r) => {
                cache.current.categories = r?.result ?? [];
              })
              .catch(() => {
                cache.current.categories = [];
              })
          );
        }
        if (!cache.current.promotions) {
          fetches.push(
            api
              .get<any>(`/api/v1/promotions`)
              .then((r) => {
                cache.current.promotions = Array.isArray(r) ? r : [];
              })
              .catch(() => {
                cache.current.promotions = [];
              })
          );
        }

        if (fetches.length) await Promise.all(fetches);

        // ── Filter & build results ──
        const out: SearchResult[] = [];

        // Products
        (cache.current.products ?? [])
          .filter(
            (p: any) =>
              matches(p.name, q) ||
              matches(p.slug, q) ||
              matches(p.brandName, q) ||
              matches(p.categoryName, q)
          )
          .slice(0, 5)
          .forEach((p: any) => {
            out.push({
              id: `product-${p.id}`,
              kind: "product",
              primary: p.name,
              secondary: [
                p.brandName,
                p.categoryName,
                p.price ? vnd(p.price) : null,
              ]
                .filter(Boolean)
                .join(" · "),
              badge: p.active ? "Còn hàng" : "Ngừng bán",
              badgeColor: p.active ? "success" : "error",
              navigatePath: "/admin/products",
              searchKeyword: p.name,
            });
          });

        // Orders
        (cache.current.orders ?? [])
          .filter(
            (o: any) =>
              matches(o.orderCode ?? "", q) ||
              String(o.orderId).includes(q) ||
              matches(o.user?.email, q) ||
              matches(o.user?.phone, q) ||
              matches(o.status, q)
          )
          .slice(0, 5)
          .forEach((o: any) => {
            const code = o.orderCode ?? `#${o.orderId}`;
            out.push({
              id: `order-${o.orderId}`,
              kind: "order",
              primary: code,
              secondary: [
                o.user?.email,
                o.totalAmount ? vnd(o.totalAmount) : null,
              ]
                .filter(Boolean)
                .join(" · "),
              badge: o.status,
              badgeColor: orderBadge(o.status),
              navigatePath: "/admin/orders",
              searchKeyword: o.orderCode ?? String(o.orderId),
            });
          });

        // Users
        (cache.current.users ?? [])
          .filter(
            (u: any) =>
              matches(u.username, q) ||
              matches(u.email, q) ||
              matches(u.phone ?? "", q)
          )
          .slice(0, 5)
          .forEach((u: any) => {
            out.push({
              id: `user-${u.id}`,
              kind: "user",
              primary: u.username,
              secondary: [u.email, u.phone].filter(Boolean).join(" · "),
              badge: u.active ? "Hoạt động" : "Khoá",
              badgeColor: u.active ? "success" : "error",
              navigatePath: "/admin/users",
              searchKeyword: u.email,
            });
          });

        // Contacts
        (cache.current.contacts ?? [])
          .filter(
            (c: any) =>
              matches(c.fullName, q) ||
              matches(c.email, q) ||
              matches(c.subject, q) ||
              matches(c.phone ?? "", q)
          )
          .slice(0, 4)
          .forEach((c: any) => {
            const statusLabel: Record<string, string> = {
              NEW: "Mới",
              READ: "Đã đọc",
              REPLIED: "Đã trả lời",
              CLOSED: "Đóng",
            };
            const statusColor: Record<string, SearchResult["badgeColor"]> = {
              NEW: "warning",
              READ: "info",
              REPLIED: "success",
              CLOSED: "default",
            };
            out.push({
              id: `contact-${c.id}`,
              kind: "contact",
              primary: c.fullName,
              secondary: [c.email, c.subject].filter(Boolean).join(" · "),
              badge: statusLabel[c.status] ?? c.status,
              badgeColor: statusColor[c.status] ?? "default",
              navigatePath: "/admin/contacts",
              searchKeyword: c.email,
            });
          });

        // Brands
        (cache.current.brands ?? [])
          .filter((b: any) => matches(b.name, q))
          .slice(0, 3)
          .forEach((b: any) => {
            out.push({
              id: `brand-${b.id}`,
              kind: "brand",
              primary: b.name,
              secondary: b.originCountry ?? undefined,
              navigatePath: "/admin/brands",
              searchKeyword: b.name,
            });
          });

        // Categories
        (cache.current.categories ?? [])
          .filter((c: any) => matches(c.name, q))
          .slice(0, 3)
          .forEach((c: any) => {
            out.push({
              id: `category-${c.id}`,
              kind: "category",
              primary: c.name,
              navigatePath: "/admin/categories",
              searchKeyword: c.name,
            });
          });

        // Promotions
        (cache.current.promotions ?? [])
          .filter(
            (p: any) =>
              matches(p.name, q) ||
              matches(p.code ?? "", q) ||
              matches(p.description ?? "", q)
          )
          .slice(0, 4)
          .forEach((p: any) => {
            out.push({
              id: `promo-${p.id}`,
              kind: "promotion",
              primary: p.name,
              secondary: [
                p.code ? `Mã: ${p.code}` : "Không cần mã",
                `Giảm ${Math.round(p.discount * 100)}%`,
              ].join(" · "),
              badge: {
                ACTIVE: "Đang chạy",
                UPCOMING: "Sắp diễn ra",
                EXPIRED: "Hết hạn",
                CLOSED: "Đã tắt",
              }[p.status as string] ?? p.status,
              badgeColor: promoColor(p.status),
              navigatePath: "/admin/events",
              searchKeyword: p.name,
            });
          });

        setResults(out);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query]);

  /** Xoá cache để force re-fetch (gọi sau khi có write operation) */
  const invalidate = (kind?: ResultKind) => {
    if (!kind) {
      cache.current = {};
    } else {
      const keyMap: Record<ResultKind, keyof typeof cache.current> = {
        product: "products",
        order: "orders",
        user: "users",
        contact: "contacts",
        brand: "brands",
        category: "categories",
        promotion: "promotions",
      };
      delete cache.current[keyMap[kind]];
    }
  };

  return { results, loading, invalidate };
}
