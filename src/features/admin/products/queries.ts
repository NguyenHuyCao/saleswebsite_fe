// src/features/admin/products/queries.ts
import { useEffect, useState } from "react";
import type { Product, Paged, ProductVariant, SimpleOption } from "./types";
import {
  apiListProducts,
  apiGetProduct,
  apiToggleActive,
  apiDeleteProduct,
  apiCategories,
  apiBrands,
  apiCreateStep1,
  apiCreateStep2,
  apiCreateStep3,
  apiCreateStep4,
  apiUpdateStep1,
  apiUpdateStep2,
  apiUpdateStep3,
  apiUpdateStep4,
  apiListVariants,
  apiCreateVariant,
  apiUpdateVariant,
  apiDeleteVariant,
} from "./api";

// fetch list
export function useProducts() {
  const [data, setData] = useState<Paged<Product> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiListProducts()
      .then(setData)
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, []);

  return {
    data,
    error,
    loading,
    refetch: async () => {
      setLoading(true);
      try {
        setData(await apiListProducts());
      } catch (e: any) {
        setError(String(e));
      } finally {
        setLoading(false);
      }
    },
  };
}

export function useProduct(slug?: string | null) {
  const [data, setData] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(!!slug);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    apiGetProduct(slug)
      .then(setData)
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, [slug]);

  return { data, error, loading };
}

// helpers
export const Catalog = {
  useCategories() {
    const [data, setData] = useState<SimpleOption[]>([]);
    useEffect(() => {
      apiCategories()
        .then(setData)
        .catch(() => {});
    }, []);
    return data;
  },
  useBrands() {
    const [data, setData] = useState<SimpleOption[]>([]);
    useEffect(() => {
      apiBrands()
        .then(setData)
        .catch(() => {});
    }, []);
    return data;
  },
};

// variant hook
export function useVariants(productId: number | null | undefined) {
  const [data, setData] = useState<ProductVariant[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    if (!productId) return;
    setLoading(true);
    try { setData(await apiListVariants(productId)); }
    catch { setData([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [productId]);

  return { data, loading, refetch: load };
}

// mutations
export const Mutations = {
  toggleActive: apiToggleActive,
  deleteProduct: apiDeleteProduct,
  create: {
    step1: apiCreateStep1,
    step2: apiCreateStep2,
    step3: apiCreateStep3,
    step4: apiCreateStep4,
  },
  update: {
    step1: apiUpdateStep1,
    step2: apiUpdateStep2,
    step3: apiUpdateStep3,
    step4: apiUpdateStep4,
  },
  variants: {
    list: apiListVariants,
    create: apiCreateVariant,
    update: apiUpdateVariant,
    delete: apiDeleteVariant,
  },
};
