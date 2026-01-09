export type PenjualanTelur = {
  id: string;
  nomorTransaksi: string;
  tanggal: string;
  pembeli: string;
  jumlahButir: number;
  beratKg: number;
  hargaPerKg: number;
  totalHarga: number;
  metodeBayar?: string | null;
  keterangan?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreatePenjualanInput = {
  tanggal: string;
  pembeli: string;
  beratKg: number;
  hargaPerKg: number;
  metodeBayar?: string;
  deskripsi?: string;
};

export type UpdatePenjualanInput = Partial<CreatePenjualanInput>;
