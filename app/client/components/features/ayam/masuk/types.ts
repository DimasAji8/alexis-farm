export type AyamMasuk = {
  id: string;
  kandangId: string;
  tanggal: string;
  jumlahAyam: number;
  createdAt: string;
  updatedAt: string;
  kandang: { id: string; kode: string; nama: string };
};

export type CreateAyamMasukInput = {
  kandangId: string;
  tanggal: string;
  jumlahAyam: number;
};

export type UpdateAyamMasukInput = Partial<CreateAyamMasukInput>;
