const KEY = "rv_items";
const MAX = 8;

export type RVItem = {
  id: number;
  name: string;
  slug: string;
  imageAvt: string;
  price: number;
  originalPrice: number;
  discountPercent?: number;
  inStock: boolean;
  rating?: number;
};

export function trackRVItem(item: RVItem): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(KEY);
    const current: RVItem[] = raw ? JSON.parse(raw) : [];
    const filtered = current.filter((x) => x.id !== item.id);
    localStorage.setItem(KEY, JSON.stringify([item, ...filtered].slice(0, MAX)));
  } catch {}
}

export function getRVItems(): RVItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
