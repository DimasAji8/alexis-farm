import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { 
  fetchKandangList, 
  createKandang, 
  updateKandang, 
  deleteKandang,
  type CreateKandangInput,
  type UpdateKandangInput 
} from "../kandang.api";

export function useKandangList() {
  return useQuery({
    queryKey: ["kandang"],
    queryFn: fetchKandangList,
    staleTime: 0,
  });
}

export function useCreateKandang() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateKandangInput) => createKandang(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kandang"] });
    },
  });
}

export function useUpdateKandang() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateKandangInput }) => 
      updateKandang(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kandang"] });
    },
  });
}

export function useDeleteKandang() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => deleteKandang(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kandang"] });
    },
  });
}
