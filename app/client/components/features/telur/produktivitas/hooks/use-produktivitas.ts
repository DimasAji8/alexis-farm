import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchProduktivitasList, createProduktivitas, updateProduktivitas } from "./api";
import type { CreateProduktivitasInput, UpdateProduktivitasInput } from "../types";

export function useProduktivitasList(kandangId?: string | null) {
  return useQuery({
    queryKey: ["produktivitas-telur", kandangId],
    queryFn: () => fetchProduktivitasList(kandangId),
    staleTime: 5 * 60 * 1000,
    enabled: !!kandangId,
  });
}

export function useCreateProduktivitas() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProduktivitasInput) => createProduktivitas(data),
    onSuccess: () => { 
      qc.invalidateQueries({ queryKey: ["produktivitas-telur"] }); 
      qc.invalidateQueries({ queryKey: ["stok-telur"] }); 
      qc.invalidateQueries({ queryKey: ["rekap-telur-harian"] }); 
    },
  });
}

export function useUpdateProduktivitas() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProduktivitasInput }) => updateProduktivitas(id, data),
    onSuccess: () => { 
      qc.invalidateQueries({ queryKey: ["produktivitas-telur"] }); 
      qc.invalidateQueries({ queryKey: ["stok-telur"] }); 
      qc.invalidateQueries({ queryKey: ["rekap-telur-harian"] }); 
    },
  });
}
