import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchPembelianPakanList, createPembelianPakan, updatePembelianPakan, deletePembelianPakan } from "./api";

export function usePembelianPakanList() {
  return useQuery({ 
    queryKey: ["pembelian-pakan"], 
    queryFn: fetchPembelianPakanList,
    staleTime: 5 * 60 * 1000, // 5 menit
  });
}

export function useCreatePembelianPakan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createPembelianPakan,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pembelian-pakan"] }),
  });
}

export function useUpdatePembelianPakan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updatePembelianPakan(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pembelian-pakan"] }),
  });
}

export function useDeletePembelianPakan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deletePembelianPakan,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pembelian-pakan"] }),
  });
}
