export interface PembelianPakan {
  id: string;
  jenisPakanId: string;
  tanggalBeli: string;
  jumlahKg: number;
  hargaPerKg: number;
  totalHarga: number;
  sisaStokKg: number;
  keterangan?: string;
  createdAt: string;
  updatedAt: string;
  jenisPakan: {
    id: string;
    kode: string;
    nama: string;
    satuan: string;
  };
}

export interface CreatePembelianPakanInput {
  jenisPakanId: string;
  tanggalBeli: string;
  jumlahKg: number;
  hargaPerKg: number;
  keterangan?: string;
}

export interface UpdatePembelianPakanInput extends Partial<CreatePembelianPakanInput> {}
