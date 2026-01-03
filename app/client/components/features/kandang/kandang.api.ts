import { apiClient } from "@/lib/api-client";
import type { Kandang } from "./kandang.types";

export type CreateKandangInput = {
  kode: string;
  nama: string;
  lokasi?: string;
  status?: "aktif" | "tidak_aktif" | "maintenance";
  keterangan?: string;
};

export type UpdateKandangInput = Partial<CreateKandangInput>;

export async function fetchKandangList(): Promise<Kandang[]> {
  const response = await apiClient<Kandang[]>("/api/kandang");
  return response.data;
}

export async function createKandang(data: CreateKandangInput): Promise<Kandang> {
  const response = await apiClient<Kandang>("/api/kandang", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return response.data;
}

export async function updateKandang(id: string, data: UpdateKandangInput): Promise<Kandang> {
  const response = await apiClient<Kandang>(`/api/kandang/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return response.data;
}

export async function deleteKandang(id: string): Promise<void> {
  await apiClient(`/api/kandang/${id}`, { method: "DELETE" });
}
