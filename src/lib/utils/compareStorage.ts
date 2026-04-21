// Shared compare-list utility — localStorage + custom event for cross-component sync
export const COMPARE_KEY = "product_compare_list";
export const COMPARE_EVENT = "compareUpdate";
export const COMPARE_MAX = 4;

export function getCompareList(): Product[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(COMPARE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveCompareList(list: Product[]) {
  localStorage.setItem(COMPARE_KEY, JSON.stringify(list));
  window.dispatchEvent(new Event(COMPARE_EVENT));
}

export function addToCompare(product: Product): "added" | "already" | "full" {
  const list = getCompareList();
  if (list.some((p) => p.id === product.id)) return "already";
  if (list.length >= COMPARE_MAX) return "full";
  saveCompareList([...list, product]);
  return "added";
}

export function removeFromCompare(productId: number) {
  saveCompareList(getCompareList().filter((p) => p.id !== productId));
}

export function clearCompare() {
  saveCompareList([]);
}

export function isInCompare(productId: number): boolean {
  return getCompareList().some((p) => p.id === productId);
}
