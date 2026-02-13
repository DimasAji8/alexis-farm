import "dotenv/config";
import { prisma } from "./app/api/db/prisma";

async function main() {
  console.log("🔄 Updating Agustus 2025 jumlahAyam to 995...\n");

  const result = await prisma.produksiTelur.updateMany({
    where: {
      tanggal: {
        gte: new Date("2025-08-01"),
        lt: new Date("2025-09-01"),
      },
    },
    data: {
      jumlahAyam: 995,
    },
  });

  console.log(`✅ Updated ${result.count} records`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
