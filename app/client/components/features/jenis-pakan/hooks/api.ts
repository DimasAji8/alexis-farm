import { apiClient } from "@/lib/api-client";
import type { JenisPakan, CreateJenisPakanInput, UpdateJenisPakanInput } from "../types";

export async function fetchJenisPakanList(activeOnly = false): Promise<JenisPakan[]> {
  const url = activeOnly ? "/api/jenis-pakan?active=true" : "/api/jenis-pakan";
  const response = await apiClient<JenisPakan[]>(url);
  return response.data;
}

export async function createJenisPakan(data: CreateJenisPakanInput): Promise<JenisPakan> {
  const response = await apiClient<JenisPakan>("/api/jenis-pakan", { method: "POST", body: JSON.stringify(data) });
  return response.data;
}

export async function updateJenisPakan(id: string, data: UpdateJenisPakanInput): Promise<JenisPakan> {
  const response = await apiClient<JenisPakan>(`/api/jenis-pakan/${id}`, { method: "PUT", body: JSON.stringify(data) });
  return response.data;
}

export async function deleteJenisPakan(id: string): Promise<void> {
  await apiClient(`/api/jenis-pakan/${id}`, { method: "DELETE" });
}
