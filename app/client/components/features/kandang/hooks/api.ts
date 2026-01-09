import { apiClient } from "@/lib/api-client";
import type { Kandang, CreateKandangInput, UpdateKandangInput } from "../types";

export async function fetchKandangList(): Promise<Kandang[]> {
  const response = await apiClient<Kandang[]>("/api/kandang");
  return response.data;
}

export async function createKandang(data: CreateKandangInput): Promise<Kandang> {
  const response = await apiClient<Kandang>("/api/kandang", { method: "POST", body: JSON.stringify(data) });
  return response.data;
}

export async function updateKandang(id: string, data: UpdateKandangInput): Promise<Kandang> {
  const response = await apiClient<Kandang>(`/api/kandang/${id}`, { method: "PUT", body: JSON.stringify(data) });
  return response.data;
}

export async function deleteKandang(id: string): Promise<void> {
  await apiClient(`/api/kandang/${id}`, { method: "DELETE" });
}
