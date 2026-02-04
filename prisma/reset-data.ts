import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🗑️  Menghapus semua data...');

  // Hapus detail dulu
  await prisma.pemakaianPakanDetail.deleteMany();
  console.log('✓ Pemakaian pakan detail dihapus');

  // Hapus transaksi
  await prisma.pemakaianPakanHeader.deleteMany();
  console.log('✓ Pemakaian pakan header dihapus');

  await prisma.pembelianPakan.deleteMany();
  console.log('✓ Pembelian pakan dihapus');

  await prisma.penjualanTelur.deleteMany();
  console.log('✓ Penjualan telur dihapus');

  await prisma.stockTelur.deleteMany();
  console.log('✓ Stock telur dihapus');

  await prisma.produksiTelur.deleteMany();
  console.log('✓ Produksi telur dihapus');

  await prisma.kematianRecord.deleteMany();
  console.log('✓ Kematian ayam dihapus');

  await prisma.ayamMasuk.deleteMany();
  console.log('✓ Ayam masuk dihapus');

  await prisma.pengeluaranOperasional.deleteMany();
  console.log('✓ Pengeluaran operasional dihapus');

  await prisma.transaksiKeuangan.deleteMany();
  console.log('✓ Transaksi keuangan dihapus');

  await prisma.laporanBulanan.deleteMany();
  console.log('✓ Laporan bulanan dihapus');

  // Hapus master data (kecuali user)
  await prisma.jenisPakan.deleteMany();
  console.log('✓ Jenis pakan dihapus');

  await prisma.kandang.deleteMany();
  console.log('✓ Kandang dihapus');

  console.log('✅ Semua data berhasil dihapus (kecuali user)');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
