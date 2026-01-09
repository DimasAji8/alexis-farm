import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchJenisPakanList, createJenisPakan, updateJenisPakan, deleteJenisPakan } from "./api";
import type { CreateJenisPakanInput, UpdateJenisPakanInput } from "../types";

export function useJenisPakanList() {
  return useQuery({ queryKey: ["jenis-pakan"], queryFn: fetchJenisPakanList, staleTime: 0 });
}

export function useCreateJenisPakan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateJenisPakanInput) => createJenisPakan(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["jenis-pakan"] }),
  });
}

export function useUpdateJenisPakan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateJenisPakanInput }) => updateJenisPakan(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["jenis-pakan"] }),
  });
}

export function useDeleteJenisPakan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteJenisPakan(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["jenis-pakan"] }),
  });
}
