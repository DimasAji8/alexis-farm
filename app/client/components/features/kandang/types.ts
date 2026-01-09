export type Kandang = {
  id: string;
  kode: string;
  nama: string;
  lokasi?: string | null;
  jumlahAyam: number;
  status: string;
  keterangan?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateKandangInput = {
  kode: string;
  nama: string;
  lokasi?: string;
  status?: "aktif" | "tidak_aktif" | "maintenance";
  keterangan?: string;
};

export type UpdateKandangInput = Partial<CreateKandangInput>;
