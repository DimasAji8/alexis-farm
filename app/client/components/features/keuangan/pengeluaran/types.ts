export type PengeluaranOperasional = {
  id: string;
  kandangId: string;
  tanggal: string;
  kategori: string;
  jumlah: number;
  keterangan: string;
  bukti?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreatePengeluaranInput = {
  kandangId: string;
  tanggal: Date;
  kategori: string;
  jumlah: number;
  keterangan: string;
  bukti?: string;
};

export type UpdatePengeluaranInput = Partial<CreatePengeluaranInput>;
