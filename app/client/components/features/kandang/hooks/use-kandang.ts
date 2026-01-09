import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchKandangList, createKandang, updateKandang, deleteKandang } from "./api";
import type { CreateKandangInput, UpdateKandangInput } from "../types";

export function useKandangList() {
  return useQuery({ queryKey: ["kandang"], queryFn: fetchKandangList, staleTime: 0 });
}

export function useCreateKandang() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateKandangInput) => createKandang(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["kandang"] }),
  });
}

export function useUpdateKandang() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateKandangInput }) => updateKandang(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["kandang"] }),
  });
}

export function useDeleteKandang() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteKandang(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["kandang"] }),
  });
}
