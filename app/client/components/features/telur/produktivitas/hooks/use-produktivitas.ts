import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchProduktivitasList, createProduktivitas, updateProduktivitas } from "./api";
import type { CreateProduktivitasInput, UpdateProduktivitasInput } from "../types";

export function useProduktivitasList() {
  return useQuery({ queryKey: ["produktivitas-telur"], queryFn: fetchProduktivitasList, staleTime: 0 });
}

export function useCreateProduktivitas() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProduktivitasInput) => createProduktivitas(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["produktivitas-telur"] }); qc.invalidateQueries({ queryKey: ["stock-telur"] }); },
  });
}

export function useUpdateProduktivitas() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProduktivitasInput }) => updateProduktivitas(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["produktivitas-telur"] }); qc.invalidateQueries({ queryKey: ["stock-telur"] }); },
  });
}
