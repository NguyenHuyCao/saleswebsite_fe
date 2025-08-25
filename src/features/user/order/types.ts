export type OrderItem = {
  productName: string;
  quantity: number;
  unitPrice: number;
  imageUrl: string;
  promotions?: { name: string }[];
};

export type Order = {
  orderId: number | string;
  createdAt: string;
  totalAmount: number;
  paymentStatus: "PAID" | "UNPAID" | "PENDING" | string;
  status:
    | "PENDING"
    | "WAITING_PAYMENT"
    | "CONFIRMED"
    | "SHIPPING"
    | "DELIVERED"
    | "CANCELLED"
    | "FAILED"
    | string;
  shippingAddress?: string;
  paymentMethod?: string;
  items: OrderItem[];
};
