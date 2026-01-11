import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchAyamMasukList, createAyamMasuk, updateAyamMasuk, deleteAyamMasuk } from "./api";
import type { CreateAyamMasukInput, UpdateAyamMasukInput } from "../types";

export function useAyamMasukList(kandangId?: string | null) {
  return useQuery({
    queryKey: ["ayam-masuk", kandangId],
    queryFn: () => fetchAyamMasukList(kandangId),
    staleTime: 5 * 60 * 1000,
    enabled: !!kandangId,
  });
}

export function useCreateAyamMasuk() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAyamMasukInput) => createAyamMasuk(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["ayam-masuk"] }); qc.invalidateQueries({ queryKey: ["kandang"] }); },
  });
}

export function useUpdateAyamMasuk() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAyamMasukInput }) => updateAyamMasuk(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["ayam-masuk"] }); qc.invalidateQueries({ queryKey: ["kandang"] }); },
  });
}

export function useDeleteAyamMasuk() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteAyamMasuk(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["ayam-masuk"] }); qc.invalidateQueries({ queryKey: ["kandang"] }); },
  });
}
