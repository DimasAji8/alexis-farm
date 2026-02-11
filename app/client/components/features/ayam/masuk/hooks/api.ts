import { apiClient } from "@/lib/api-client";
import type { AyamMasuk, CreateAyamMasukInput, UpdateAyamMasukInput } from "../types";

export async function fetchAyamMasukList(kandangId?: string | null, bulan?: string | null) {
  const params = new URLSearchParams();
  if (kandangId) params.set("kandangId", kandangId);
  if (bulan) params.set("bulan", bulan);
  const query = params.toString() ? `?${params.toString()}` : "";
  const response = await apiClient<{ list: AyamMasuk[], summary: any }>(`/api/ayam/masuk${query}`);
  return response.data;
}

export async function createAyamMasuk(data: CreateAyamMasukInput): Promise<AyamMasuk> {
  const response = await apiClient<AyamMasuk>("/api/ayam/masuk", { method: "POST", body: JSON.stringify(data) });
  return response.data;
}

export async function updateAyamMasuk(id: string, data: UpdateAyamMasukInput): Promise<AyamMasuk> {
  const response = await apiClient<AyamMasuk>(`/api/ayam/masuk/${id}`, { method: "PUT", body: JSON.stringify(data) });
  return response.data;
}

export async function deleteAyamMasuk(id: string): Promise<void> {
  await apiClient(`/api/ayam/masuk/${id}`, { method: "DELETE" });
}
