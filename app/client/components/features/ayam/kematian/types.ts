export type KematianAyam = {
  id: string;
  kandangId: string;
  tanggal: string;
  jumlahMati: number;
  keterangan?: string | null;
  createdAt: string;
  updatedAt: string;
  kandang: { id: string; kode: string; nama: string; jumlahAyam: number };
};

export type CreateKematianInput = {
  kandangId: string;
  tanggal: string;
  jumlahMati: number;
  keterangan?: string;
};

export type UpdateKematianInput = Partial<CreateKematianInput>;
