export type CartItem = {
  productId: number;
  productName: string;
  productDescription: string;
  productImage: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
};

export type CartResponse = CartItem[];

export type ShippingFormValue = {
  email: string;
  name: string;
  phone: string;
  address: string;
  province: string;
  commune: string;
  shippingNote: string;
};

export type PaymentMethod = "cod" | "bank";

export type PlaceOrderPayload = {
  method: PaymentMethod;
  shipping: ShippingFormValue;
};

export type PlaceOrderResult = {
  orderId: string | number;
  message?: string;
};
