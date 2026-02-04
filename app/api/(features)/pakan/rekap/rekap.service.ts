import { prisma } from "@/app/api/db/prisma";
import { ValidationError } from "@/app/api/shared/utils/errors";

export class RekapPakanService {
  static async getRekapHarian(bulan: string, jenisPakanId: string) {
    const [tahun, bulanNum] = bulan.split("-").map(Number);
    if (!tahun || !bulanNum || bulanNum < 1 || bulanNum > 12) {
      throw new ValidationError("Format bulan tidak valid (gunakan YYYY-MM)");
    }

    const startDate = new Date(tahun, bulanNum - 1, 1);
    const endDate = new Date(tahun, bulanNum, 0, 23, 59, 59);
    const jumlahHari = new Date(tahun, bulanNum, 0).getDate();

    // Ambil semua batch pembelian sebelum dan selama bulan
    const batchesPembelian = await prisma.pembelianPakan.findMany({
      where: { jenisPakanId, tanggalBeli: { lte: endDate } },
      orderBy: { tanggalBeli: "asc" },
    });

    // Ambil semua pemakaian selama bulan
    const pemakaianBulanIni = await prisma.pemakaianPakanHeader.findMany({
      where: {
        jenisPakanId,
        tanggalPakai: { gte: startDate, lte: endDate },
      },
      include: { details: true },
      orderBy: { tanggalPakai: "asc" },
    });

    // Simulasi FIFO untuk tracking stok harian
    const batchTracking = batchesPembelian.map(b => ({
      ...b,
      sisaKg: b.tanggalBeli < startDate ? b.jumlahKg : 0,
    }));

    // Kurangi dengan pemakaian sebelum bulan
    const pemakaianSebelum = await prisma.pemakaianPakanHeader.findMany({
      where: { jenisPakanId, tanggalPakai: { lt: startDate } },
      include: { details: true },
      orderBy: { tanggalPakai: "asc" },
    });

    for (const pemakaian of pemakaianSebelum) {
      for (const detail of pemakaian.details) {
        const batch = batchTracking.find(b => b.id === detail.pembelianPakanId);
        if (batch) batch.sisaKg -= detail.jumlahKg;
      }
    }

    const stokAwal = batchTracking.reduce((sum, b) => sum + b.sisaKg, 0);
    const stokAwalRp = batchTracking.reduce((sum, b) => sum + (b.sisaKg * b.hargaPerKg), 0);

    // Build data harian - only for dates with transactions
    const dataHarian = [];
    const tanggalSet = new Set<string>();
    
    // Collect dates with transactions
    batchesPembelian.forEach(b => {
      const tgl = b.tanggalBeli.toISOString().split("T")[0];
      const date = new Date(tgl);
      if (date >= startDate && date <= endDate) {
        tanggalSet.add(tgl);
      }
    });
    
    pemakaianBulanIni.forEach(p => {
      tanggalSet.add(p.tanggalPakai.toISOString().split("T")[0]);
    });
    
    const sortedDates = Array.from(tanggalSet).sort();
    
    let stokAwalHari = stokAwal;
    let stokAwalRpHari = stokAwalRp;

    for (const tanggalStr of sortedDates) {

      // Pembelian hari ini
      const pembelianHariIni = batchesPembelian.filter(
        b => b.tanggalBeli.toISOString().split("T")[0] === tanggalStr
      );
      const masukKg = pembelianHariIni.reduce((sum, b) => sum + b.jumlahKg, 0);
      const masukRp = pembelianHariIni.reduce((sum, b) => sum + b.totalHarga, 0);

      // Tambahkan batch baru ke tracking
      for (const batch of pembelianHariIni) {
        const existing = batchTracking.find(b => b.id === batch.id);
        if (existing) existing.sisaKg += batch.jumlahKg;
      }

      // Pemakaian hari ini
      const pemakaianHariIni = pemakaianBulanIni.filter(
        p => p.tanggalPakai.toISOString().split("T")[0] === tanggalStr
      );
      const keluarKg = pemakaianHariIni.reduce((sum, p) => sum + p.jumlahKg, 0);
      const keluarRp = pemakaianHariIni.reduce((sum, p) => sum + p.totalBiaya, 0);

      // Kurangi batch via FIFO
      for (const pemakaian of pemakaianHariIni) {
        for (const detail of pemakaian.details) {
          const batch = batchTracking.find(b => b.id === detail.pembelianPakanId);
          if (batch) batch.sisaKg -= detail.jumlahKg;
        }
      }

      const stokAkhirKg = batchTracking.reduce((sum, b) => sum + b.sisaKg, 0);
      const stokAkhirRp = batchTracking.reduce((sum, b) => sum + (b.sisaKg * b.hargaPerKg), 0);

      // Harga rata-rata hari ini (dari pemakaian)
      const hargaPerKg = keluarKg > 0 ? keluarRp / keluarKg : 0;

      dataHarian.push({
        tanggal: tanggalStr,
        hargaPerKg,
        stokAwalKg: stokAwalHari,
        stokAwalRp: stokAwalRpHari,
        masukKg,
        masukRp,
        keluarKg,
        keluarRp,
        stokAkhirKg,
        stokAkhirRp,
      });

      stokAwalHari = stokAkhirKg;
      stokAwalRpHari = stokAkhirRp;
    }

    // Get kandang stats for per-bird calculations
    const kandangList = await prisma.kandang.findMany({ where: { status: "aktif" } });
    const totalAyam = kandangList.reduce((sum, k) => sum + (k.jumlahAyam || 0), 0);
    
    const totalKeluarKg = dataHarian.reduce((sum, d) => sum + d.keluarKg, 0);
    const totalKeluarRp = dataHarian.reduce((sum, d) => sum + d.keluarRp, 0);
    
    // Hitung hari yang ada pemakaian
    const hariDenganPemakaian = dataHarian.filter(d => d.keluarKg > 0).length;
    const konsumsiPerHari = hariDenganPemakaian > 0 ? totalKeluarKg / hariDenganPemakaian : 0;
    const konsumsiPerEkor = totalAyam > 0 && hariDenganPemakaian > 0 ? totalKeluarKg / totalAyam / hariDenganPemakaian : 0;
    const konsumsiPerEkorGram = konsumsiPerEkor * 1000;
    const biayaPerKg = totalKeluarKg > 0 ? totalKeluarRp / totalKeluarKg : 0;
    const biayaPerEkor = totalAyam > 0 && hariDenganPemakaian > 0 ? totalKeluarRp / totalAyam / hariDenganPemakaian : 0;

    return {
      periode: bulan,
      jenisPakanId,
      dataHarian,
      summary: {
        totalMasukKg: dataHarian.reduce((sum, d) => sum + d.masukKg, 0),
        totalMasukRp: dataHarian.reduce((sum, d) => sum + d.masukRp, 0),
        totalKeluarKg,
        totalKeluarRp,
        konsumsiPerHari,
        konsumsiPerEkor,
        konsumsiPerEkorGram,
        biayaPerKg,
        biayaPerEkor,
      },
    };
  }

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
