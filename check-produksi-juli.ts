import "dotenv/config";
import { prisma } from "./app/api/db/prisma";

async function main() {
  console.log("🔍 Checking Produksi Telur Agustus 2025...\n");

  const data = await prisma.produksiTelur.findMany({
    where: {
      tanggal: {
        gte: new Date("2025-08-01"),
        lte: new Date("2025-08-10"),
      },
    },
    orderBy: { tanggal: "asc" },
    include: {
      kandang: { select: { kode: true, nama: true, jumlahAyam: true } },
    },
  });

  if (data.length === 0) {
    console.log("❌ Tidak ada data produksi telur untuk tanggal 1-10 Agustus 2025");
    return;
  }

  console.log("Data ditemukan:\n");
  data.forEach((item) => {
    const persen = item.jumlahAyam > 0 
      ? ((item.totalButir / item.jumlahAyam) * 100).toFixed(2)
      : "0.00";
    
    console.log(`${item.tanggal.toLocaleDateString("id-ID")}: ${item.totalButir} / ${item.jumlahAyam} = ${persen}%`);
  });

  // Check kandang current
  const kandang = await prisma.kandang.findFirst({
    where: { kode: "KDG1" },
  });
  
  console.log(`\nJumlah ayam di kandang saat ini: ${kandang?.jumlahAyam || 0}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
