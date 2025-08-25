import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createBrand, getBrands, updateBrand } from "./api";

export const QK = {
  brands: (page: number, size: number) => ["admin-brands", page, size] as const,
};

export function useBrands(page: number, size: number) {
  return useQuery({
    queryKey: QK.brands(page, size),
    queryFn: () => getBrands({ page, size }),
  });
}

export function useCreateBrand(page: number, size: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (fd: FormData) => createBrand(fd),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.brands(page, size) }),
  });
}

export function useUpdateBrand(page: number, size: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, fd }: { id: number; fd: FormData }) =>
      updateBrand(id, fd),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.brands(page, size) }),
  });
}
