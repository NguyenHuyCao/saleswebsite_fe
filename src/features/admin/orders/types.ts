// List item (bảng danh sách)
export interface OrderListItem {
  orderId: number;
  orderCode: string;
  status: string;
  shippingAddress: string;
  paymentMethod: string;
  shippingMethod: string;
  totalAmount: number;
  createdAt: string;
  paymentStatus: string;
  paidAt: string | null;
  moneyChannel: string | null;
  user: { email: string; phone: string };
}

export interface PagedResp<T> {
  result: T[];
  meta: { page: number; pageSize: number; pages: number; total: number };
}

// Detail
export interface Promotion {
  promotionName: string;
  discount: number; // 0..1
  maxDiscount: number;
  discountAmount: number;
}

export interface OrderItem {
  productDetailId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  promotions?: Promotion[];
}

export interface UserInfo {
  userId: number;
  userName: string;
  email: string;
  phone: string;
  address: string;
}

export interface OrderDetail {
  orderId: number;
  orderCode: string;
  status: string;
  shippingAddress: string;
  paymentMethod: string;
  shippingMethod: string;
  totalAmount: number;
  createdAt: string;
  deliveredAt: string | null;
  items: OrderItem[];
  paymentStatus: string;
  paidAt: string | null;
  paidAmount: number | null;
  transferContent: string | null;
  moneyChannel: string | null;
  user: UserInfo;
}
