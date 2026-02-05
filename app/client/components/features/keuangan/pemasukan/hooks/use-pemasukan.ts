import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Pemasukan, CreatePemasukanInput } from "../types";
import { API_ENDPOINTS } from "./api";

const QUERY_KEY = "pemasukan";

export function usePemasukanList(bulan?: string | null) {
  return useQuery<Pemasukan[]>({
    queryKey: [QUERY_KEY, bulan],
    queryFn: async () => {
      const res = await fetch(API_ENDPOINTS.getAll(bulan || undefined));
      if (!res.ok) throw new Error("Gagal mengambil data");
      const json = await res.json();
      return json.data;
    },
  });
}

export function useCreatePemasukan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreatePemasukanInput) => {
      const res = await fetch(API_ENDPOINTS.create, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Gagal menambahkan data");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}

export function useUpdatePemasukan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreatePemasukanInput> }) => {
      const res = await fetch(API_ENDPOINTS.update(id), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Gagal memperbarui data");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}

export function useDeletePemasukan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(API_ENDPOINTS.delete(id), { method: "DELETE" });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Gagal menghapus data");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}