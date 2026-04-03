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
import type { PlaceOrderPayload } from "./types";

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
      variantId,
    }: {
      productId: number;
      quantity: number;
      variantId?: number | null;
    }) => updateCartItemQuantity(productId, quantity, variantId),
    onSuccess: () => qc.invalidateQueries({ queryKey: cartKeys.root }),
  });
};

export const useDeleteItemMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, variantId }: { productId: number; variantId?: number | null }) =>
      deleteCartItem(productId, variantId),
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

export const cartOptions = () =>
  queryOptions({
    queryKey: cartKeys.root,
    queryFn: getCart,
  });
