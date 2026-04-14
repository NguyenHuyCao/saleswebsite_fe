export type OrderItemPromotion = {
  promotionName: string;
  discount: number;
  maxDiscount: number;
  discountAmount: number;
};

export type OrderItem = {
  productDetailId: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  imageUrl: string | null;
  promotions?: OrderItemPromotion[];
};

export type Order = {
  orderId: number | string;
  orderCode: string;
  createdAt: string;
  deliveredAt: string | null;
  totalAmount: number;
  status:
    | "PENDING"
    | "WAITING_PAYMENT"
    | "CONFIRMED"
    | "SHIPPING"
    | "DELIVERED"
    | "CANCELLED"
    | "FAILED"
    | string;
  paymentStatus: "PAID" | "PENDING" | "REFUND_PENDING" | "CANCELLED" | string;
  paidAt: string | null;
  paidAmount: number | null;
  transferContent: string | null;
  moneyChannel: string | null;
  shippingAddress?: string;
  shippingMethod?: string;
  paymentMethod?: string;
  items: OrderItem[];
};
