import { apiClient } from "@/lib/api-client";
import type { User, CreateUserInput } from "../types";

export async function fetchUserList(): Promise<User[]> {
  const response = await apiClient<User[]>("/api/users");
  return response.data;
}

export async function createUser(data: CreateUserInput): Promise<User> {
  const response = await apiClient<User>("/api/users", { method: "POST", body: JSON.stringify(data) });
  return response.data;
}

export async function deleteUser(id: string): Promise<void> {
  await apiClient(`/api/users/${id}`, { method: "DELETE" });
}
