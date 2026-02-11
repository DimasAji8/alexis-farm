import { apiClient } from "@/lib/api-client";
import type { ProduktivitasTelur, CreateProduktivitasInput, UpdateProduktivitasInput } from "../types";

export async function fetchProduktivitasList(kandangId?: string | null, bulan?: string | null) {
  const params = new URLSearchParams();
  if (kandangId) params.append("kandangId", kandangId);
  if (bulan) params.append("bulan", bulan);
  const queryString = params.toString();
  const response = await apiClient<{ list: ProduktivitasTelur[], summary: any }>(`/api/telur/produksi${queryString ? `?${queryString}` : ""}`);
  return response.data;
}

export async function createProduktivitas(data: CreateProduktivitasInput): Promise<ProduktivitasTelur> {
  const response = await apiClient<ProduktivitasTelur>("/api/telur/produksi", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return response.data;
}

export async function updateProduktivitas(id: string, data: UpdateProduktivitasInput): Promise<ProduktivitasTelur> {
  const response = await apiClient<ProduktivitasTelur>(`/api/telur/produksi/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return response.data;
}
