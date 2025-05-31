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
