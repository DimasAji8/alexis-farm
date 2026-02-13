import { prisma } from "@/app/api/db/prisma";
import { ValidationError } from "@/app/api/shared/utils/errors";

export class PakanDashboardService {
  static async getDashboard(bulan: string, kandangId?: string) {
    const [tahun, bulanNum] = bulan.split("-").map(Number);
    if (!tahun || !bulanNum || bulanNum < 1 || bulanNum > 12) {
      throw new ValidationError("Format bulan tidak valid (gunakan YYYY-MM)");
    }

    const startDate = new Date(tahun, bulanNum - 1, 1);
    const endDate = new Date(tahun, bulanNum, 0, 23, 59, 59);
    const jumlahHari = new Date(tahun, bulanNum, 0).getDate();

    // Get kandang stats
    const whereKandang = kandangId ? { id: kandangId } : { status: "aktif" };
    const kandangList = await prisma.kandang.findMany({ where: whereKandang });
    const totalAyam = kandangList.reduce((sum, k) => sum + (k.jumlahAyam || 0), 0);

    // Get all active jenis pakan
    const jenisPakanList = await prisma.jenisPakan.findMany({
      where: { isActive: true },
      orderBy: { nama: "asc" },
    });

    // Get pemakaian bulan ini
    const wherePemakaian: any = {
      tanggalPakai: { gte: startDate, lte: endDate },
    };
    if (kandangId) wherePemakaian.kandangId = kandangId;

    const pemakaianBulanIni = await prisma.pemakaianPakanHeader.findMany({
      where: wherePemakaian,
      include: { jenisPakan: true },
    });

    // Calculate per jenis pakan
    const perJenisPakan = await Promise.all(
      jenisPakanList.map(async (jp) => {
        const pemakaian = pemakaianBulanIni.filter(p => p.jenisPakanId === jp.id);
        const totalKonsumsi = pemakaian.reduce((sum, p) => sum + p.jumlahKg, 0);
        const totalBiaya = pemakaian.reduce((sum, p) => sum + p.totalBiaya, 0);

        // Get stok tersedia sampai akhir bulan yang dipilih
        // Ambil semua pembelian sampai akhir bulan
        const pembelianSampaiAkhirBulan = await prisma.pembelianPakan.findMany({
          where: { 
            jenisPakanId: jp.id,
            tanggalBeli: { lte: endDate }
          },
        });

        // Ambil semua pemakaian sampai akhir bulan
        const pemakaianSampaiAkhirBulan = await prisma.pemakaianPakanHeader.findMany({
          where: {
            jenisPakanId: jp.id,
            tanggalPakai: { lte: endDate }
          },
          include: { details: true },
        });

        // Hitung stok dengan FIFO
        const batchTracking = pembelianSampaiAkhirBulan.map(p => ({
          id: p.id,
          sisaKg: p.jumlahKg,
        }));

        // Kurangi dengan pemakaian
        for (const pemakaian of pemakaianSampaiAkhirBulan) {
          for (const detail of pemakaian.details) {
            const batch = batchTracking.find(b => b.id === detail.pembelianPakanId);
            if (batch) batch.sisaKg -= detail.jumlahKg;
          }
        }

        const stokTersedia = batchTracking.reduce((sum, b) => sum + b.sisaKg, 0);

        return {
          id: jp.id,
          kode: jp.kode,
          nama: jp.nama,
          totalKonsumsi,
          totalBiaya,
          stokTersedia,
          persentase: 0, // Will calculate after
        };
      })
    );

    // Calculate totals
    const totalKonsumsi = perJenisPakan.reduce((sum, jp) => sum + jp.totalKonsumsi, 0);
    const totalBiaya = perJenisPakan.reduce((sum, jp) => sum + jp.totalBiaya, 0);

    // Calculate percentages
    perJenisPakan.forEach(jp => {
      jp.persentase = totalKonsumsi > 0 ? (jp.totalKonsumsi / totalKonsumsi) * 100 : 0;
    });

    // Calculate stats
    const konsumsiPerHari = totalKonsumsi / jumlahHari;
    const konsumsiPerEkor = totalAyam > 0 ? totalKonsumsi / totalAyam : 0;
    const konsumsiPerEkorGram = konsumsiPerEkor * 1000;
    const biayaPerKg = totalKonsumsi > 0 ? totalBiaya / totalKonsumsi : 0;
    const biayaPerEkor = totalAyam > 0 ? (totalBiaya / jumlahHari) / totalAyam : 0;

    // Calculate daily consumption for line chart
    const konsumsiHarian = [];
    for (let day = 1; day <= jumlahHari; day++) {
      const dayStart = new Date(tahun, bulanNum - 1, day, 0, 0, 0);
      const dayEnd = new Date(tahun, bulanNum - 1, day, 23, 59, 59);
      
      const dailyTotal = pemakaianBulanIni
        .filter(p => p.tanggalPakai >= dayStart && p.tanggalPakai <= dayEnd)
        .reduce((sum, p) => sum + p.jumlahKg, 0);
      
      konsumsiHarian.push({
        tanggal: day,
        konsumsi: dailyTotal,
      });
    }

    // Get previous month data for comparison
    const prevMonth = bulanNum === 1 ? 12 : bulanNum - 1;
    const prevYear = bulanNum === 1 ? tahun - 1 : tahun;
    const prevStartDate = new Date(prevYear, prevMonth - 1, 1);
    const prevEndDate = new Date(prevYear, prevMonth, 0, 23, 59, 59);

    const wherePrevPemakaian: any = {
      tanggalPakai: { gte: prevStartDate, lte: prevEndDate },
    };
    if (kandangId) wherePrevPemakaian.kandangId = kandangId;

    const pemakaianBulanLalu = await prisma.pemakaianPakanHeader.findMany({
      where: wherePrevPemakaian,
    });

    const totalKonsumsiPrev = pemakaianBulanLalu.reduce((sum, p) => sum + p.jumlahKg, 0);
    const totalBiayaPrev = pemakaianBulanLalu.reduce((sum, p) => sum + p.totalBiaya, 0);

    // Calculate comparison per jenis pakan
    const perbandingan = await Promise.all(
      jenisPakanList.map(async (jp) => {
        const konsumsiSekarang = pemakaianBulanIni
          .filter(p => p.jenisPakanId === jp.id)
          .reduce((sum, p) => sum + p.jumlahKg, 0);
        
        const konsumsiLalu = pemakaianBulanLalu
          .filter(p => p.jenisPakanId === jp.id)
          .reduce((sum, p) => sum + p.jumlahKg, 0);

        return {
          nama: jp.nama,
          bulanIni: konsumsiSekarang,
          bulanLalu: konsumsiLalu,
        };
      })
    );

    return {
      periode: bulan,
      summary: {
        totalKonsumsi,
        konsumsiPerHari,
        konsumsiPerEkor,
        konsumsiPerEkorGram,
        totalBiaya,
        biayaPerKg,
        biayaPerEkor,
        totalAyam,
        totalKonsumsiPrev,
        totalBiayaPrev,
      },
      perJenisPakan: perJenisPakan.sort((a, b) => b.totalKonsumsi - a.totalKonsumsi),
      konsumsiHarian,
      perbandingan: perbandingan.filter(p => p.bulanIni > 0 || p.bulanLalu > 0),
    };
  }
}
