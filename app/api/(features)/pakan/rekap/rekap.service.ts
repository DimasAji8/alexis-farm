import { prisma } from "@/app/api/db/prisma";

import type { RekapPakanQuery } from "./rekap.validation";

export class RekapPakanService {
  static async getRekapPerJenis(query: RekapPakanQuery) {
    const { start, end } = query.bulan;
    const jenisFilter = query.jenisPakanId ? { id: query.jenisPakanId } : undefined;
    const days = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));

    // Stok awal: ambil sisaStokKg per jenis dari pembelian sampai sebelum periode
    const pembelianSebelum = await prisma.pembelianPakan.groupBy({
      by: ["jenisPakanId"],
      _sum: { sisaStokKg: true },
      where: {
        tanggalBeli: { lt: start },
        jenisPakanId: jenisFilter ? jenisFilter.id : undefined,
      },
    });

    // Masuk periode ini
    const pembelianPeriode = await prisma.pembelianPakan.groupBy({
      by: ["jenisPakanId"],
      _sum: { jumlahKg: true, totalHarga: true },
      where: {
        tanggalBeli: { gte: start, lt: end },
        jenisPakanId: jenisFilter ? jenisFilter.id : undefined,
      },
    });

    // Keluar periode ini
    const pemakaianPeriode = await prisma.pemakaianPakan.groupBy({
      by: ["jenisPakanId"],
      _sum: { jumlahKg: true, totalBiaya: true },
      where: {
        tanggalPakai: { gte: start, lt: end },
        jenisPakanId: jenisFilter ? jenisFilter.id : undefined,
      },
    });

    // Jenis pakan master
    const jenisList = await prisma.jenisPakan.findMany({
      where: jenisFilter,
      select: { id: true, kode: true, nama: true },
    });

    const mapPembelianSebelum = new Map(
      pembelianSebelum.map((p) => [p.jenisPakanId, p._sum.sisaStokKg ?? 0]),
    );
    const mapPembelianPeriode = new Map(
      pembelianPeriode.map((p) => [
        p.jenisPakanId,
        { kg: p._sum.jumlahKg ?? 0, harga: p._sum.totalHarga ?? 0 },
      ]),
    );
    const mapPemakaianPeriode = new Map(
      pemakaianPeriode.map((p) => [p.jenisPakanId, { kg: p._sum.jumlahKg ?? 0 }]),
    );

    const rekap = jenisList.map((jenis) => {
      const stokAwalKg = mapPembelianSebelum.get(jenis.id) ?? 0;
      const masukKg = mapPembelianPeriode.get(jenis.id)?.kg ?? 0;
      const masukRp = mapPembelianPeriode.get(jenis.id)?.harga ?? 0;
      const keluarKg = mapPemakaianPeriode.get(jenis.id)?.kg ?? 0;

      const stokAkhirKg = stokAwalKg + masukKg - keluarKg;
      const hargaRataKg = masukKg > 0 ? masukRp / masukKg : 0;
      const konsumsiRp = keluarKg * hargaRataKg;

      return {
        jenisPakanId: jenis.id,
        kode: jenis.kode,
        nama: jenis.nama,
        stokAwalKg,
        masukKg,
        masukRp,
        keluarKg,
        stokAkhirKg,
        hargaRataKg,
        konsumsiRp,
      };
    });

    // total agregat
    const total = rekap.reduce(
      (acc, item) => {
        acc.stokAwalKg += item.stokAwalKg;
        acc.masukKg += item.masukKg;
        acc.masukRp += item.masukRp;
        acc.keluarKg += item.keluarKg;
        acc.stokAkhirKg += item.stokAkhirKg;
        acc.konsumsiRp += item.konsumsiRp;
        return acc;
      },
      {
        stokAwalKg: 0,
        masukKg: 0,
        masukRp: 0,
        keluarKg: 0,
        stokAkhirKg: 0,
        konsumsiRp: 0,
      },
    );

    const totalAyam = await prisma.kandang.aggregate({
      _sum: { jumlahAyam: true },
    });
    const jumlahAyam = totalAyam._sum.jumlahAyam ?? 0;

    const hargaRataGabungan = total.keluarKg > 0 ? total.konsumsiRp / total.keluarKg : 0;
    const konsumsiPerHariKg = total.keluarKg / days;
    const konsumsiPerEkorKg = jumlahAyam > 0 ? total.keluarKg / jumlahAyam : 0;
    const konsumsiPerEkorGram = konsumsiPerEkorKg * 1000;
    const biayaPerEkor = jumlahAyam > 0 ? total.konsumsiRp / jumlahAyam : 0;
    const biayaPerHari = total.konsumsiRp / days;

    const summary = {
      days,
      jumlahAyam,
      totalKeluarKg: total.keluarKg,
      totalKonsumsiRp: total.konsumsiRp,
      hargaRataKgGabungan: hargaRataGabungan,
      konsumsiPerHariKg,
      konsumsiPerEkorKg,
      konsumsiPerEkorGram,
      biayaPerEkor,
      biayaPerHari,
    };

    if (query.harian) {
      const daily = await this.getRekapHarian({
        start,
        end,
        jenisPakanId: query.jenisPakanId,
        hargaRataGabungan,
      });
      const byKandang = query.byKandang
        ? await this.getRekapPerKandang({ start, end, hargaRataGabungan })
        : undefined;
      return { periode: { start, end }, rekap, total, summary, daily, byKandang };
    }

    const byKandang = query.byKandang
      ? await this.getRekapPerKandang({ start, end, hargaRataGabungan })
      : undefined;
    return { periode: { start, end }, rekap, total, summary, byKandang };
  }

  private static async getRekapHarian({
    start,
    end,
    jenisPakanId,
    hargaRataGabungan,
  }: {
    start: Date;
    end: Date;
    jenisPakanId?: string;
    hargaRataGabungan: number;
  }) {
    const jenisFilter = jenisPakanId ? { id: jenisPakanId } : undefined;

    const pembelian = await prisma.pembelianPakan.findMany({
      where: {
        tanggalBeli: { gte: start, lt: end },
        jenisPakanId: jenisFilter?.id,
      },
      orderBy: { tanggalBeli: "asc" },
    });

    const pemakaian = await prisma.pemakaianPakan.findMany({
      where: {
        tanggalPakai: { gte: start, lt: end },
        jenisPakanId: jenisFilter?.id,
      },
      orderBy: { tanggalPakai: "asc" },
    });

    const stokAwalSebelum = await prisma.pembelianPakan.groupBy({
      by: ["jenisPakanId"],
      _sum: { sisaStokKg: true },
      where: {
        tanggalBeli: { lt: start },
        jenisPakanId: jenisFilter?.id,
      },
    });
    const stokAwalKg = stokAwalSebelum.reduce((acc, s) => acc + (s._sum.sisaStokKg ?? 0), 0);

    const dayCount = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const days: Array<{
      tanggal: string;
      stokAwalKg: number;
      masukKg: number;
      masukRp: number;
      keluarKg: number;
      keluarRp: number;
      stokAkhirKg: number;
    }> = [];

    let runningStok = stokAwalKg;

    for (let i = 0; i < dayCount; i++) {
      const date = new Date(start.getTime());
      date.setUTCDate(start.getUTCDate() + i);
      const dayStr = date.toISOString().split("T")[0];

      const masukKg = pembelian
        .filter((p) => p.tanggalBeli.toISOString().split("T")[0] === dayStr)
        .reduce((sum, p) => sum + p.jumlahKg, 0);
      const masukRp = pembelian
        .filter((p) => p.tanggalBeli.toISOString().split("T")[0] === dayStr)
        .reduce((sum, p) => sum + p.totalHarga, 0);

      const keluarKg = pemakaian
        .filter((p) => p.tanggalPakai.toISOString().split("T")[0] === dayStr)
        .reduce((sum, p) => sum + p.jumlahKg, 0);
      const keluarRp = keluarKg * hargaRataGabungan;

      const stokAkhirKg = runningStok + masukKg - keluarKg;

      days.push({
        tanggal: dayStr,
        stokAwalKg: runningStok,
        masukKg,
        masukRp,
        keluarKg,
        keluarRp,
        stokAkhirKg,
      });

      runningStok = stokAkhirKg;
    }

    return days;
  }

  private static async getRekapPerKandang({
    start,
    end,
    hargaRataGabungan,
  }: {
    start: Date;
    end: Date;
    hargaRataGabungan: number;
  }) {
    const pemakaian = await prisma.pemakaianPakan.groupBy({
      by: ["kandangId"],
      _sum: { jumlahKg: true },
      where: { tanggalPakai: { gte: start, lt: end } },
    });

    const kandangList = await prisma.kandang.findMany({
      select: { id: true, kode: true, nama: true, jumlahAyam: true },
    });

    return kandangList.map((k) => {
      const pakai = pemakaian.find((p) => p.kandangId === k.id);
      const keluarKg = pakai?._sum.jumlahKg ?? 0;
      const konsumsiRp = keluarKg * hargaRataGabungan;
      const days = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
      const konsumsiPerHariKg = keluarKg / days;
      const konsumsiPerEkorKg = k.jumlahAyam > 0 ? keluarKg / k.jumlahAyam : 0;
      const konsumsiPerEkorGram = konsumsiPerEkorKg * 1000;
      const biayaPerEkor = k.jumlahAyam > 0 ? konsumsiRp / k.jumlahAyam : 0;

      return {
        kandangId: k.id,
        kode: k.kode,
        nama: k.nama,
        jumlahAyam: k.jumlahAyam,
        keluarKg,
        konsumsiRp,
        konsumsiPerHariKg,
        konsumsiPerEkorKg,
        konsumsiPerEkorGram,
        biayaPerEkor,
      };
    });
  }
}
