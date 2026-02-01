export type PengeluaranOperasional = {
  id: string;
  tanggal: string;
  kategori: string;
  jumlah: number;
  keterangan: string;
  bukti?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreatePengeluaranInput = {
  tanggal: Date;
  kategori: string;
  jumlah: number;
  keterangan: string;
  bukti?: string;
};

export type UpdatePengeluaranInput = Partial<CreatePengeluaranInput>;
