import "dotenv/config";
import { prisma } from "../../app/api/db/prisma";

async function main() {
  console.log("🌱 Seeding Keuangan Mei - Desember 2025...");

  const kandang = await prisma.kandang.findFirst({
    where: { kode: "KDG1" },
  });

  if (!kandang) {
    throw new Error("Kandang KDG1 not found");
  }

  // MEI 2025 - Saldo Awal & Pengeluaran Pembangunan Kandang
  console.log("\n💰 Seeding Mei 2025...");
  
  // Saldo Awal / Modal Awal
  await prisma.pemasukan.create({
    data: {
      tanggal: new Date("2025-05-01"),
      kategori: "MODAL",
      jumlah: 5000000,
      keterangan: "Modal awal / Investasi awal",
    },
  });

  const meiPengeluaran = [
    { tanggal: "2025-05-16", kategori: "PEMELIHARAAN", jumlah: 187000, keterangan: "BELI PRING 1 IKAT, 2 KAWAT, 1/2 PAKU, 1 TARGEL" },
    { tanggal: "2025-05-17", kategori: "PEMELIHARAAN", jumlah: 50000, keterangan: "2 KAWAT 16, 1/4 PAKU" },
    { tanggal: "2025-05-19", kategori: "PEMELIHARAAN", jumlah: 150000, keterangan: "PRING PANJANG DAN PENDEK 1 IKET" },
    { tanggal: "2025-05-21", kategori: "PEMELIHARAAN", jumlah: 25000, keterangan: "PAKU 1 KG" },
    { tanggal: "2025-05-24", kategori: "PEMELIHARAAN", jumlah: 45000, keterangan: "2 KAWAT 16" },
    { tanggal: "2025-05-25", kategori: "GAJI", jumlah: 2070000, keterangan: "GAJI PERBAIKAN KANDANG" },
    { tanggal: "2025-05-26", kategori: "PEMELIHARAAN", jumlah: 30000, keterangan: "1 1/2 PAKU" },
    { tanggal: "2025-05-27", kategori: "PEMELIHARAAN", jumlah: 200000, keterangan: "2 IKAT BAMBU" },
    { tanggal: "2025-05-29", kategori: "TRANSPORTASI", jumlah: 500000, keterangan: "BIAYA DL MAGETAN" },
    { tanggal: "2025-05-30", kategori: "PEMELIHARAAN", jumlah: 74000, keterangan: "1 1/2 PAKU, 2 KAWAT 16" },
    { tanggal: "2025-05-31", kategori: "GAJI", jumlah: 1610000, keterangan: "GAJI PERBAIKAN KANDANG" },
  ];

  for (const item of meiPengeluaran) {
    await prisma.pengeluaranOperasional.create({
      data: {
        kandangId: kandang.id,
        tanggal: new Date(item.tanggal),
        kategori: item.kategori,
        jumlah: item.jumlah,
        keterangan: item.keterangan,
      },
    });
  }

  console.log(`✅ Mei: 1 pemasukan, ${meiPengeluaran.length} pengeluaran`);

  // JUNI 2025
  console.log("\n💰 Seeding Juni 2025...");
  
  const juniPemasukan = [
    { tanggal: "2025-06-01", kategori: "MODAL", jumlah: 5000000, keterangan: "Pemasukan investasi" },
    { tanggal: "2025-06-17", kategori: "MODAL", jumlah: 5000000, keterangan: "Pemasukan investasi" },
    { tanggal: "2025-06-19", kategori: "MODAL", jumlah: 40000000, keterangan: "Pemasukan investasi" },
    { tanggal: "2025-06-19", kategori: "MODAL", jumlah: 60000000, keterangan: "Pemasukan investasi" },
  ];

  for (const item of juniPemasukan) {
    await prisma.pemasukan.create({
      data: {
        tanggal: new Date(item.tanggal),
        kategori: item.kategori,
        jumlah: item.jumlah,
        keterangan: item.keterangan,
      },
    });
  }

  const juniPengeluaran = [
    { tanggal: "2025-06-04", kategori: "PEMELIHARAAN", jumlah: 20000, keterangan: "1 Kg PAKU" },
    { tanggal: "2025-06-07", kategori: "PEMELIHARAAN", jumlah: 195000, keterangan: "PRING, PAKU, LEM" },
    { tanggal: "2025-06-07", kategori: "GAJI", jumlah: 1380000, keterangan: "GAJI PERBAIKAN KANDANG" },
    { tanggal: "2025-06-10", kategori: "PEMELIHARAAN", jumlah: 45000, keterangan: "2 KAWAT 16" },
    { tanggal: "2025-06-12", kategori: "PEMELIHARAAN", jumlah: 45000, keterangan: "2 KAWAT 16" },
    { tanggal: "2025-06-14", kategori: "GAJI", jumlah: 1495000, keterangan: "GAJI PERBAIKAN KANDANG" },
    { tanggal: "2025-06-16", kategori: "PEMELIHARAAN", jumlah: 32000, keterangan: "LEM TANGIT, 1/2 PAKU, PAKU" },
    { tanggal: "2025-06-17", kategori: "PERALATAN", jumlah: 3185000, keterangan: "PEMBELIAN 53 TALANG & 10 BLABAK" },
    { tanggal: "2025-06-19", kategori: "KESEHATAN", jumlah: 175000, keterangan: "3 KG KUNIR, 1 KG JAHE, 1 KG TEMU, CONTAINER" },
    { tanggal: "2025-06-19", kategori: "PEMELIHARAAN", jumlah: 65500, keterangan: "2 PRALON, 1 LEM, 1/4 PAKU, KABEL 1 ROL" },
    { tanggal: "2025-06-19", kategori: "PEMELIHARAAN", jumlah: 471000, keterangan: "5 FITTING GANTUNG, 12 LED PHILIPS 4 WHAT" },
    { tanggal: "2025-06-19", kategori: "KESEHATAN", jumlah: 23000, keterangan: "GULA MERAH 1 KG" },
    { tanggal: "2025-06-19", kategori: "ADMINISTRASI", jumlah: 8000, keterangan: "Admin Bank" },
    { tanggal: "2025-06-20", kategori: "PEMELIHARAAN", jumlah: 350000, keterangan: "1 PICKUP PASIR" },
    { tanggal: "2025-06-20", kategori: "PEMELIHARAAN", jumlah: 35000, keterangan: "4 WATER MOOR, 1/4 PAKU" },
    { tanggal: "2025-06-20", kategori: "KESEHATAN", jumlah: 3131500, keterangan: "5 KONSENTRAT, 2 PARDOC, 2 VITA STRESS, 2 EGG STIMULAN" },
    { tanggal: "2025-06-20", kategori: "KESEHATAN", jumlah: 191000, keterangan: "1 NEOMEDITIL, 1 GLUTAMAS" },
    { tanggal: "2025-06-20", kategori: "PEMELIHARAAN", jumlah: 110000, keterangan: "2 SAK SEMEN" },
    { tanggal: "2025-06-21", kategori: "GAJI", jumlah: 1610000, keterangan: "BAYAR TUKANG" },
    { tanggal: "2025-06-21", kategori: "AYAM", jumlah: 85700000, keterangan: "BAYAR AYAM PULLET 16 MINGGU 997 EKOR" },
    { tanggal: "2025-06-21", kategori: "PEMELIHARAAN", jumlah: 218000, keterangan: "1LEM TANGIT, SELOTIP, UPAH TENAGA AYAM 2 ORANG" },
    { tanggal: "2025-06-21", kategori: "PERALATAN", jumlah: 262000, keterangan: "KOPI,SNACK, 2 KNEE, 1 FITTINGAN, TIMBA JAMU, PANCI" },
    { tanggal: "2025-06-21", kategori: "PEMELIHARAAN", jumlah: 72000, keterangan: "2 STOPKRAN, 4 SCOK KRAN, 4 KASE, 6 TUTUP PIPA" },
    { tanggal: "2025-06-23", kategori: "TRANSPORTASI", jumlah: 250000, keterangan: "TRANSPORT MAGETAN" },
    { tanggal: "2025-06-23", kategori: "PEMELIHARAAN", jumlah: 30000, keterangan: "1LEM, 1 STOP KRAN" },
    { tanggal: "2025-06-24", kategori: "PERALATAN", jumlah: 1350000, keterangan: "BELI HP A06, KARTU PERDANA, TEMPERGLAS" },
    { tanggal: "2025-06-25", kategori: "ADMINISTRASI", jumlah: 101000, keterangan: "BUKA REKENING BANK BRI BARU" },
    { tanggal: "2025-06-26", kategori: "PEMELIHARAAN", jumlah: 110000, keterangan: "2 SAK SEMEN" },
    { tanggal: "2025-06-26", kategori: "KESEHATAN", jumlah: 160000, keterangan: "TRYMEZEYN, NEOMEDITRIL, EM4 TERNAK 1 LITER" },
    { tanggal: "2025-06-28", kategori: "GAJI", jumlah: 805000, keterangan: "BAYAR TUKANG" },
    { tanggal: "2025-06-29", kategori: "KESEHATAN", jumlah: 10000, keterangan: "TEMULAWAK 1 KG" },
    { tanggal: "2025-06-29", kategori: "UTILITAS", jumlah: 22000, keterangan: "GAS" },
    { tanggal: "2025-06-29", kategori: "ADMINISTRASI", jumlah: 750, keterangan: "BIAYA SMS" },
  ];

  for (const item of juniPengeluaran) {
    await prisma.pengeluaranOperasional.create({
      data: {
        kandangId: kandang.id,
        tanggal: new Date(item.tanggal),
        kategori: item.kategori,
        jumlah: item.jumlah,
        keterangan: item.keterangan,
      },
    });
  }

  console.log(`✅ Juni: ${juniPemasukan.length} pemasukan, ${juniPengeluaran.length} pengeluaran`);

  // JULI 2025
  console.log("\n💰 Seeding Juli 2025...");
  
  const juliPemasukan = [
    { tanggal: "2025-07-07", kategori: "MODAL", jumlah: 10000000, keterangan: "Pemasukan investasi" },
    { tanggal: "2025-07-09", kategori: "MODAL", jumlah: 5000000, keterangan: "Pemasukan investasi" },
    { tanggal: "2025-07-20", kategori: "MODAL", jumlah: 5000000, keterangan: "Pemasukan investasi" },
  ];

  for (const item of juliPemasukan) {
    await prisma.pemasukan.create({
      data: {
        tanggal: new Date(item.tanggal),
        kategori: item.kategori,
        jumlah: item.jumlah,
        keterangan: item.keterangan,
      },
    });
  }

  const juliPengeluaran = [
    { tanggal: "2025-07-01", kategori: "KESEHATAN", jumlah: 2394000, keterangan: "KONSENTRAT 5, NEOMEDITRIL 1 LITER" },
    { tanggal: "2025-07-01", kategori: "ADMINISTRASI", jumlah: 2250, keterangan: "BIAYA SMS" },
    { tanggal: "2025-07-05", kategori: "ADMINISTRASI", jumlah: 750, keterangan: "BIAYA SMS" },
    { tanggal: "2025-07-08", kategori: "KESEHATAN", jumlah: 222000, keterangan: "TYMIZIN 3 BUNGKUS @74000" },
    { tanggal: "2025-07-09", kategori: "ADMINISTRASI", jumlah: 750, keterangan: "BIAYA SMS" },
    { tanggal: "2025-07-13", kategori: "ADMINISTRASI", jumlah: 2250, keterangan: "BIAYA SMS" },
    { tanggal: "2025-07-16", kategori: "ADMINISTRASI", jumlah: 5500, keterangan: "ADMIN FEE" },
    { tanggal: "2025-07-16", kategori: "ADMINISTRASI", jumlah: 2500, keterangan: "MONTHLY FEE ATM" },
    { tanggal: "2025-07-16", kategori: "KESEHATAN", jumlah: 92000, keterangan: "VITAMIN E 4 BUNGKUS @23000" },
    { tanggal: "2025-07-17", kategori: "ADMINISTRASI", jumlah: 750, keterangan: "BIAYA NOTIFIKASI SMS" },
    { tanggal: "2025-07-20", kategori: "GAJI", jumlah: 1400000, keterangan: "GAJI DAN UANG MAKAN 1 BULAN" },
    { tanggal: "2025-07-20", kategori: "UTILITAS", jumlah: 100000, keterangan: "LISTRIK DAN AIR" },
    { tanggal: "2025-07-24", kategori: "KESEHATAN", jumlah: 412000, keterangan: "VAKSIN + VITA STRESS" },
    { tanggal: "2025-07-24", kategori: "PERALATAN", jumlah: 18000, keterangan: "KOTAK TELUR 3" },
    { tanggal: "2025-07-24", kategori: "GAJI", jumlah: 50000, keterangan: "ONGKOS VAKSIN" },
    { tanggal: "2025-07-25", kategori: "ADMINISTRASI", jumlah: 2250, keterangan: "BIAYA SMS" },
    { tanggal: "2025-07-29", kategori: "ADMINISTRASI", jumlah: 750, keterangan: "BIAYA SMS" },
    { tanggal: "2025-07-30", kategori: "KESEHATAN", jumlah: 222000, keterangan: "3 TRYMICIN SERBUK" },
  ];

  for (const item of juliPengeluaran) {
    await prisma.pengeluaranOperasional.create({
      data: {
        kandangId: kandang.id,
        tanggal: new Date(item.tanggal),
        kategori: item.kategori,
        jumlah: item.jumlah,
        keterangan: item.keterangan,
      },
    });
  }

  console.log(`✅ Juli: ${juliPemasukan.length} pemasukan, ${juliPengeluaran.length} pengeluaran`);

  // AGUSTUS 2025
  console.log("\n💰 Seeding Agustus 2025...");
  
  const agustusPemasukan = [
    { tanggal: "2025-08-05", kategori: "MODAL", jumlah: 5000000, keterangan: "Pemasukan investasi" },
    { tanggal: "2025-08-14", kategori: "MODAL", jumlah: 10000000, keterangan: "Pemasukan investasi" },
    { tanggal: "2025-08-20", kategori: "MODAL", jumlah: 5000000, keterangan: "Pemasukan investasi" },
  ];

  for (const item of agustusPemasukan) {
    await prisma.pemasukan.create({
      data: {
        tanggal: new Date(item.tanggal),
        kategori: item.kategori,
        jumlah: item.jumlah,
        keterangan: item.keterangan,
      },
    });
  }

  const agustusPengeluaran = [
    { tanggal: "2025-08-01", kategori: "ADMINISTRASI", jumlah: 750, keterangan: "BIAYA SMS" },
    { tanggal: "2025-08-05", kategori: "ADMINISTRASI", jumlah: 23000, keterangan: "PEMBELIAN PAKET DATA" },
    { tanggal: "2025-08-05", kategori: "ADMINISTRASI", jumlah: 750, keterangan: "BIAYA SMS" },
    { tanggal: "2025-08-06", kategori: "KESEHATAN", jumlah: 54000, keterangan: "JAMU AYAM. JAHE, KUNIR, TEMULAWAK" },
    { tanggal: "2025-08-09", kategori: "ADMINISTRASI", jumlah: 750, keterangan: "BIAYA SMS" },
    { tanggal: "2025-08-16", kategori: "ADMINISTRASI", jumlah: 5500, keterangan: "ADMIN ADMINISTRASI" },
    { tanggal: "2025-08-16", kategori: "ADMINISTRASI", jumlah: 2500, keterangan: "BIAYA BULANAN ATM" },
    { tanggal: "2025-08-16", kategori: "KESEHATAN", jumlah: 417000, keterangan: "OBAT CACING LEVAMID @142000, OBAT GUREM DIMETRIN@275000" },
    { tanggal: "2025-08-17", kategori: "ADMINISTRASI", jumlah: 3750, keterangan: "BIAYA SMS" },
    { tanggal: "2025-08-20", kategori: "GAJI", jumlah: 1400000, keterangan: "GAJI DAN UANG MAKAN 1 BULAN" },
    { tanggal: "2025-08-20", kategori: "UTILITAS", jumlah: 100000, keterangan: "LISTRIK DAN AIR" },
    { tanggal: "2025-08-21", kategori: "PERALATAN", jumlah: 24000, keterangan: "BELI KOTAK TELUR 4 @6000" },
    { tanggal: "2025-08-21", kategori: "ADMINISTRASI", jumlah: 750, keterangan: "BIAYA SMS" },
    { tanggal: "2025-08-22", kategori: "KESEHATAN", jumlah: 432000, keterangan: "OBAT FLU INJEK 4 BOTOL DOSIS 0,4 ml" },
    { tanggal: "2025-08-22", kategori: "GAJI", jumlah: 50000, keterangan: "BIAYA SUNTIK AYAM" },
    { tanggal: "2025-08-25", kategori: "ADMINISTRASI", jumlah: 2250, keterangan: "BIAYA SMS" },
    { tanggal: "2025-08-29", kategori: "KESEHATAN", jumlah: 208000, keterangan: "VAKSIN ND IB LIVE 1000, BIAYA VAKSIN, JAMU, KOTAK TELUR, VITASTRES" },
    { tanggal: "2025-08-31", kategori: "ADMINISTRASI", jumlah: 35000, keterangan: "BIAYA TRANSFER UANG TELUR @5000*7" },
  ];

  for (const item of agustusPengeluaran) {
    await prisma.pengeluaranOperasional.create({
      data: {
        kandangId: kandang.id,
        tanggal: new Date(item.tanggal),
        kategori: item.kategori,
        jumlah: item.jumlah,
        keterangan: item.keterangan,
      },
    });
  }

  console.log(`✅ Agustus: ${agustusPemasukan.length} pemasukan, ${agustusPengeluaran.length} pengeluaran`);

  // SEPTEMBER 2025
  console.log("\n💰 Seeding September 2025...");
  
  const septemberPemasukan = [
    { tanggal: "2025-09-08", kategori: "MODAL", jumlah: 5000000, keterangan: "Investasi 2" },
    { tanggal: "2025-09-08", kategori: "LAIN-LAIN", jumlah: 3000000, keterangan: "Pemasukan" },
    { tanggal: "2025-09-13", kategori: "LAIN-LAIN", jumlah: 10000000, keterangan: "Pemasukan dari rekening telur" },
    { tanggal: "2025-09-14", kategori: "LAIN-LAIN", jumlah: 3000000, keterangan: "Pemasukan dari rekening telur" },
    { tanggal: "2025-09-19", kategori: "LAIN-LAIN", jumlah: 3000000, keterangan: "Pemasukan dari rekening telur" },
    { tanggal: "2025-09-21", kategori: "MODAL", jumlah: 10000000, keterangan: "Pemasukan investasi" },
    { tanggal: "2025-09-24", kategori: "LAIN-LAIN", jumlah: 4000000, keterangan: "Pemasukan dari rekening telur" },
    { tanggal: "2025-09-26", kategori: "MODAL", jumlah: 10000000, keterangan: "Pemasukan investasi" },
    { tanggal: "2025-09-26", kategori: "LAIN-LAIN", jumlah: 165000, keterangan: "Pengembalian sisa ops" },
  ];

  for (const item of septemberPemasukan) {
    await prisma.pemasukan.create({
      data: {
        tanggal: new Date(item.tanggal),
        kategori: item.kategori,
        jumlah: item.jumlah,
        keterangan: item.keterangan,
      },
    });
  }

  const septemberPengeluaran = [
    { tanggal: "2025-09-01", kategori: "ADMINISTRASI", jumlah: 750, keterangan: "BIAYA SMS" },
    { tanggal: "2025-09-02", kategori: "UTILITAS", jumlah: 22000, keterangan: "BELI GAS" },
    { tanggal: "2025-09-05", kategori: "ADMINISTRASI", jumlah: 750, keterangan: "BIAYA SMS" },
    { tanggal: "2025-09-08", kategori: "PERALATAN", jumlah: 3500000, keterangan: "MEMBAYAR DP UNTUK BATERAI AYAM 140 BOX" },
    { tanggal: "2025-09-09", kategori: "ADMINISTRASI", jumlah: 750, keterangan: "BIAYA SMS" },
    { tanggal: "2025-09-09", kategori: "TRANSPORTASI", jumlah: 350000, keterangan: "DL MAGETAN + GULA PASIR 5 KG @ 18000" },
    { tanggal: "2025-09-10", kategori: "PERALATAN", jumlah: 200000, keterangan: "BELI EMBER TELUR @20000 *10" },
    { tanggal: "2025-09-12", kategori: "KESEHATAN", jumlah: 76000, keterangan: "VITAMIN STIMULANT EGG 2 @ 38000" },
    { tanggal: "2025-09-13", kategori: "ADMINISTRASI", jumlah: 4500, keterangan: "BIAYA SMS" },
    { tanggal: "2025-09-13", kategori: "ADMINISTRASI", jumlah: 32000, keterangan: "PEMBELIAN PAKET DATA HP INVENTARIS" },
    { tanggal: "2025-09-13", kategori: "ADMINISTRASI", jumlah: 1500, keterangan: "ADMIN FEE" },
    { tanggal: "2025-09-15", kategori: "KESEHATAN", jumlah: 257000, keterangan: "1 GLUTAMAS + CYPERKILLER 2 @72000" },
    { tanggal: "2025-09-15", kategori: "KESEHATAN", jumlah: 232000, keterangan: "CYPERKILLER 1 + VAKSIN EMULSION 500 (NDKILL DIVAKSINKAN RABU TGL 17 SEPTEMBER 2025)" },
    { tanggal: "2025-09-16", kategori: "ADMINISTRASI", jumlah: 6000, keterangan: "ADMIN FEE" },
    { tanggal: "2025-09-16", kategori: "ADMINISTRASI", jumlah: 3000, keterangan: "MONTHLY" },
    { tanggal: "2025-09-17", kategori: "ADMINISTRASI", jumlah: 2250, keterangan: "BIAYA SMS" },
    { tanggal: "2025-09-18", kategori: "KESEHATAN", jumlah: 141000, keterangan: "ONGKOS VAKSIN, KOTAK 4 @6000, JAMU" },
    { tanggal: "2025-09-21", kategori: "ADMINISTRASI", jumlah: 3000, keterangan: "BIAYA SMS" },
    { tanggal: "2025-09-21", kategori: "GAJI", jumlah: 1500000, keterangan: "GAJI BULAN SEPTEMBER +LISTRIK+AIR" },
    { tanggal: "2025-09-21", kategori: "ADMINISTRASI", jumlah: 2500, keterangan: "ADMIN FEE" },
    { tanggal: "2025-09-21", kategori: "PEMELIHARAAN", jumlah: 4134000, keterangan: "SPANDEK, PAKU DLL" },
    { tanggal: "2025-09-24", kategori: "ADMINISTRASI", jumlah: 4500, keterangan: "BIAYA SMS" },
    { tanggal: "2025-09-26", kategori: "PEMELIHARAAN", jumlah: 640000, keterangan: "TALANG GAVALUM 60 M TEBAL 0,3 (4M), 1 SPANDEK 5M + 5 SPANDEK 3M" },
    { tanggal: "2025-09-26", kategori: "LAIN-LAIN", jumlah: 200000, keterangan: "TRANSFER UNTUK OPERASIONAL 200RB - 165RB" },
    { tanggal: "2025-09-26", kategori: "LAIN-LAIN", jumlah: 700000, keterangan: "PINJAM HEPPY 700RB" },
    { tanggal: "2025-09-26", kategori: "PERALATAN", jumlah: 216000, keterangan: "KOPI & JAJAN 6 HARI (SEHARI 2X , UNTUK 3 ORANG )@6000" },
    { tanggal: "2025-09-28", kategori: "GAJI", jumlah: 790000, keterangan: "HONOR PENGGANTI KERJA SELAMA 6 HARI @90.000 +TRANSPORT DL MAGETAN PP" },
    { tanggal: "2025-09-28", kategori: "ADMINISTRASI", jumlah: 1000, keterangan: "BIAYA SMS" },
    { tanggal: "2025-09-29", kategori: "ADMINISTRASI", jumlah: 4500, keterangan: "BIAYA SMS" },
    { tanggal: "2025-09-30", kategori: "KESEHATAN", jumlah: 132000, keterangan: "VITA STRES 2 @25000 + TRANSFER 8 KALI @5000 + PAKU 42000" },
    { tanggal: "2025-09-30", kategori: "PEMELIHARAAN", jumlah: 3741000, keterangan: "HEBEL, SEMEN, PASIR, BESI, BENDRAT, KORAL,BENANG" },
    { tanggal: "2025-09-30", kategori: "ADMINISTRASI", jumlah: 3000, keterangan: "BIAYA SMS" },
  ];

  for (const item of septemberPengeluaran) {
    await prisma.pengeluaranOperasional.create({
      data: {
        kandangId: kandang.id,
        tanggal: new Date(item.tanggal),
        kategori: item.kategori,
        jumlah: item.jumlah,
        keterangan: item.keterangan,
      },
    });
  }

  console.log(`✅ September: ${septemberPemasukan.length} pemasukan, ${septemberPengeluaran.length} pengeluaran`);

  // OKTOBER 2025
  console.log("\n💰 Seeding Oktober 2025...");
  
  const oktoberPemasukan = [
    { tanggal: "2025-10-02", kategori: "LAIN-LAIN", jumlah: 700000, keterangan: "Pengembalian pinjaman" },
    { tanggal: "2025-10-04", kategori: "LAIN-LAIN", jumlah: 4000000, keterangan: "Pemasukan dari rekening telur" },
    { tanggal: "2025-10-05", kategori: "MODAL", jumlah: 15000000, keterangan: "Pemasukan investasi" },
    { tanggal: "2025-10-17", kategori: "LAIN-LAIN", jumlah: 4000000, keterangan: "Pemasukan dari rekening telur" },
    { tanggal: "2025-10-18", kategori: "LAIN-LAIN", jumlah: 7000000, keterangan: "Pemasukan dari rekening telur" },
    { tanggal: "2025-10-20", kategori: "MODAL", jumlah: 10000000, keterangan: "Pemasukan investasi" },
    { tanggal: "2025-10-22", kategori: "LAIN-LAIN", jumlah: 20000000, keterangan: "Pemasukan dari rekening telur" },
    { tanggal: "2025-10-23", kategori: "MODAL", jumlah: 20000000, keterangan: "Pemasukan dana invest 2" },
  ];

  for (const item of oktoberPemasukan) {
    await prisma.pemasukan.create({
      data: {
        tanggal: new Date(item.tanggal),
        kategori: item.kategori,
        jumlah: item.jumlah,
        keterangan: item.keterangan,
      },
    });
  }

  const oktoberPengeluaran = [
    { tanggal: "2025-10-01", kategori: "PEMELIHARAAN", jumlah: 595000, keterangan: "PIPA, TIMBO, TRIPLEK" },
    { tanggal: "2025-10-03", kategori: "KESEHATAN", jumlah: 438000, keterangan: "VAKSIN AI H3N2" },
    { tanggal: "2025-10-04", kategori: "GAJI", jumlah: 2370000, keterangan: "PEMBAYARAN TUKANG, KOPI, SNACK" },
    { tanggal: "2025-10-04", kategori: "PEMELIHARAAN", jumlah: 595000, keterangan: "BELI PASIR SEMEN" },
    { tanggal: "2025-10-05", kategori: "ADMINISTRASI", jumlah: 2250, keterangan: "BIAYA SMS" },
    { tanggal: "2025-10-07", kategori: "PEMELIHARAAN", jumlah: 315000, keterangan: "BESI, SEMEN" },
    { tanggal: "2025-10-07", kategori: "GAJI", jumlah: 1065000, keterangan: "BIAYA TUKANG, KOPI, SNACK + (BIAYA VAKSIN@50000)" },
    { tanggal: "2025-10-08", kategori: "PEMELIHARAAN", jumlah: 2772000, keterangan: "1 PICKUP PASIR, SEMEN, KAWAT, PAKU, TALANG GALVALUM, HOLO, KAWAT" },
    { tanggal: "2025-10-09", kategori: "ADMINISTRASI", jumlah: 4500, keterangan: "BIAYA SMS" },
    { tanggal: "2025-10-10", kategori: "LAIN-LAIN", jumlah: 2000000, keterangan: "PENGAMBILAN CASH / KASBON UNTUK DL MAGETAN" },
    { tanggal: "2025-10-13", kategori: "ADMINISTRASI", jumlah: 4500, keterangan: "BIAYA SMS" },
    { tanggal: "2025-10-16", kategori: "ADMINISTRASI", jumlah: 6000, keterangan: "ADMIN FEE" },
    { tanggal: "2025-10-16", kategori: "ADMINISTRASI", jumlah: 3000, keterangan: "MONTHLY FEE ATM" },
    { tanggal: "2025-10-18", kategori: "PEMELIHARAAN", jumlah: 6024000, keterangan: "BELI BATA, PIPA, BESI, KAWAT, PAKU, PASIR,BENANG PUTIH" },
    { tanggal: "2025-10-19", kategori: "LAIN-LAIN", jumlah: 515000, keterangan: "KASBON KARNO 500 Rb, Untuk tambahan DL magetan @15000" },
    { tanggal: "2025-10-19", kategori: "ADMINISTRASI", jumlah: 1000, keterangan: "BIAYA GOPAY" },
    { tanggal: "2025-10-19", kategori: "PEMELIHARAAN", jumlah: 3000000, keterangan: "BELI USUK PRING" },
    { tanggal: "2025-10-20", kategori: "GAJI", jumlah: 1500000, keterangan: "PEMBAYARAN GAJI, LISTRIK, DAN AIR" },
    { tanggal: "2025-10-21", kategori: "ADMINISTRASI", jumlah: 3000, keterangan: "BIAYA SMS" },
    { tanggal: "2025-10-22", kategori: "ADMINISTRASI", jumlah: 32000, keterangan: "PEMBELIAN PAKET DATA HP INVEST" },
    { tanggal: "2025-10-22", kategori: "ADMINISTRASI", jumlah: 1500, keterangan: "BIAYA PEMBELIAN PULSA" },
    { tanggal: "2025-10-24", kategori: "KESEHATAN", jumlah: 594000, keterangan: "PEMBELIAN VITASTRESS, CERIMOS, DAN BESTRIN FORTE" },
    { tanggal: "2025-10-25", kategori: "ADMINISTRASI", jumlah: 4500, keterangan: "BIAYA SMS" },
    { tanggal: "2025-10-25", kategori: "GAJI", jumlah: 2230000, keterangan: "PEMBAYARAN TUKANG" },
    { tanggal: "2025-10-27", kategori: "KESEHATAN", jumlah: 227000, keterangan: "NEOMEDITRIL 2 DAN OBAT CACING LEVAMID" },
    { tanggal: "2025-10-29", kategori: "ADMINISTRASI", jumlah: 3000, keterangan: "BIAYA SMS" },
    { tanggal: "2025-10-30", kategori: "PEMELIHARAAN", jumlah: 1290000, keterangan: "BELI PASIR, KORAL, KENI, KIKIR DLL" },
  ];

  for (const item of oktoberPengeluaran) {
    await prisma.pengeluaranOperasional.create({
      data: {
        kandangId: kandang.id,
        tanggal: new Date(item.tanggal),
        kategori: item.kategori,
        jumlah: item.jumlah,
        keterangan: item.keterangan,
      },
    });
  }

  console.log(`✅ Oktober: ${oktoberPemasukan.length} pemasukan, ${oktoberPengeluaran.length} pengeluaran`);

  // NOVEMBER 2025
  console.log("\n💰 Seeding November 2025...");
  
  const novemberPemasukan = [
    { tanggal: "2025-11-11", kategori: "LAIN-LAIN", jumlah: 9000000, keterangan: "Pemasukan dari rekening telur" },
    { tanggal: "2025-11-17", kategori: "LAIN-LAIN", jumlah: 3000000, keterangan: "Pemasukan dari rekening telur" },
    { tanggal: "2025-11-24", kategori: "LAIN-LAIN", jumlah: 5000000, keterangan: "Pemasukan dari rekening telur" },
    { tanggal: "2025-11-27", kategori: "LAIN-LAIN", jumlah: 10000000, keterangan: "Pemasukan dari rekening telur" },
  ];

  for (const item of novemberPemasukan) {
    await prisma.pemasukan.create({
      data: {
        tanggal: new Date(item.tanggal),
        kategori: item.kategori,
        jumlah: item.jumlah,
        keterangan: item.keterangan,
      },
    });
  }

  const novemberPengeluaran = [
    { tanggal: "2025-11-01", kategori: "ADMINISTRASI", jumlah: 78000, keterangan: "TRANSFER 6x5 RB, BELI KOTAK 8 x 6 RB" },
    { tanggal: "2025-11-01", kategori: "ADMINISTRASI", jumlah: 1500, keterangan: "BIAYA SMS" },
    { tanggal: "2025-11-01", kategori: "GAJI", jumlah: 2210000, keterangan: "PEMBAYARAN GAJI TUKANG KARNO 6 hr, JOKO 6 hr, GIMAN 5 hr @130000" },
    { tanggal: "2025-11-04", kategori: "UTILITAS", jumlah: 20000, keterangan: "BELI GAS" },
    { tanggal: "2025-11-05", kategori: "ADMINISTRASI", jumlah: 2250, keterangan: "BIAYA SMS" },
    { tanggal: "2025-11-05", kategori: "LAIN-LAIN", jumlah: 202000, keterangan: "KURANGAN BEL GAS, UNTUK MBAH YAT" },
    { tanggal: "2025-11-06", kategori: "PEMELIHARAAN", jumlah: 606000, keterangan: "BELI PASIR, GRESIK" },
    { tanggal: "2025-11-08", kategori: "GAJI", jumlah: 2145000, keterangan: "PEMBAYARAN GAJI TUKANG KARNO 6 hr, JOKO 5 hr, GIMAN 5,5 hr @130000" },
    { tanggal: "2025-11-09", kategori: "ADMINISTRASI", jumlah: 2250, keterangan: "BIAYA SMS" },
    { tanggal: "2025-11-11", kategori: "PEMELIHARAAN", jumlah: 110000, keterangan: "BELI PRING +PAKU" },
    { tanggal: "2025-11-11", kategori: "TRANSPORTASI", jumlah: 855000, keterangan: "DL MAGETAN DAN BELI KAYU" },
    { tanggal: "2025-11-13", kategori: "ADMINISTRASI", jumlah: 750, keterangan: "BIAYA SMS" },
    { tanggal: "2025-11-13", kategori: "PERALATAN", jumlah: 150000, keterangan: "PEMBELIAN BLABAK" },
    { tanggal: "2025-11-14", kategori: "PERALATAN", jumlah: 6845000, keterangan: "72 PRALON PAKAN, 72 OMBEN, 60 SOK TALANG KOTAK, TRILIN, LEM 1 KALENG" },
    { tanggal: "2025-11-15", kategori: "GAJI", jumlah: 2535000, keterangan: "PEMBAYARAN TUKANG 6,5*130 rb *3" },
    { tanggal: "2025-11-16", kategori: "ADMINISTRASI", jumlah: 3000, keterangan: "Monthly Fee ATM" },
    { tanggal: "2025-11-16", kategori: "ADMINISTRASI", jumlah: 6000, keterangan: "Admin Fee" },
    { tanggal: "2025-11-17", kategori: "ADMINISTRASI", jumlah: 3000, keterangan: "BIAYA SMS" },
    { tanggal: "2025-11-17", kategori: "PERALATAN", jumlah: 972000, keterangan: "BELI TIMBANGAN MINI + JAMU AYAM" },
    { tanggal: "2025-11-20", kategori: "GAJI", jumlah: 1500000, keterangan: "PEMBAYARAN GAJI, LISTRIK, DAN AIR" },
    { tanggal: "2025-11-20", kategori: "KESEHATAN", jumlah: 28000, keterangan: "PEMBELIAN OBAT CACING DAN COLERIDIN UNTUK TELEK IJO" },
    { tanggal: "2025-11-21", kategori: "ADMINISTRASI", jumlah: 3000, keterangan: "BIAYA SMS" },
    { tanggal: "2025-11-22", kategori: "GAJI", jumlah: 1630000, keterangan: "PEMBAYARAN GAJI TUKANG KARNO 4 hr BON 200 rb, JOKO 3 hr, GIMAN 4 hr @130000" },
    { tanggal: "2025-11-22", kategori: "PEMELIHARAAN", jumlah: 1359000, keterangan: "PEMBELIAN SPANDEK, SAKLAR, LAMPU LED VISOCOM, PAKU" },
    { tanggal: "2025-11-23", kategori: "PEMELIHARAAN", jumlah: 958000, keterangan: "BELI WAVIN, KENI, STOP KONTAK" },
    { tanggal: "2025-11-25", kategori: "PERALATAN", jumlah: 2000000, keterangan: "PEMBAYARAN BATREY" },
    { tanggal: "2025-11-25", kategori: "ADMINISTRASI", jumlah: 3000, keterangan: "BIAYA SMS" },
    { tanggal: "2025-11-27", kategori: "ADMINISTRASI", jumlah: 36000, keterangan: "PEMBELIAN PULSA HP INVEST" },
    { tanggal: "2025-11-27", kategori: "ADMINISTRASI", jumlah: 1500, keterangan: "BIAYA PEMBELIAN PULSA" },
    { tanggal: "2025-11-28", kategori: "PERALATAN", jumlah: 300000, keterangan: "PEMBELIAN CONTAINER AIR" },
    { tanggal: "2025-11-29", kategori: "GAJI", jumlah: 2465000, keterangan: "PEMBAYARAN GAJI TUKANG KARNO7 hr, GIMAN 7hr, JOKO 6,5 Hari" },
    { tanggal: "2025-11-29", kategori: "ADMINISTRASI", jumlah: 2250, keterangan: "BIAYA SMS" },
    { tanggal: "2025-11-30", kategori: "PEMELIHARAAN", jumlah: 423000, keterangan: "BELI USUK, ENGSEL, GRENDEL, GEMBOK, GENDENG KOCO" },
    { tanggal: "2025-11-30", kategori: "PEMELIHARAAN", jumlah: 1640000, keterangan: "TANDON, GENDENG KOCO, BESI, KABEL, SPANDEK" },
  ];

  for (const item of novemberPengeluaran) {
    await prisma.pengeluaranOperasional.create({
      data: {
        kandangId: kandang.id,
        tanggal: new Date(item.tanggal),
        kategori: item.kategori,
        jumlah: item.jumlah,
        keterangan: item.keterangan,
      },
    });
  }

  console.log(`✅ November: ${novemberPemasukan.length} pemasukan, ${novemberPengeluaran.length} pengeluaran`);

  // DESEMBER 2025
  console.log("\n💰 Seeding Desember 2025...");
  
  const desemberPemasukan = [
    { tanggal: "2025-12-02", kategori: "LAIN-LAIN", jumlah: 5000000, keterangan: "Pemasukan dari rekening telur" },
  ];

  for (const item of desemberPemasukan) {
    await prisma.pemasukan.create({
      data: {
        tanggal: new Date(item.tanggal),
        kategori: item.kategori,
        jumlah: item.jumlah,
        keterangan: item.keterangan,
      },
    });
  }

  const desemberPengeluaran = [
    { tanggal: "2025-12-01", kategori: "ADMINISTRASI", jumlah: 107000, keterangan: "TRANSFER UANG TELUR 7 KALI @5000 DAN JAMU @72000" },
    { tanggal: "2025-12-01", kategori: "PEMELIHARAAN", jumlah: 540000, keterangan: "BELI USUK DAN WILAH" },
    { tanggal: "2025-12-01", kategori: "ADMINISTRASI", jumlah: 8250, keterangan: "BIAYA SMS" },
  ];

  for (const item of desemberPengeluaran) {
    await prisma.pengeluaranOperasional.create({
      data: {
        kandangId: kandang.id,
        tanggal: new Date(item.tanggal),
        kategori: item.kategori,
        jumlah: item.jumlah,
        keterangan: item.keterangan,
      },
    });
  }

  console.log(`✅ Desember: ${desemberPemasukan.length} pemasukan, ${desemberPengeluaran.length} pengeluaran`);

  console.log("\n✅ Seeding keuangan selesai!");
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
