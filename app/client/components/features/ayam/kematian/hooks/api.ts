import { apiClient } from "@/lib/api-client";
import type { KematianAyam, CreateKematianInput, UpdateKematianInput } from "../types";

export async function fetchKematianList(kandangId?: string | null, bulan?: string | null) {
  const params = new URLSearchParams();
  if (kandangId) params.append("kandangId", kandangId);
  if (bulan) params.append("bulan", bulan);
  const query = params.toString();
  const response = await apiClient<{ list: KematianAyam[], summary: any }>(`/api/ayam/kematian${query ? `?${query}` : ""}`);
  return response.data;
}

export async function createKematian(data: CreateKematianInput): Promise<KematianAyam> {
  const response = await apiClient<KematianAyam>("/api/ayam/kematian", { method: "POST", body: JSON.stringify(data) });
  return response.data;
}

export async function updateKematian(id: string, data: UpdateKematianInput): Promise<KematianAyam> {
  const response = await apiClient<KematianAyam>(`/api/ayam/kematian/${id}`, { method: "PUT", body: JSON.stringify(data) });
  return response.data;
}

export async function deleteKematian(id: string): Promise<void> {
  await apiClient(`/api/ayam/kematian/${id}`, { method: "DELETE" });
}
