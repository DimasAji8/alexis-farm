import { apiClient } from "@/lib/api-client";
import type { ProduktivitasTelur, CreateProduktivitasInput, UpdateProduktivitasInput } from "../types";

export async function fetchProduktivitasList(kandangId?: string | null): Promise<ProduktivitasTelur[]> {
  const params = kandangId ? `?kandangId=${kandangId}` : "";
  const response = await apiClient<ProduktivitasTelur[]>(`/api/telur/produksi${params}`);
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
