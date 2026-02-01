import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/api/db/prisma";
import { startOfDay, endOfDay, subDays, format } from "date-fns";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const kandangId = searchParams.get("kandangId");
    const periode = parseInt(searchParams.get("periode") || "7");

    if (!kandangId) {
      return NextResponse.json({ error: "kandangId required" }, { status: 400 });
    }

    const today = new Date();
    const startDate = subDays(today, periode - 1);
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    // 1. Info Kandang
    const kandang = await prisma.kandang.findUnique({
      where: { id: kandangId },
    });

    if (!kandang) {
      return NextResponse.json({ error: "Kandang not found" }, { status: 404 });
    }

    // 2. Produksi Telur Hari Ini
    const produksiHariIni = await prisma.produksiTelur.findFirst({
      where: {
        kandangId,
        tanggal: {
          gte: startOfDay(today),
          lte: endOfDay(today),
        },
      },
    });

    // Produktivitas rata-rata bulan ini
    const produksiBulanIni = await prisma.produksiTelur.aggregate({
      where: {
        kandangId,
        tanggal: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      _avg: { totalButir: true },
      _count: true,
    });

    const produktivitasBulanan = kandang.jumlahAyam > 0 && produksiBulanIni._avg.totalButir
      ? (produksiBulanIni._avg.totalButir / kandang.jumlahAyam) * 100
      : 0;

    // 3. Stok Telur Terkini
    const stokTelur = await prisma.stockTelur.findFirst({
      where: { kandangId },
      orderBy: { tanggal: "desc" },
    });

    // 4. Konsumsi Pakan Hari Ini
    const pakanHariIni = await prisma.pemakaianPakanHeader.aggregate({
      where: {
        kandangId,
        tanggalPakai: {
          gte: startOfDay(today),
          lte: endOfDay(today),
        },
      },
      _sum: { jumlahKg: true, totalBiaya: true },
    });

    // 5. Tingkat Kematian
    const totalMasuk = await prisma.ayamMasuk.aggregate({
      where: { kandangId },
      _sum: { jumlahAyam: true },
    });

    const totalMati = await prisma.kematianRecord.aggregate({
      where: { kandangId },
      _sum: { jumlahMati: true },
    });

    const tingkatKematian = totalMasuk._sum.jumlahAyam
      ? ((totalMati._sum.jumlahMati || 0) / totalMasuk._sum.jumlahAyam) * 100
      : 0;

    // 6. Saldo Keuangan (dari penjualan telur terakhir)
    const penjualanTerakhir = await prisma.penjualanTelur.findFirst({
      where: { kandangId },
      orderBy: { tanggal: "desc" },
    });

    // 7. Trend Produksi Telur (dengan detail bagus/tidak bagus)
    const trendProduksi = await prisma.produksiTelur.findMany({
      where: {
        kandangId,
        tanggal: { gte: startDate },
      },
      orderBy: { tanggal: "asc" },
      select: {
        tanggal: true,
        totalButir: true,
        totalKg: true,
        jumlahBagusButir: true,
        jumlahTidakBagusButir: true,
      },
    });

    // 8. Trend Konsumsi Pakan
    const trendPakan = await prisma.pemakaianPakanHeader.groupBy({
      by: ["tanggalPakai"],
      where: {
        kandangId,
        tanggalPakai: { gte: startDate },
      },
      _sum: { jumlahKg: true, totalBiaya: true },
      orderBy: { tanggalPakai: "asc" },
    });

    // 9. Pemasukan vs Pengeluaran (bulan ini)
    const pemasukan = await prisma.penjualanTelur.aggregate({
      where: {
        kandangId,
        tanggal: { gte: startOfMonth, lte: endOfMonth },
      },
      _sum: { totalHarga: true },
    });

    const pengeluaranPakan = await prisma.pemakaianPakanHeader.aggregate({
      where: {
        kandangId,
        tanggalPakai: { gte: startOfMonth, lte: endOfMonth },
      },
      _sum: { totalBiaya: true },
    });

    const pengeluaranOperasional = await prisma.pengeluaranOperasional.aggregate({
      where: {
        kandangId,
        tanggal: { gte: startOfMonth, lte: endOfMonth },
      },
      _sum: { jumlah: true },
    });

    // 10. Aktivitas Terbaru
    const aktivitas = await getAktivitasTerbaru(kandangId);

    const data = {
      kandang: {
        id: kandang.id,
        kode: kandang.kode,
        nama: kandang.nama,
        jumlahAyam: kandang.jumlahAyam,
      },
      stats: {
        totalAyam: kandang.jumlahAyam,
        produksiHariIni: {
          butir: produksiHariIni?.totalButir || 0,
          kg: produksiHariIni?.totalKg || 0,
          persentase: kandang.jumlahAyam > 0 
            ? ((produksiHariIni?.totalButir || 0) / kandang.jumlahAyam) * 100 
            : 0,
        },
        produktivitasBulanan: {
          persentase: produktivitasBulanan,
          rataRataProduksi: produksiBulanIni._avg.totalButir || 0,
          jumlahHari: produksiBulanIni._count || 0,
        },
        stokTelur: {
          butir: stokTelur?.stockButir || 0,
          kg: stokTelur?.stockKg || 0,
        },
        pakanHariIni: {
          kg: pakanHariIni._sum.jumlahKg || 0,
          biaya: pakanHariIni._sum.totalBiaya || 0,
        },
        tingkatKematian,
        saldoKeuangan: penjualanTerakhir?.saldoAkhir || 0,
      },
      charts: {
        trendProduksi: trendProduksi.map((p) => ({
          tanggal: format(new Date(p.tanggal), "dd/MM"),
          butir: p.totalButir,
          kg: p.totalKg,
          bagus: p.jumlahBagusButir,
          tidakBagus: p.jumlahTidakBagusButir,
        })),
        trendPakan: trendPakan.map((p) => ({
          tanggal: format(new Date(p.tanggalPakai), "dd/MM"),
          kg: p._sum.jumlahKg || 0,
          biaya: p._sum.totalBiaya || 0,
        })),
        // FCR (Feed Conversion Ratio) = Pakan (kg) / Produksi Telur (kg)
        trendFCR: trendProduksi.map((p, idx) => {
          const pakanData = trendPakan[idx];
          const pakanKg = pakanData?._sum.jumlahKg || 0;
          const produksiKg = p.totalKg || 0;
          const fcr = produksiKg > 0 ? pakanKg / produksiKg : 0;
          
          return {
            tanggal: format(new Date(p.tanggal), "dd/MM"),
            fcr: parseFloat(fcr.toFixed(2)),
            pakan: pakanKg,
            produksi: produksiKg,
          };
        }),
        keuangan: {
          pemasukan: pemasukan._sum.totalHarga || 0,
          pengeluaranPakan: pengeluaranPakan._sum.totalBiaya || 0,
          pengeluaranOperasional: pengeluaranOperasional._sum.jumlah || 0,
          totalPengeluaran: (pengeluaranPakan._sum.totalBiaya || 0) + (pengeluaranOperasional._sum.jumlah || 0),
        },
      },
      aktivitas,
    };

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function getAktivitasTerbaru(kandangId: string) {
  const [produksi, penjualan, pakan, kematian] = await Promise.all([
    prisma.produksiTelur.findMany({
      where: { kandangId },
      orderBy: { tanggal: "desc" },
      take: 1,
      select: { tanggal: true, totalButir: true, totalKg: true },
    }),
    prisma.penjualanTelur.findMany({
      where: { kandangId },
      orderBy: { tanggal: "desc" },
      take: 2,
      select: { tanggal: true, pembeli: true, totalHarga: true },
    }),
    prisma.pemakaianPakanHeader.findMany({
      where: { kandangId },
      orderBy: { tanggalPakai: "desc" },
      take: 1,
      select: { tanggalPakai: true, jumlahKg: true, totalBiaya: true },
    }),
    prisma.kematianRecord.findMany({
      where: { kandangId },
      orderBy: { tanggal: "desc" },
      take: 1,
      select: { tanggal: true, jumlahMati: true },
    }),
  ]);

  const aktivitas = [
    ...produksi.map((p) => ({
      tanggal: p.tanggal,
      jenis: "Produksi Telur",
      deskripsi: `${p.totalButir} butir (${p.totalKg.toFixed(2)} kg)`,
    })),
    ...penjualan.map((p) => ({
      tanggal: p.tanggal,
      jenis: "Penjualan Telur",
      deskripsi: `${p.pembeli} - Rp ${p.totalHarga.toLocaleString("id-ID")}`,
    })),
    ...pakan.map((p) => ({
      tanggal: p.tanggalPakai,
      jenis: "Pemakaian Pakan",
      deskripsi: `${p.jumlahKg.toFixed(2)} kg - Rp ${p.totalBiaya.toLocaleString("id-ID")}`,
    })),
    ...kematian.map((k) => ({
      tanggal: k.tanggal,
      jenis: "Kematian Ayam",
      deskripsi: `${k.jumlahMati} ekor`,
    })),
  ];

  return aktivitas
    .sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime())
    .slice(0, 5);
}
