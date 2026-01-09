import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchPenjualanList, createPenjualan, updatePenjualan, deletePenjualan } from "./api";
import type { CreatePenjualanInput, UpdatePenjualanInput } from "../types";

export function usePenjualanList() {
  return useQuery({ queryKey: ["penjualan-telur"], queryFn: fetchPenjualanList, staleTime: 0 });
}

export function useCreatePenjualan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePenjualanInput) => createPenjualan(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["penjualan-telur"] }); qc.invalidateQueries({ queryKey: ["stok-telur"] }); },
  });
}

export function useUpdatePenjualan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePenjualanInput }) => updatePenjualan(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["penjualan-telur"] }); qc.invalidateQueries({ queryKey: ["stok-telur"] }); },
  });
}

export function useDeletePenjualan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deletePenjualan(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["penjualan-telur"] }); qc.invalidateQueries({ queryKey: ["stok-telur"] }); },
  });
}
