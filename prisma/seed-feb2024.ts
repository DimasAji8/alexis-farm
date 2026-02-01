import "dotenv/config";
import { prisma } from "../app/api/db/prisma";

async function main() {
  const admin = await prisma.user.findFirst({
    where: { role: "super_user" },
  });

  if (!admin) {
    throw new Error("Admin user tidak ditemukan.");
  }

  const kandang = await prisma.kandang.findFirst({
    where: { status: "aktif" },
  });

  if (!kandang) {
    throw new Error("Tidak ada kandang aktif.");
  }

  console.log(`✅ Using Kandang: ${kandang.nama}`);

  // 1. PRODUKSI TELUR FEBRUARI 2024
  const produksiData = [
    { tanggal: "2024-02-01", bagus: 850, tidakBagus: 2, berat: 51.2 },
    { tanggal: "2024-02-02", bagus: 855, tidakBagus: 3, berat: 51.5 },
    { tanggal: "2024-02-03", bagus: 848, tidakBagus: 1, berat: 51.0 },
    { tanggal: "2024-02-04", bagus: 860, tidakBagus: 4, berat: 52.0 },
    { tanggal: "2024-02-05", bagus: 852, tidakBagus: 2, berat: 51.3 },
    { tanggal: "2024-02-06", bagus: 865, tidakBagus: 3, berat: 52.2 },
    { tanggal: "2024-02-07", bagus: 858, tidakBagus: 2, berat: 51.8 },
    { tanggal: "2024-02-08", bagus: 870, tidakBagus: 5, berat: 52.5 },
    { tanggal: "2024-02-09", bagus: 863, tidakBagus: 3, berat: 52.0 },
    { tanggal: "2024-02-10", bagus: 868, tidakBagus: 4, berat: 52.3 },
    { tanggal: "2024-02-11", bagus: 855, tidakBagus: 2, berat: 51.5 },
    { tanggal: "2024-02-12", bagus: 872, tidakBagus: 6, berat: 52.8 },
    { tanggal: "2024-02-13", bagus: 860, tidakBagus: 3, berat: 51.9 },
    { tanggal: "2024-02-14", bagus: 875, tidakBagus: 4, berat: 52.9 },
    { tanggal: "2024-02-15", bagus: 868, tidakBagus: 2, berat: 52.2 },
    { tanggal: "2024-02-16", bagus: 880, tidakBagus: 5, berat: 53.2 },
    { tanggal: "2024-02-17", bagus: 865, tidakBagus: 3, berat: 52.1 },
    { tanggal: "2024-02-18", bagus: 870, tidakBagus: 4, berat: 52.5 },
    { tanggal: "2024-02-19", bagus: 863, tidakBagus: 2, berat: 52.0 },
    { tanggal: "2024-02-20", bagus: 878, tidakBagus: 6, berat: 53.0 },
    { tanggal: "2024-02-21", bagus: 860, tidakBagus: 3, berat: 51.8 },
    { tanggal: "2024-02-22", bagus: 885, tidakBagus: 5, berat: 53.5 },
    { tanggal: "2024-02-23", bagus: 872, tidakBagus: 4, berat: 52.6 },
    { tanggal: "2024-02-24", bagus: 868, tidakBagus: 3, berat: 52.3 },
    { tanggal: "2024-02-25", bagus: 875, tidakBagus: 5, berat: 52.8 },
    { tanggal: "2024-02-26", bagus: 880, tidakBagus: 4, berat: 53.1 },
    { tanggal: "2024-02-27", bagus: 870, tidakBagus: 3, berat: 52.5 },
    { tanggal: "2024-02-28", bagus: 883, tidakBagus: 6, berat: 53.4 },
    { tanggal: "2024-02-29", bagus: 878, tidakBagus: 4, berat: 53.0 },
  ];

  for (const data of produksiData) {
    const existing = await prisma.produksiTelur.findUnique({
      where: {
        kandangId_tanggal: {
          kandangId: kandang.id,
          tanggal: new Date(data.tanggal),
        },
      },
    });

    if (existing) {
      console.log(`ℹ️  Produksi ${data.tanggal} sudah ada, skip...`);
      continue;
    }

    await prisma.produksiTelur.create({
      data: {
        kandangId: kandang.id,
        tanggal: new Date(data.tanggal),
        jumlahBagusButir: data.bagus,
        jumlahTidakBagusButir: data.tidakBagus,
        totalButir: data.bagus + data.tidakBagus,
        totalKg: data.berat,
        createdBy: admin.id,
      },
    });

    console.log(`✅ Produksi ${data.tanggal}: ${data.bagus} bagus, ${data.tidakBagus} rusak = ${data.berat} Kg`);
  }

  // 2. PENJUALAN TELUR FEBRUARI 2024
  const penjualanData = [
    { tanggal: "2024-02-01", pembeli: "LASTRI", beratKg: 15, hargaPerKg: 25000, bayarTgl: "2024-02-05" },
    { tanggal: "2024-02-02", pembeli: "LASTRI", beratKg: 15, hargaPerKg: 25000, bayarTgl: "2024-02-05" },
    { tanggal: "2024-02-03", pembeli: "GISMA", beratKg: 250, hargaPerKg: 25000, bayarTgl: "2024-02-03" },
    { tanggal: "2024-02-04", pembeli: "LASTRI", beratKg: 15, hargaPerKg: 25200, bayarTgl: "2024-02-08" },
    { tanggal: "2024-02-05", pembeli: "LASTRI", beratKg: 15, hargaPerKg: 25200, bayarTgl: "2024-02-08" },
    { tanggal: "2024-02-06", pembeli: "LASTRI", beratKg: 15, hargaPerKg: 25200, bayarTgl: "2024-02-08" },
    { tanggal: "2024-02-07", pembeli: "LASTRI", beratKg: 15, hargaPerKg: 24800, bayarTgl: "2024-02-12" },
    { tanggal: "2024-02-08", pembeli: "LASTRI", beratKg: 15, hargaPerKg: 24800, bayarTgl: "2024-02-12" },
    { tanggal: "2024-02-09", pembeli: "LASTRI", beratKg: 15, hargaPerKg: 25000, bayarTgl: "2024-02-12" },
    { tanggal: "2024-02-10", pembeli: "GISMA", beratKg: 260, hargaPerKg: 25000, bayarTgl: "2024-02-10" },
    { tanggal: "2024-02-11", pembeli: "LASTRI", beratKg: 15, hargaPerKg: 25000, bayarTgl: "2024-02-15" },
    { tanggal: "2024-02-12", pembeli: "LASTRI", beratKg: 15, hargaPerKg: 25000, bayarTgl: "2024-02-15" },
    { tanggal: "2024-02-13", pembeli: "LASTRI", beratKg: 15, hargaPerKg: 25200, bayarTgl: "2024-02-15" },
    { tanggal: "2024-02-14", pembeli: "LASTRI", beratKg: 15, hargaPerKg: 25200, bayarTgl: "2024-02-18" },
    { tanggal: "2024-02-15", pembeli: "LASTRI", beratKg: 15, hargaPerKg: 25200, bayarTgl: "2024-02-18" },
    { tanggal: "2024-02-16", pembeli: "LASTRI", beratKg: 15, hargaPerKg: 25400, bayarTgl: "2024-02-18" },
    { tanggal: "2024-02-17", pembeli: "GISMA", beratKg: 255, hargaPerKg: 25400, bayarTgl: "2024-02-17" },
    { tanggal: "2024-02-18", pembeli: "LASTRI", beratKg: 15, hargaPerKg: 25400, bayarTgl: "2024-02-22" },
    { tanggal: "2024-02-19", pembeli: "LASTRI", beratKg: 15, hargaPerKg: 25000, bayarTgl: "2024-02-22" },
    { tanggal: "2024-02-20", pembeli: "LASTRI", beratKg: 15, hargaPerKg: 25000, bayarTgl: "2024-02-22" },
    { tanggal: "2024-02-21", pembeli: "LASTRI", beratKg: 15, hargaPerKg: 25000, bayarTgl: "2024-02-25" },
    { tanggal: "2024-02-22", pembeli: "LASTRI", beratKg: 15, hargaPerKg: 24800, bayarTgl: "2024-02-25" },
    { tanggal: "2024-02-23", pembeli: "LASTRI", beratKg: 15, hargaPerKg: 24800, bayarTgl: "2024-02-25" },
    { tanggal: "2024-02-24", pembeli: "GISMA", beratKg: 270, hargaPerKg: 25000, bayarTgl: "2024-02-24" },
    { tanggal: "2024-02-25", pembeli: "LASTRI", beratKg: 15, hargaPerKg: 25000, bayarTgl: "2024-02-29" },
    { tanggal: "2024-02-26", pembeli: "LASTRI", beratKg: 15, hargaPerKg: 25000, bayarTgl: "2024-02-29" },
    { tanggal: "2024-02-27", pembeli: "LASTRI", beratKg: 15, hargaPerKg: 25200, bayarTgl: "2024-02-29" },
    { tanggal: "2024-02-28", pembeli: "LASTRI", beratKg: 15, hargaPerKg: 25200, bayarTgl: "2024-03-01" },
    { tanggal: "2024-02-29", pembeli: "LASTRI", beratKg: 15, hargaPerKg: 25200, bayarTgl: "2024-03-01" },
  ];

  let nomorTransaksi = 1;
  for (const data of penjualanData) {
    const existing = await prisma.penjualanTelur.findFirst({
      where: {
        kandangId: kandang.id,
        tanggal: new Date(data.tanggal),
        pembeli: data.pembeli,
        beratKg: data.beratKg,
      },
    });

    if (existing) {
      console.log(`ℹ️  Penjualan ${data.tanggal} - ${data.pembeli} sudah ada, skip...`);
      continue;
    }

    const totalHarga = data.beratKg * data.hargaPerKg;
    const jumlahButir = Math.round(data.beratKg * 16.67);

    await prisma.penjualanTelur.create({
      data: {
        kandangId: kandang.id,
        nomorTransaksi: `TRX-FEB24-${String(nomorTransaksi++).padStart(3, "0")}`,
        tanggal: new Date(data.tanggal),
        pembeli: data.pembeli,
        jumlahButir,
        beratKg: data.beratKg,
        hargaPerKg: data.hargaPerKg,
        totalHarga,
        saldoAwal: 0,
        uangMasuk: totalHarga,
        uangKeluar: 0,
        saldoAkhir: totalHarga,
        metodeBayar: "TEMPO",
        keterangan: `Bayar: ${data.bayarTgl}`,
        createdBy: admin.id,
      },
    });

    console.log(`✅ Penjualan ${data.tanggal} - ${data.pembeli}: ${data.beratKg} Kg @ Rp ${data.hargaPerKg.toLocaleString()} = Rp ${totalHarga.toLocaleString()}`);
  }

  // 3. PEMBELIAN PAKAN FEBRUARI 2024
  const pakanData = [
    { kode: "JG001", nama: "JAGUNG", tanggalBeli: "2024-02-05", jumlahKg: 300, hargaPerKg: 5500 },
    { kode: "KT001", nama: "KATUL", tanggalBeli: "2024-02-05", jumlahKg: 50, hargaPerKg: 3500 },
    { kode: "PD001", nama: "PARDOC", tanggalBeli: "2024-02-05", jumlahKg: 80, hargaPerKg: 8500 },
    { kode: "KLKS001", nama: "KONSENTRAT", tanggalBeli: "2024-02-05", jumlahKg: 200, hargaPerKg: 8500 },
    { kode: "JG001", nama: "JAGUNG", tanggalBeli: "2024-02-15", jumlahKg: 320, hargaPerKg: 5450 },
    { kode: "KT001", nama: "KATUL", tanggalBeli: "2024-02-15", jumlahKg: 60, hargaPerKg: 3400 },
    { kode: "PD001", nama: "PARDOC", tanggalBeli: "2024-02-15", jumlahKg: 100, hargaPerKg: 8400 },
    { kode: "KLKS001", nama: "KONSENTRAT", tanggalBeli: "2024-02-15", jumlahKg: 250, hargaPerKg: 8450 },
    { kode: "JG001", nama: "JAGUNG", tanggalBeli: "2024-02-25", jumlahKg: 310, hargaPerKg: 5600 },
    { kode: "KT001", nama: "KATUL", tanggalBeli: "2024-02-25", jumlahKg: 55, hargaPerKg: 3600 },
    { kode: "PD001", nama: "PARDOC", tanggalBeli: "2024-02-25", jumlahKg: 90, hargaPerKg: 8600 },
    { kode: "KLKS001", nama: "KONSENTRAT", tanggalBeli: "2024-02-25", jumlahKg: 220, hargaPerKg: 8550 },
  ];

  for (const pakan of pakanData) {
    const jenisPakan = await prisma.jenisPakan.findUnique({
      where: { kode: pakan.kode },
    });

    if (!jenisPakan) {
      console.log(`⚠️  Jenis pakan ${pakan.nama} (${pakan.kode}) tidak ditemukan, skip...`);
      continue;
    }

    const existing = await prisma.pembelianPakan.findFirst({
      where: {
        jenisPakanId: jenisPakan.id,
        tanggalBeli: new Date(pakan.tanggalBeli),
        jumlahKg: pakan.jumlahKg,
      },
    });

    if (existing) {
      console.log(`ℹ️  Pembelian ${pakan.nama} ${pakan.tanggalBeli} sudah ada, skip...`);
      continue;
    }

    await prisma.pembelianPakan.create({
      data: {
        jenisPakanId: jenisPakan.id,
        tanggalBeli: new Date(pakan.tanggalBeli),
        jumlahKg: pakan.jumlahKg,
        hargaPerKg: pakan.hargaPerKg,
        totalHarga: pakan.jumlahKg * pakan.hargaPerKg,
        sisaStokKg: pakan.jumlahKg,
        createdBy: admin.id,
      },
    });

    console.log(`✅ Pembelian ${pakan.nama} ${pakan.tanggalBeli}: ${pakan.jumlahKg} Kg @ Rp ${pakan.hargaPerKg.toLocaleString()} = Rp ${(pakan.jumlahKg * pakan.hargaPerKg).toLocaleString()}`);
  }

  // 4. PENGELUARAN OPERASIONAL FEBRUARI 2024
  const pengeluaranData = [
    { tanggal: "2024-02-01", kategori: "Listrik", jumlah: 450000, keterangan: "Bayar listrik bulan Januari 2024" },
    { tanggal: "2024-02-01", kategori: "Air", jumlah: 150000, keterangan: "Bayar air bulan Januari 2024" },
    { tanggal: "2024-02-05", kategori: "Gaji", jumlah: 2500000, keterangan: "Gaji karyawan bulan Januari 2024" },
    { tanggal: "2024-02-10", kategori: "Maintenance", jumlah: 350000, keterangan: "Perbaikan kandang dan peralatan" },
    { tanggal: "2024-02-15", kategori: "Transport", jumlah: 200000, keterangan: "Biaya transport pengiriman telur" },
    { tanggal: "2024-02-20", kategori: "Lainnya", jumlah: 180000, keterangan: "Pembelian alat kebersihan" },
    { tanggal: "2024-02-25", kategori: "Maintenance", jumlah: 420000, keterangan: "Service mesin dan peralatan" },
  ];

  for (const data of pengeluaranData) {
    const existing = await prisma.pengeluaranOperasional.findFirst({
      where: {
        tanggal: new Date(data.tanggal),
        kategori: data.kategori,
        jumlah: data.jumlah,
      },
    });

    if (existing) {
      console.log(`ℹ️  Pengeluaran ${data.tanggal} - ${data.kategori} sudah ada, skip...`);
      continue;
    }

    await prisma.pengeluaranOperasional.create({
      data: {
        tanggal: new Date(data.tanggal),
        kategori: data.kategori,
        jumlah: data.jumlah,
        keterangan: data.keterangan,
      },
    });

    console.log(`✅ Pengeluaran ${data.tanggal} - ${data.kategori}: Rp ${data.jumlah.toLocaleString()}`);
  }

  console.log("\n✅ Seed selesai - Data Lengkap Februari 2024");
  console.log("📊 Summary:");
  console.log(`   - Produksi Telur: ${produksiData.length} hari`);
  console.log(`   - Penjualan Telur: ${penjualanData.length} transaksi`);
  console.log(`   - Pembelian Pakan: ${pakanData.length} transaksi`);
  console.log(`   - Pengeluaran Operasional: ${pengeluaranData.length} transaksi`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
