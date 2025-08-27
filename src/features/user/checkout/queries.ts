"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchCart, placeOrder } from "./services";
import type {
  CartResponse,
  PlaceOrderPayload,
  PlaceOrderResult,
} from "./types";
import { QK } from "@/lib/api/cacheKeys";

export function useCartQuery() {
  return useQuery<CartResponse, Error>({
    queryKey: [...QK.prefix, "cart"],
    queryFn: fetchCart,
  });
}

export function usePlaceOrder() {
  return useMutation<PlaceOrderResult, Error, PlaceOrderPayload>({
    mutationFn: placeOrder,
  });
}
