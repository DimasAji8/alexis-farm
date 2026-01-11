export type PenjualanTelur = {
  id: string;
  kandangId: string;
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
  kandang: { id: string; kode: string; nama: string };
};

export type CreatePenjualanInput = {
  kandangId: string;
  tanggal: string;
  pembeli: string;
  beratKg: number;
  hargaPerKg: number;
  metodeBayar?: string;
  deskripsi?: string;
};

export type UpdatePenjualanInput = Partial<CreatePenjualanInput>;
