"use client";
import {
  ReadonlyURLSearchParams,
  usePathname,
  useSearchParams,
} from "next/navigation";

/** Trả về true nếu `path` khớp pathname hiện tại và chứa cùng tham số query chính (nếu có). */
export const useIsActivePath = (path?: string, key?: string) => {
  const pathname = usePathname();
  const search = useSearchParams();
  if (!path) return false;
  if (pathname !== path) return false;
  if (!key) return true;
  const current = search.get(key);
  return typeof current === "string" && current.length > 0;
};
