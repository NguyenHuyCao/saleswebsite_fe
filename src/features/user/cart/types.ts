export type CartItem = {
  productId: number;
  productName: string;
  productDescription: string;
  productImage: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  discount?: number; // 0..1
  maxDiscount?: number;
  promotionName?: string;
  // Variant info (null for MACHINE products)
  variantId?: number | null;
  size?: string | null;
  color?: string | null;
};

export type VoucherValidateResponse = {
  discount: number; // 0..1
  maxDiscount: number;
  applicableProductIds: number[];
};

export type PlaceOrderPayload = {
  shippingAddress: string;
  paymentMethod: "COD" | "MOMO" | "VNPAY";
  shippingNote?: string;
  shippingAmount: number;
  promotionCodeByProductId?: Record<number, string>;
};
