/**
 * Migration script untuk update data penjualan telur yang sudah ada
 * - Set semua data existing: statusBayar = "dibayar", tanggalBayar = tanggal transaksi
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Memulai migrasi data penjualan telur...\n');

  // Set tanggalBayar = tanggal transaksi untuk semua data
  const penjualanList = await prisma.penjualanTelur.findMany();

  console.log(`📝 Update ${penjualanList.length} data ke status DIBAYAR...\n`);

  for (const penjualan of penjualanList) {
    await prisma.penjualanTelur.update({
      where: { id: penjualan.id },
      data: {
        statusBayar: 'dibayar',
        tanggalBayar: penjualan.tanggal,
      },
    });
  }

  console.log(`✅ Berhasil migrasi ${penjualanList.length} data`);
  console.log(`\n✨ Semua data penjualan telur sekarang berstatus DIBAYAR!`);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
