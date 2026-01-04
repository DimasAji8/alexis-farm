import { apiClient } from "@/lib/api-client";
import type { JenisPakan } from "./jenis-pakan.types";

export type CreateJenisPakanInput = {
  kode: string;
  nama: string;
  satuan?: string;
  keterangan?: string;
  isActive?: boolean;
};

export type UpdateJenisPakanInput = Partial<CreateJenisPakanInput>;

export async function fetchJenisPakanList(): Promise<JenisPakan[]> {
  const response = await apiClient<JenisPakan[]>("/api/jenis-pakan");
  return response.data;
}

export async function createJenisPakan(data: CreateJenisPakanInput): Promise<JenisPakan> {
  const response = await apiClient<JenisPakan>("/api/jenis-pakan", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return response.data;
}

export async function updateJenisPakan(id: string, data: UpdateJenisPakanInput): Promise<JenisPakan> {
  const response = await apiClient<JenisPakan>(`/api/jenis-pakan/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return response.data;
}

export async function deleteJenisPakan(id: string): Promise<void> {
  await apiClient(`/api/jenis-pakan/${id}`, { method: "DELETE" });
}
