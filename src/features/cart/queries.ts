import { queryOptions, useQueryClient } from "@tanstack/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getCart,
  updateCartItemQuantity,
  deleteCartItem,
  clearUserCart,
  validateVoucher,
  getUserAddressById,
  placeOrder,
} from "./api";
import type { PlaceOrderPayload, VoucherValidateResponse } from "./types";

export const cartKeys = {
  root: ["cart"] as const,
  address: (id: number) => ["user-address", id] as const,
};

export const useCartQuery = () =>
  useQuery(
    queryOptions({
      queryKey: cartKeys.root,
      queryFn: getCart,
      staleTime: 30_000,
    })
  );

export const useUserAddressQuery = (userId?: number) =>
  useQuery({
    queryKey: userId ? cartKeys.address(userId) : ["user-address", "none"],
    queryFn: () => getUserAddressById(userId as number),
    enabled: !!userId,
  });

export const useUpdateQtyMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      productId,
      quantity,
    }: {
      productId: number;
      quantity: number;
    }) => updateCartItemQuantity(productId, quantity),
    onSuccess: () => qc.invalidateQueries({ queryKey: cartKeys.root }),
  });
};

export const useDeleteItemMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (productId: number) => deleteCartItem(productId),
    onSuccess: () => qc.invalidateQueries({ queryKey: cartKeys.root }),
  });
};

export const useClearCartMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: clearUserCart,
    onSuccess: () => qc.invalidateQueries({ queryKey: cartKeys.root }),
  });
};

export const useValidateVoucherMutation = () =>
  useMutation({
    mutationFn: (code: string) => validateVoucher(code),
  });

export const usePlaceOrderMutation = () =>
  useMutation({
    mutationFn: (payload: PlaceOrderPayload) => placeOrder(payload),
  });

// tiện cho page.tsx SSR prefetch nếu cần
export const cartOptions = () =>
  queryOptions({
    queryKey: cartKeys.root,
    queryFn: getCart,
  });
