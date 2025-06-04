export {};
// https://bobbyhadz.com/blog/typescript-make-types-global#declare-global-types-in-typescript

declare global {
  interface IRequest {
    url: string;
    method: string;
    body?: { [key: string]: any };
    queryParams?: any;
    useCredentials?: boolean;
    headers?: any;
    nextOption?: any;
  }

  interface CartItem {
    productId: number;
    productName: string;
    productDescription: string;
    productImage: string;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
  }

  interface Category {
    id: number;
    name: string;
    image?: string;
    products: any[];
  }

  export interface Brand {
    id: number;
    name: string;
    logo: string;
    originCountry: string;
    website?: string;
    description?: string;
    year?: number;
  }

  interface Category {
    id: number;
    name: string;
  }

  interface Brand {
    id: number;
    name: string;
    logo: string;
    categories: Category[];
  }

  export interface Product {
    id: string;
    name: string;
    image: string;
    inStock: boolean;
    price: number;
    oldPrice: number;
    tag?: string;
    badge?: string;
    rating?: number;
  }

  interface IBackendRes<T> {
    message: string;
    status: number | string;
    data?: T;
  }

  interface IModelPaginate<T> {
    meta: {
      current: number;
      pageSize: number;
      pages: number;
      total: number;
    };
    result: T[];
  }
}
