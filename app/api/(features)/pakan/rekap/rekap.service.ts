import { prisma } from "@/app/api/db/prisma";
import { ValidationError } from "@/app/api/shared/utils/errors";

export class RekapPakanService {
  static async getRekapBulanan(bulan: string) {
    const [tahun, bulanNum] = bulan.split("-").map(Number);
    if (!tahun || !bulanNum || bulanNum < 1 || bulanNum > 12) {
      throw new ValidationError("Format bulan tidak valid (gunakan YYYY-MM)");
    }

    const startDate = new Date(tahun, bulanNum - 1, 1);
    const endDate = new Date(tahun, bulanNum, 0, 23, 59, 59);

    const jenisPakanList = await prisma.jenisPakan.findMany({ where: { isActive: true } });

    const rekapPerJenis = await Promise.all(
      jenisPakanList.map(async (jenis) => {
        const stokAwalDate = new Date(startDate);
        stokAwalDate.setDate(0);

        const pembelianSebelum = await prisma.pembelianPakan.aggregate({
          where: { jenisPakanId: jenis.id, tanggalBeli: { lt: startDate } },
          _sum: { jumlahKg: true },
        });

        const pemakaianSebelum = await prisma.pemakaianPakanHeader.aggregate({
          where: { jenisPakanId: jenis.id, tanggalPakai: { lt: startDate } },
          _sum: { jumlahKg: true },
        });

        const stokAwal = (pembelianSebelum._sum.jumlahKg || 0) - (pemakaianSebelum._sum.jumlahKg || 0);

        const pembelianBulanIni = await prisma.pembelianPakan.aggregate({
          where: {
            jenisPakanId: jenis.id,
            tanggalBeli: { gte: startDate, lte: endDate },
          },
          _sum: { jumlahKg: true, totalHarga: true },
        });

        const pemakaianBulanIni = await prisma.pemakaianPakanHeader.aggregate({
          where: {
            jenisPakanId: jenis.id,
            tanggalPakai: { gte: startDate, lte: endDate },
          },
          _sum: { jumlahKg: true, totalBiaya: true },
        });

        const masuk = pembelianBulanIni._sum.jumlahKg || 0;
        const keluar = pemakaianBulanIni._sum.jumlahKg || 0;
        const stokAkhir = stokAwal + masuk - keluar;
        const totalBiaya = pemakaianBulanIni._sum.totalBiaya || 0;
        const hargaRataRata = keluar > 0 ? totalBiaya / keluar : 0;

        return {
          jenisPakan: jenis,
          stokAwal,
          masuk,
          keluar,
          stokAkhir,
          totalBiaya,
          hargaRataRata,
        };
      })
    );

    const kandangList = await prisma.kandang.findMany({ where: { status: "aktif" } });

    const rekapPerKandang = await Promise.all(
      kandangList.map(async (kandang) => {
        const pemakaian = await prisma.pemakaianPakanHeader.findMany({
          where: {
            kandangId: kandang.id,
            tanggalPakai: { gte: startDate, lte: endDate },
          },
          include: { jenisPakan: true },
        });

        const totalPemakaian = pemakaian.reduce((sum, p) => sum + p.jumlahKg, 0);
        const totalBiaya = pemakaian.reduce((sum, p) => sum + p.totalBiaya, 0);
        const jumlahHari = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        const rataRataHarian = totalPemakaian / jumlahHari;

        return {
          kandang,
          totalPemakaian,
          totalBiaya,
          rataRataHarian,
          detailPerJenis: pemakaian.reduce((acc: any[], p) => {
            const existing = acc.find((x) => x.jenisPakan.id === p.jenisPakan.id);
            if (existing) {
              existing.jumlahKg += p.jumlahKg;
              existing.totalBiaya += p.totalBiaya;
            } else {
              acc.push({
                jenisPakan: p.jenisPakan,
                jumlahKg: p.jumlahKg,
                totalBiaya: p.totalBiaya,
              });
            }
            return acc;
          }, []),
        };
      })
    );

    return {
      periode: bulan,
      rekapPerJenis,
      rekapPerKandang,
      summary: {
        totalMasuk: rekapPerJenis.reduce((sum, r) => sum + r.masuk, 0),
        totalKeluar: rekapPerJenis.reduce((sum, r) => sum + r.keluar, 0),
        totalBiaya: rekapPerJenis.reduce((sum, r) => sum + r.totalBiaya, 0),
      },
    };
  }
}
