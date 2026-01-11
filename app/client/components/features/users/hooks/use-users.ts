import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUserList, createUser, deleteUser } from "./api";
import type { CreateUserInput } from "../types";

export function useUserList() {
  return useQuery({ queryKey: ["users"], queryFn: fetchUserList, staleTime: 5 * 60 * 1000 });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateUserInput) => createUser(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
}
