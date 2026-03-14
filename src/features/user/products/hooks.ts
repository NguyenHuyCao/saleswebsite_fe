
// hooks/useProductFilters.ts
import { useState, useMemo, useCallback } from "react";
import { useDebounce } from "@/lib/hooks/useDebounce";

export function useProductFilters(products: any[]) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  const debouncedSearch = useDebounce(search, 500);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) =>
        p.name.toLowerCase().includes(debouncedSearch.toLowerCase()),
      )
      .sort((a, b) => {
        if (sort === "newest")
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        if (sort === "asc") return a.price - b.price;
        if (sort === "desc") return b.price - a.price;
        return 0;
      });
  }, [products, debouncedSearch, sort]);

  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, page]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const handleSort = useCallback((value: string) => {
    setSort(value);
    setPage(1);
  }, []);

  return {
    search,
    sort,
    page,
    setPage,
    filteredProducts,
    paginatedProducts,
    totalPages,
    handleSearch,
    handleSort,
  };
}
