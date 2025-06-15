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

  export type CategoryWithProducts = {
    id: number;
    name: string;
    slug: string;
    products: Product[];
  };

  export type Promotion = {
    id: number;
    name: string;
    code: string | null;
    discount: number;
    maxDiscount: number;
    startDate: string;
    endDate: string;
    requiresCode: boolean;
  };

  interface Category {
    id: number;
    name: string;
    image: string;
    slug: string;
    products: Product[];
  }

  export interface Brand {
    id: number;
    name: string;
    year: number;
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

  export type BrandWithCategories = {
    id: number;
    name: string;
    logo: string;
    slug: string;
    category: Category[];
  };

  export type Product = {
    id: number;
    name: string;
    slug: string;
    imageAvt: string;
    imageDetail1: string;
    imageDetail2: string;
    imageDetail3: string;
    price: number;
    pricePerUnit: number;
    originalPrice: number;
    sale: boolean;
    inStock: boolean;
    label: string;
    description: string;
    stockQuantity: number;
    totalStock: number;
    power: string;
    fuelType: string;
    engineType: string;
    weight: number;
    dimensions: string;
    tankCapacity: number;
    origin: string;
    warrantyMonths: number;
    createdAt: string;
    createdBy?: string;
    updatedAt?: string | null;
    updatedBy?: string | null;
    active?: boolean;
    rating?: number;
    status: string[];
    favorite: boolean;
  };

  interface IBackendRes<T> {
    message: string;
    status: number | string;
    data?: T;
  }

  export type CartItem = {
    productId: number;
    productName: string;
    productDescription: string;
    productImage: string;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
    discount: number;
    maxDiscount: number;
  };

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
