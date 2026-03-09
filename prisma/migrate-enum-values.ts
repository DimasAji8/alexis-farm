import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🔄 Memulai migrasi nilai enum statusBayar...\n");

  // Update "lunas" → "dibayar"
  const updatedLunas = await prisma.$executeRaw`
    UPDATE "trx_penjualan_telur"
    SET "statusBayar" = 'dibayar'
    WHERE "statusBayar" = 'lunas'
  `;

  // Update "piutang" → "belum_dibayar"
  const updatedPiutang = await prisma.$executeRaw`
    UPDATE "trx_penjualan_telur"
    SET "statusBayar" = 'belum_dibayar'
    WHERE "statusBayar" = 'piutang'
  `;

  console.log(`✅ Berhasil update ${updatedLunas} record dari "lunas" ke "dibayar"`);
  console.log(`✅ Berhasil update ${updatedPiutang} record dari "piutang" ke "belum_dibayar"`);
  console.log("\n✨ Migrasi nilai enum selesai!");
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
