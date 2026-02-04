export interface Pemasukan {
  id: string;
  tanggal: string;
  kategori: string;
  jumlah: number;
  keterangan: string;
  createdAt: string;
  updatedAt: string;
}

export type CreatePemasukanInput = {
  tanggal: Date;
  kategori: string;
  jumlah: number;
  keterangan: string;
};