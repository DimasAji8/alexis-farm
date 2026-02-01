import { prisma } from "@/app/api/db/prisma";

export class LaporanKeuanganService {
  static async getLaporan(bulan: string, kandangId?: string) {
    const [year, month] = bulan.split("-");
    const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59);

    // Get kandang info
    const kandang = kandangId ? await prisma.kandang.findUnique({ where: { id: kandangId } }) : null;

    // Ambil penjualan telur (per kandang)
    const penjualan = await prisma.penjualanTelur.findMany({
      where: { 
        tanggal: { gte: startDate, lte: endDate },
        ...(kandangId && { kandangId })
      },
      orderBy: { tanggal: "asc" },
    });

    // Ambil pembelian pakan (global, tidak per kandang)
    const pembelianPakan = await prisma.pembelianPakan.findMany({
      where: { 
        tanggalBeli: { gte: startDate, lte: endDate }
      },
      orderBy: { tanggalBeli: "asc" },
      include: { jenisPakan: true },
    });

    // Ambil pengeluaran operasional (per kandang jika ada)
    const pengeluaran = await prisma.pengeluaranOperasional.findMany({
      where: { 
        tanggal: { gte: startDate, lte: endDate },
        ...(kandangId && { kandangId })
      },
      orderBy: { tanggal: "asc" },
    });

    // Gabungkan semua transaksi
    const transaksi = [
      ...penjualan.map((p) => ({
        tanggal: p.tanggal.toISOString(),
        keterangan: `Penjualan Telur - ${p.pembeli}`,
        kategori: "Penjualan Telur",
        jenis: "pemasukan" as const,
        jumlah: p.totalHarga,
        referensiId: p.id,
        referensiType: "penjualan_telur",
      })),
      ...pembelianPakan.map((p) => ({
        tanggal: p.tanggalBeli.toISOString(),
        keterangan: `Pembelian Pakan - ${p.jenisPakan.nama}`,
        kategori: "Pembelian Pakan",
        jenis: "pengeluaran" as const,
        jumlah: p.totalHarga,
        referensiId: p.id,
        referensiType: "pembelian_pakan",
      })),
      ...pengeluaran.map((p) => ({
        tanggal: p.tanggal.toISOString(),
        keterangan: `${p.kategori} - ${p.keterangan}`,
        kategori: p.kategori,
        jenis: "pengeluaran" as const,
        jumlah: p.jumlah,
        referensiId: p.id,
        referensiType: "pengeluaran_operasional",
      })),
    ].sort((a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime());

    // Hitung summary
    const totalPemasukan = transaksi
      .filter((t) => t.jenis === "pemasukan")
      .reduce((sum, t) => sum + t.jumlah, 0);

    const totalPengeluaran = transaksi
      .filter((t) => t.jenis === "pengeluaran")
      .reduce((sum, t) => sum + t.jumlah, 0);

    // Hitung saldo awal (saldo akhir bulan sebelumnya)
    const prevMonth = new Date(startDate);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    const prevMonthStart = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), 1);
    const prevMonthEnd = new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 0, 23, 59, 59);

    const prevPenjualan = await prisma.penjualanTelur.aggregate({
      where: { 
        tanggal: { gte: prevMonthStart, lte: prevMonthEnd },
        ...(kandangId && { kandangId })
      },
      _sum: { totalHarga: true },
    });

    const prevPembelian = await prisma.pembelianPakan.aggregate({
      where: { 
        tanggalBeli: { gte: prevMonthStart, lte: prevMonthEnd }
      },
      _sum: { totalHarga: true },
    });

    const prevPengeluaran = await prisma.pengeluaranOperasional.aggregate({
      where: { 
        tanggal: { gte: prevMonthStart, lte: prevMonthEnd },
        ...(kandangId && { kandangId })
      },
      _sum: { jumlah: true },
    });

    const saldoAwal =
      (prevPenjualan._sum.totalHarga || 0) -
      (prevPembelian._sum.totalHarga || 0) -
      (prevPengeluaran._sum.jumlah || 0);

    const saldoAkhir = saldoAwal + totalPemasukan - totalPengeluaran;

    return {
      kandang: kandang ? { id: kandang.id, kode: kandang.kode, nama: kandang.nama } : null,
      summary: {
        saldoAwal,
        totalPemasukan,
        totalPengeluaran,
        saldoAkhir,
      },
      transaksi,
    };
  }
}
