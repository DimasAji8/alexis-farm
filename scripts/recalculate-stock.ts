import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function recalculateStock() {
  console.log("Recalculating stock telur...");

  // Hapus semua stok lama
  await prisma.stockTelur.deleteMany();
  console.log("Cleared old stock data");

  // Ambil semua kandang
  const kandangs = await prisma.kandang.findMany();

  for (const kandang of kandangs) {
    console.log(`\nProcessing kandang: ${kandang.kode} - ${kandang.nama}`);

    // Ambil semua produksi untuk kandang ini, urut by tanggal
    const produksiList = await prisma.produksiTelur.findMany({
      where: { kandangId: kandang.id },
      orderBy: { tanggal: "asc" },
    });

    // Ambil semua penjualan untuk kandang ini, urut by tanggal
    const penjualanList = await prisma.penjualanTelur.findMany({
      where: { kandangId: kandang.id },
      orderBy: { tanggal: "asc" },
    });

    // Gabungkan dan sort by tanggal
    type Transaction = {
      tanggal: Date;
      deltaButir: number;
      deltaKg: number;
    };

    const transactions: Transaction[] = [
      ...produksiList.map((p) => ({
        tanggal: p.tanggal,
        deltaButir: p.totalButir,
        deltaKg: p.totalKg,
      })),
      ...penjualanList.map((p) => ({
        tanggal: p.tanggal,
        deltaButir: -p.jumlahButir,
        deltaKg: -p.beratKg,
      })),
    ].sort((a, b) => a.tanggal.getTime() - b.tanggal.getTime());

    if (transactions.length === 0) {
      console.log("  No transactions found");
      continue;
    }

    // Group by tanggal dan hitung running total
    const stockByDate = new Map<string, { butir: number; kg: number }>();
    let runningButir = 0;
    let runningKg = 0;

    for (const tx of transactions) {
      const dateKey = tx.tanggal.toISOString().split("T")[0];
      runningButir += tx.deltaButir;
      runningKg += tx.deltaKg;
      stockByDate.set(dateKey, { butir: runningButir, kg: runningKg });
    }

    // Insert stock records
    for (const [dateStr, stock] of stockByDate) {
      const tanggal = new Date(dateStr);
      await prisma.stockTelur.create({
        data: {
          kandangId: kandang.id,
          tanggal,
          stockButir: Math.max(0, stock.butir),
          stockKg: Math.max(0, stock.kg),
        },
      });
      console.log(`  ${dateStr}: ${stock.butir} butir, ${stock.kg} kg`);
    }
  }

  console.log("\nDone!");
}

recalculateStock()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
