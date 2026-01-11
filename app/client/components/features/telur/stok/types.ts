export type StokTelur = {
  id: string;
  kandangId: string;
  tanggal: string;
  stockButir: number;
  stockKg: number;
  keterangan?: string | null;
  createdAt: string;
  updatedAt: string;
  kandang: { id: string; kode: string; nama: string };
};
