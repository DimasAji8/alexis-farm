import { prisma } from "@/app/api/db/prisma";

export class RekapTelurService {
  static async getRekapHarian(kandangId: string, bulan: string) {
    const [tahun, bulanNum] = bulan.split("-").map(Number);
    const startDate = new Date(tahun, bulanNum - 1, 1);
    const endDate = new Date(tahun, bulanNum, 0, 23, 59, 59);

    // Ambil hanya produksi dan penjualan dalam bulan
    const [produksi, penjualan] = await Promise.all([
      prisma.produksiTelur.findMany({
        where: { kandangId, tanggal: { gte: startDate, lte: endDate } },
        orderBy: { tanggal: "asc" },
      }),
      prisma.penjualanTelur.findMany({
        where: { kandangId, tanggal: { gte: startDate, lte: endDate } },
        orderBy: { tanggal: "asc" },
      }),
    ]);

    // Jika tidak ada produksi dan penjualan, return empty
    if (produksi.length === 0 && penjualan.length === 0) {
      return [];
    }

    // Buat map untuk lookup cepat
    const produksiMap = new Map(produksi.map(p => [p.tanggal.toISOString().split("T")[0], p]));
    
    // Group penjualan by tanggal
    const penjualanByDate = new Map<string, typeof penjualan>();
    for (const p of penjualan) {
      const dateKey = p.tanggal.toISOString().split("T")[0];
      if (!penjualanByDate.has(dateKey)) {
        penjualanByDate.set(dateKey, []);
      }
      penjualanByDate.get(dateKey)!.push(p);
    }

    // Ambil semua tanggal unik dari produksi dan penjualan saja
    const allDates = new Set<string>();
    produksi.forEach(p => allDates.add(p.tanggal.toISOString().split("T")[0]));
    penjualan.forEach(p => allDates.add(p.tanggal.toISOString().split("T")[0]));

    // Generate data hanya untuk tanggal yang ada transaksi
    const result = [];
    for (const dateKey of Array.from(allDates).sort()) {
      const prod = produksiMap.get(dateKey);
      const jual = penjualanByDate.get(dateKey) || [];
      
      // Ambil stok untuk tanggal ini
      const stok = await prisma.stockTelur.findUnique({
        where: { 
          kandangId_tanggal: { 
            kandangId, 
            tanggal: new Date(dateKey) 
          } 
        }
      });
      
      const masukKg = prod?.totalKg || 0;
      const keluarKg = jual.reduce((sum, p) => sum + p.beratKg, 0);
      const stokAkhirKg = stok?.stockKg || 0;
      
      result.push({
        tanggal: dateKey,
        masukKg,
        keluarKg,
        stokAkhirKg,
        penjualan: jual.map(p => ({
          id: p.id,
          pembeli: p.pembeli,
          beratKg: p.beratKg,
          hargaPerKg: p.hargaPerKg,
          totalHarga: p.totalHarga,
        })),
      });
    }

    return result;
  }
}
