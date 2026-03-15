// wishlist/hooks/useWishlistBulk.ts
"use client";

import { useState, useCallback, useMemo } from "react";
import { useWishlist } from "../queries";
import { api } from "@/lib/api/http";
import { useSnackbar } from "@/lib/hooks/useSnackbar";

export const useWishlistBulk = () => {
  const { data: items = [], mutate } = useWishlist();
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const { showSuccess, showError } = useSnackbar();

  const toggleSelectItem = useCallback((id: number) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    if (selectedItems.size === items.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(items.map((item) => item.id)));
    }
  }, [items, selectedItems.size]);

  const isAllSelected = useMemo(() => {
    return items.length > 0 && selectedItems.size === items.length;
  }, [items.length, selectedItems.size]);

  const isIndeterminate = useMemo(() => {
    return selectedItems.size > 0 && selectedItems.size < items.length;
  }, [selectedItems.size, items.length]);

  const clearSelected = useCallback(() => {
    setSelectedItems(new Set());
  }, []);

  const getSelectedProducts = useCallback(() => {
    return items.filter((item) => selectedItems.has(item.id));
  }, [items, selectedItems]);

  const totalValue = useMemo(() => {
    return getSelectedProducts().reduce(
      (sum, item) => sum + (item.price || 0),
      0,
    );
  }, [getSelectedProducts]);

  const addSelectedToCart = useCallback(async () => {
    if (selectedItems.size === 0) {
      showError("Vui lòng chọn ít nhất một sản phẩm");
      return;
    }

    try {
      const selectedProducts = getSelectedProducts();
      await Promise.all(
        selectedProducts.map((product) =>
          api.post("/api/v1/cart/add", { productId: product.id, quantity: 1 }),
        ),
      );
      showSuccess(`Đã thêm ${selectedItems.size} sản phẩm vào giỏ hàng`);
      clearSelected();
    } catch {
      showError("Không thể thêm sản phẩm vào giỏ hàng");
    }
  }, [
    selectedItems,
    getSelectedProducts,
    clearSelected,
    showSuccess,
    showError,
  ]);

  const removeSelected = useCallback(async () => {
    if (selectedItems.size === 0) {
      showError("Vui lòng chọn ít nhất một sản phẩm");
      return;
    }

    try {
      await Promise.all(
        Array.from(selectedItems).map((id) =>
          api.delete(`/api/v1/wishlist/${id}`),
        ),
      );
      showSuccess(
        `Đã xóa ${selectedItems.size} sản phẩm khỏi danh sách yêu thích`,
      );
      await mutate();
      clearSelected();
    } catch {
      showError("Không thể xóa sản phẩm khỏi wishlist");
    }
  }, [selectedItems, mutate, clearSelected, showSuccess, showError]);

  const selectedCount = selectedItems.size;

  return {
    selectedItems,
    toggleSelectItem,
    toggleSelectAll,
    isAllSelected,
    isIndeterminate,
    clearSelected,
    addSelectedToCart,
    removeSelected,
    getSelectedProducts,
    selectedCount,
    totalValue,
  };
};
