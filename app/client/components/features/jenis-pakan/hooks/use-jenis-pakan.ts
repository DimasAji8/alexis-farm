import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchJenisPakanList,
  createJenisPakan,
  updateJenisPakan,
  deleteJenisPakan,
  type CreateJenisPakanInput,
  type UpdateJenisPakanInput,
} from "../jenis-pakan.api";

export function useJenisPakanList() {
  return useQuery({
    queryKey: ["jenis-pakan"],
    queryFn: fetchJenisPakanList,
    staleTime: 0,
  });
}

export function useCreateJenisPakan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateJenisPakanInput) => createJenisPakan(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["jenis-pakan"] }),
  });
}

export function useUpdateJenisPakan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateJenisPakanInput }) => updateJenisPakan(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["jenis-pakan"] }),
  });
}

export function useDeleteJenisPakan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteJenisPakan(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["jenis-pakan"] }),
  });
}
