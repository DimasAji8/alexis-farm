import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUserList, createUser, deleteUser, type CreateUserInput } from "../users.api";

export function useUserList() {
  return useQuery({
    queryKey: ["users"],
    queryFn: fetchUserList,
    staleTime: 0,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateUserInput) => createUser(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });
}
