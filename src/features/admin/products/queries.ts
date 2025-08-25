// src/features/admin/products/queries.ts
import { useEffect, useState } from "react";
import type { Product, Paged, SimpleOption } from "./types";
import {
  apiListProducts,
  apiGetProduct,
  apiToggleActive,
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

// mutations
export const Mutations = {
  toggleActive: apiToggleActive,
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
};
