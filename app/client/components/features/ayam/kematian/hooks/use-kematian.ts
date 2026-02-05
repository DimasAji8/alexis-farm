import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchKematianList, createKematian, updateKematian, deleteKematian } from "./api";
import type { CreateKematianInput, UpdateKematianInput } from "../types";

export function useKematianList(kandangId?: string | null, bulan?: string | null) {
  return useQuery({
    queryKey: ["kematian", kandangId, bulan],
    queryFn: () => fetchKematianList(kandangId, bulan),
    staleTime: 5 * 60 * 1000,
    enabled: !!kandangId,
  });
}

export function useCreateKematian() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateKematianInput) => createKematian(data),
    onSuccess: () => { 
      qc.invalidateQueries({ queryKey: ["kematian"] }); 
      qc.invalidateQueries({ queryKey: ["kematian-summary"] }); 
      qc.invalidateQueries({ queryKey: ["kandang"] }); 
    },
  });
}

export function useUpdateKematian() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateKematianInput }) => updateKematian(id, data),
    onSuccess: () => { 
      qc.invalidateQueries({ queryKey: ["kematian"] }); 
      qc.invalidateQueries({ queryKey: ["kematian-summary"] }); 
      qc.invalidateQueries({ queryKey: ["kandang"] }); 
    },
  });
}

export function useDeleteKematian() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteKematian(id),
    onSuccess: () => { 
      qc.invalidateQueries({ queryKey: ["kematian"] }); 
      qc.invalidateQueries({ queryKey: ["kematian-summary"] }); 
      qc.invalidateQueries({ queryKey: ["kandang"] }); 
    },
  });
}
