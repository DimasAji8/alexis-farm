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

        // Get stok tersedia
        const stok = await prisma.pembelianPakan.aggregate({
          where: { jenisPakanId: jp.id, sisaStokKg: { gt: 0 } },
          _sum: { sisaStokKg: true },
        });

        return {
          id: jp.id,
          kode: jp.kode,
          nama: jp.nama,
          totalKonsumsi,
          totalBiaya,
          stokTersedia: stok._sum.sisaStokKg || 0,
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
    const biayaPerEkor = totalAyam > 0 ? totalBiaya / totalAyam : 0;

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
      },
      perJenisPakan: perJenisPakan.sort((a, b) => b.totalKonsumsi - a.totalKonsumsi),
    };
  }
}
