export type TransaksiKeuangan = {
  tanggal: string;
  keterangan: string;
  kategori: string;
  jenis: "pemasukan" | "pengeluaran";
  jumlah: number;
  referensiId?: string;
  referensiType?: string;
};

export type LaporanKeuanganSummary = {
  saldoAwal: number;
  totalPemasukan: number;
  totalPengeluaran: number;
  saldoAkhir: number;
};
