export type RekapTelurHarian = {
  tanggal: string;
  masukKg: number;
  keluarKg: number;
  stokAkhirKg: number;
  penjualan: {
    id: string;
    pembeli: string;
    beratKg: number;
    hargaPerKg: number;
    totalHarga: number;
  }[];
};
