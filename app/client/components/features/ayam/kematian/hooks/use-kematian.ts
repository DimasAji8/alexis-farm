import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchKematianList, createKematian, updateKematian, deleteKematian, type CreateKematianInput, type UpdateKematianInput } from "../kematian.api";

export function useKematianList() {
  return useQuery({ queryKey: ["kematian"], queryFn: fetchKematianList, staleTime: 0 });
}

export function useCreateKematian() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateKematianInput) => createKematian(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["kematian"] }); qc.invalidateQueries({ queryKey: ["kandang"] }); },
  });
}

export function useUpdateKematian() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateKematianInput }) => updateKematian(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["kematian"] }); qc.invalidateQueries({ queryKey: ["kandang"] }); },
  });
}

export function useDeleteKematian() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteKematian(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["kematian"] }); qc.invalidateQueries({ queryKey: ["kandang"] }); },
  });
}
