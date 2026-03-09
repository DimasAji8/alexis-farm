import { apiClient } from "@/lib/api-client";
import type { JenisPakan, CreateJenisPakanInput, UpdateJenisPakanInput } from "../types";

export async function fetchJenisPakanList(activeOnly = false, kandangId?: string): Promise<JenisPakan[]> {
  const params = new URLSearchParams();
  if (activeOnly) params.set("active", "true");
  if (kandangId) params.set("kandangId", kandangId);
  const url = `/api/jenis-pakan${params.toString() ? `?${params.toString()}` : ""}`;
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
