import { apiClient } from "@/lib/api-client";
import type { KematianAyam } from "./kematian.types";

export type CreateKematianInput = {
  kandangId: string;
  tanggal: string;
  jumlahMati: number;
  keterangan?: string;
};

export type UpdateKematianInput = Partial<CreateKematianInput>;

export async function fetchKematianList(): Promise<KematianAyam[]> {
  const response = await apiClient<KematianAyam[]>("/api/ayam/kematian");
  return response.data;
}

export async function createKematian(data: CreateKematianInput): Promise<KematianAyam> {
  const response = await apiClient<KematianAyam>("/api/ayam/kematian", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return response.data;
}

export async function updateKematian(id: string, data: UpdateKematianInput): Promise<KematianAyam> {
  const response = await apiClient<KematianAyam>(`/api/ayam/kematian/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return response.data;
}

export async function deleteKematian(id: string): Promise<void> {
  await apiClient(`/api/ayam/kematian/${id}`, { method: "DELETE" });
}
