import "dotenv/config";
import { prisma } from "../../app/api/db/prisma";

async function main() {
  console.log("🌱 Seeding Penjualan Telur Juli - Desember 2025...");

  const kandang = await prisma.kandang.findFirst({
    where: { kode: "KDG1" },
  });

  if (!kandang) {
    throw new Error("Kandang KDG1 not found");
  }

  let nomorTransaksi = 1;
  let saldoAkhir = 50000; // Saldo awal Juli

  // JULI 2025
  const juliData = [
    { tanggal: "2025-07-20", pembeli: "HEPPY", kg: 4.6, hargaPerKg: 24400, butir: 92 },
    { tanggal: "2025-07-20", pembeli: "MBAH YAT", kg: 2.5, hargaPerKg: 26000, butir: 50 },
    { tanggal: "2025-07-20", pembeli: "HARNO", kg: 2.2, hargaPerKg: 24400, butir: 44 },
    { tanggal: "2025-07-28", pembeli: "MONOT", kg: 15, hargaPerKg: 23500, butir: 300 },
    { tanggal: "2025-07-28", pembeli: "HARNO", kg: 3, hargaPerKg: 24000, butir: 60 },
  ];

  console.log("\n🥚 Seeding Penjualan Telur Juli 2025...");
  for (const item of juliData) {
    const totalHarga = item.kg * item.hargaPerKg;
    const saldoAwal = saldoAkhir;
    saldoAkhir = saldoAwal + totalHarga;

    await prisma.penjualanTelur.create({
      data: {
        kandangId: kandang.id,
        nomorTransaksi: `TRX-${String(nomorTransaksi).padStart(6, "0")}`,
        tanggal: new Date(item.tanggal),
        pembeli: item.pembeli,
        jumlahButir: item.butir,
        beratKg: item.kg,
        hargaPerKg: item.hargaPerKg,
        totalHarga: totalHarga,
        saldoAwal: saldoAwal,
        uangMasuk: totalHarga,
        uangKeluar: 0,
        saldoAkhir: saldoAkhir,
        metodeBayar: "TUNAI",
      },
    });
    nomorTransaksi++;
  }

  // AGUSTUS 2025
  const agustusData = [
    { tanggal: "2025-08-01", pembeli: "MONOT", kg: 15, hargaPerKg: 23700, butir: 300 },
    { tanggal: "2025-08-05", pembeli: "MONOT", kg: 30, hargaPerKg: 24200, butir: 600 },
    { tanggal: "2025-08-08", pembeli: "MONOT", kg: 30, hargaPerKg: 23500, butir: 600 },
    { tanggal: "2025-08-08", pembeli: "MONOT", kg: 5, hargaPerKg: 23300, butir: 100 },
    { tanggal: "2025-08-11", pembeli: "MONOT", kg: 15, hargaPerKg: 23500, butir: 300 },
    { tanggal: "2025-08-11", pembeli: "MONOT", kg: 15, hargaPerKg: 23500, butir: 300 },
    { tanggal: "2025-08-13", pembeli: "MONOT", kg: 15, hargaPerKg: 23000, butir: 300 },
    { tanggal: "2025-08-15", pembeli: "MONOT", kg: 15, hargaPerKg: 22800, butir: 300 },
    { tanggal: "2025-08-16", pembeli: "MONOT", kg: 15, hargaPerKg: 22800, butir: 300 },
    { tanggal: "2025-08-17", pembeli: "MONOT", kg: 30, hargaPerKg: 22800, butir: 600 },
    { tanggal: "2025-08-19", pembeli: "HARNO", kg: 7, hargaPerKg: 22200, butir: 140 },
    { tanggal: "2025-08-24", pembeli: "GISMA", kg: 165, hargaPerKg: 22500, butir: 3300 },
    { tanggal: "2025-08-21", pembeli: "MONOT", kg: 15, hargaPerKg: 22000, butir: 300 },
    { tanggal: "2025-08-22", pembeli: "MONOT", kg: 15, hargaPerKg: 22000, butir: 300 },
    { tanggal: "2025-08-25", pembeli: "MONOT", kg: 15, hargaPerKg: 22500, butir: 300 },
    { tanggal: "2025-08-27", pembeli: "MONOT", kg: 5, hargaPerKg: 22500, butir: 100 },
    { tanggal: "2025-08-28", pembeli: "MONOT", kg: 5, hargaPerKg: 22000, butir: 100 },
    { tanggal: "2025-08-30", pembeli: "MONOT", kg: 5, hargaPerKg: 22000, butir: 100 },
    { tanggal: "2025-08-30", pembeli: "GISMA", kg: 210, hargaPerKg: 22300, butir: 4200 },
  ];

  console.log("\n🥚 Seeding Penjualan Telur Agustus 2025...");
  for (const item of agustusData) {
    const totalHarga = item.kg * item.hargaPerKg;
    const saldoAwal = saldoAkhir;
    saldoAkhir = saldoAwal + totalHarga;

    await prisma.penjualanTelur.create({
      data: {
        kandangId: kandang.id,
        nomorTransaksi: `TRX-${String(nomorTransaksi).padStart(6, "0")}`,
        tanggal: new Date(item.tanggal),
        pembeli: item.pembeli,
        jumlahButir: item.butir,
        beratKg: item.kg,
        hargaPerKg: item.hargaPerKg,
        totalHarga: totalHarga,
        saldoAwal: saldoAwal,
        uangMasuk: totalHarga,
        uangKeluar: 0,
        saldoAkhir: saldoAkhir,
        metodeBayar: "TUNAI",
      },
    });
    nomorTransaksi++;
  }

  // SEPTEMBER 2025
  const septemberData = [
    { tanggal: "2025-09-01", pembeli: "MONOT", kg: 5, hargaPerKg: 22300, butir: 100 },
    { tanggal: "2025-09-02", pembeli: "MONOT", kg: 15, hargaPerKg: 22300, butir: 300 },
    { tanggal: "2025-09-04", pembeli: "MONOT", kg: 15, hargaPerKg: 22300, butir: 300 },
    { tanggal: "2025-09-05", pembeli: "MONOT", kg: 15, hargaPerKg: 22500, butir: 300 },
    { tanggal: "2025-09-08", pembeli: "GISMA", kg: 225, hargaPerKg: 23600, butir: 4500 },
    { tanggal: "2025-09-12", pembeli: "MONOT", kg: 15, hargaPerKg: 24700, butir: 300 },
    { tanggal: "2025-09-12", pembeli: "MONOT", kg: 15, hargaPerKg: 23600, butir: 300 },
    { tanggal: "2025-09-15", pembeli: "GISMA", kg: 260, hargaPerKg: 23800, butir: 5200 },
    { tanggal: "2025-09-15", pembeli: "MONOT", kg: 15, hargaPerKg: 24700, butir: 300 },
    { tanggal: "2025-09-15", pembeli: "MONOT", kg: 15, hargaPerKg: 24500, butir: 300 },
    { tanggal: "2025-09-19", pembeli: "MONOT", kg: 15, hargaPerKg: 23800, butir: 300 },
    { tanggal: "2025-09-19", pembeli: "MONOT", kg: 15, hargaPerKg: 24400, butir: 300 },
    { tanggal: "2025-09-19", pembeli: "MONOT", kg: 15, hargaPerKg: 24400, butir: 300 },
    { tanggal: "2025-09-22", pembeli: "GISMA", kg: 300, hargaPerKg: 24700, butir: 6000 },
    { tanggal: "2025-09-22", pembeli: "MONOT", kg: 15, hargaPerKg: 24400, butir: 300 },
    { tanggal: "2025-09-25", pembeli: "MONOT", kg: 15, hargaPerKg: 24700, butir: 300 },
    { tanggal: "2025-09-25", pembeli: "MONOT", kg: 15, hargaPerKg: 24500, butir: 300 },
    { tanggal: "2025-09-25", pembeli: "MONOT", kg: 15, hargaPerKg: 24500, butir: 300 },
    { tanggal: "2025-09-30", pembeli: "GISMA", kg: 240, hargaPerKg: 25000, butir: 4800 },
    { tanggal: "2025-09-30", pembeli: "HARNO", kg: 15, hargaPerKg: 25000, butir: 300 },
    { tanggal: "2025-09-30", pembeli: "MONOT", kg: 15, hargaPerKg: 24500, butir: 300 },
    { tanggal: "2025-09-30", pembeli: "LASTRI", kg: 45, hargaPerKg: 25000, butir: 900 },
  ];

  console.log("\n🥚 Seeding Penjualan Telur September 2025...");
  for (const item of septemberData) {
    const totalHarga = item.kg * item.hargaPerKg;
    const saldoAwal = saldoAkhir;
    saldoAkhir = saldoAwal + totalHarga;

    await prisma.penjualanTelur.create({
      data: {
        kandangId: kandang.id,
        nomorTransaksi: `TRX-${String(nomorTransaksi).padStart(6, "0")}`,
        tanggal: new Date(item.tanggal),
        pembeli: item.pembeli,
        jumlahButir: item.butir,
        beratKg: item.kg,
        hargaPerKg: item.hargaPerKg,
        totalHarga: totalHarga,
        saldoAwal: saldoAwal,
        uangMasuk: totalHarga,
        uangKeluar: 0,
        saldoAkhir: saldoAkhir,
        metodeBayar: "TUNAI",
      },
    });
    nomorTransaksi++;
  }

  // OKTOBER 2025
  const oktoberData = [
    { tanggal: "2025-10-06", pembeli: "GISMA", kg: 240, hargaPerKg: 25500, butir: 4800 },
    { tanggal: "2025-10-12", pembeli: "GISMA", kg: 8, hargaPerKg: 25500, butir: 160 },
    { tanggal: "2025-10-12", pembeli: "LASTRI", kg: 75, hargaPerKg: 25000, butir: 1500 },
    { tanggal: "2025-10-12", pembeli: "GISMA", kg: 225, hargaPerKg: 26200, butir: 4500 },
    { tanggal: "2025-10-12", pembeli: "GISMA", kg: 3, hargaPerKg: 26200, butir: 60 },
    { tanggal: "2025-10-13", pembeli: "MONOT", kg: 15, hargaPerKg: 25000, butir: 300 },
    { tanggal: "2025-10-13", pembeli: "MONOT", kg: 15, hargaPerKg: 25500, butir: 300 },
    { tanggal: "2025-10-13", pembeli: "MONOT", kg: 30, hargaPerKg: 26200, butir: 600 },
    { tanggal: "2025-10-13", pembeli: "MONOT", kg: 15, hargaPerKg: 26600, butir: 300 },
    { tanggal: "2025-10-13", pembeli: "MONOT", kg: 15, hargaPerKg: 26600, butir: 300 },
    { tanggal: "2025-10-13", pembeli: "MONOT", kg: 15, hargaPerKg: 26600, butir: 300 },
    { tanggal: "2025-10-17", pembeli: "MONOT", kg: 15, hargaPerKg: 26200, butir: 300 },
    { tanggal: "2025-10-17", pembeli: "MONOT", kg: 15, hargaPerKg: 26200, butir: 300 },
    { tanggal: "2025-10-17", pembeli: "MONOT", kg: 15, hargaPerKg: 26200, butir: 300 },
    { tanggal: "2025-10-17", pembeli: "MONOT", kg: 15, hargaPerKg: 26600, butir: 300 },
    { tanggal: "2025-10-17", pembeli: "MONOT", kg: 15, hargaPerKg: 26600, butir: 300 },
    { tanggal: "2025-10-19", pembeli: "GISMA", kg: 255, hargaPerKg: 26700, butir: 5100 },
    { tanggal: "2025-10-22", pembeli: "MONOT", kg: 15, hargaPerKg: 26600, butir: 300 },
    { tanggal: "2025-10-22", pembeli: "MONOT", kg: 15, hargaPerKg: 26600, butir: 300 },
    { tanggal: "2025-10-22", pembeli: "MONOT", kg: 15, hargaPerKg: 26600, butir: 300 },
    { tanggal: "2025-10-22", pembeli: "MONOT", kg: 15, hargaPerKg: 26600, butir: 300 },
    { tanggal: "2025-10-25", pembeli: "GISMA", kg: 270, hargaPerKg: 25300, butir: 5400 },
    { tanggal: "2025-10-29", pembeli: "MONOT", kg: 15, hargaPerKg: 26600, butir: 300 },
    { tanggal: "2025-10-29", pembeli: "MONOT", kg: 15, hargaPerKg: 26400, butir: 300 },
    { tanggal: "2025-10-29", pembeli: "MONOT", kg: 15, hargaPerKg: 25800, butir: 300 },
  ];

  console.log("\n🥚 Seeding Penjualan Telur Oktober 2025...");
  for (const item of oktoberData) {
    const totalHarga = item.kg * item.hargaPerKg;
    const saldoAwal = saldoAkhir;
    saldoAkhir = saldoAwal + totalHarga;

    await prisma.penjualanTelur.create({
      data: {
        kandangId: kandang.id,
        nomorTransaksi: `TRX-${String(nomorTransaksi).padStart(6, "0")}`,
        tanggal: new Date(item.tanggal),
        pembeli: item.pembeli,
        jumlahButir: item.butir,
        beratKg: item.kg,
        hargaPerKg: item.hargaPerKg,
        totalHarga: totalHarga,
        saldoAwal: saldoAwal,
        uangMasuk: totalHarga,
        uangKeluar: 0,
        saldoAkhir: saldoAkhir,
        metodeBayar: "TUNAI",
      },
    });
    nomorTransaksi++;
  }

  // NOVEMBER 2025
  const novemberData = [
    { tanggal: "2025-11-03", pembeli: "GISMA", kg: 255, hargaPerKg: 25500, butir: 5100 },
    { tanggal: "2025-11-03", pembeli: "GISMA", kg: 3, hargaPerKg: 25500, butir: 60 },
    { tanggal: "2025-11-04", pembeli: "MONOT", kg: 15, hargaPerKg: 25600, butir: 300 },
    { tanggal: "2025-11-04", pembeli: "MONOT", kg: 15, hargaPerKg: 25300, butir: 300 },
    { tanggal: "2025-11-04", pembeli: "MONOT", kg: 15, hargaPerKg: 25300, butir: 300 },
    { tanggal: "2025-11-04", pembeli: "MONOT", kg: 15, hargaPerKg: 25000, butir: 300 },
    { tanggal: "2025-11-04", pembeli: "MONOT", kg: 15, hargaPerKg: 24400, butir: 300 },
    { tanggal: "2025-11-04", pembeli: "MONOT", kg: 15, hargaPerKg: 24200, butir: 300 },
    { tanggal: "2025-11-04", pembeli: "MONOT", kg: 15, hargaPerKg: 25000, butir: 300 },
    { tanggal: "2025-11-08", pembeli: "MONOT", kg: 15, hargaPerKg: 25200, butir: 300 },
    { tanggal: "2025-11-08", pembeli: "MONOT", kg: 15, hargaPerKg: 25200, butir: 300 },
    { tanggal: "2025-11-08", pembeli: "MONOT", kg: 30, hargaPerKg: 25200, butir: 600 },
    { tanggal: "2025-11-08", pembeli: "MONOT", kg: 15, hargaPerKg: 25200, butir: 300 },
    { tanggal: "2025-11-10", pembeli: "GISMA", kg: 255, hargaPerKg: 25200, butir: 5100 },
    { tanggal: "2025-11-16", pembeli: "MONOT", kg: 15, hargaPerKg: 24800, butir: 300 },
    { tanggal: "2025-11-16", pembeli: "MONOT", kg: 15, hargaPerKg: 24800, butir: 300 },
    { tanggal: "2025-11-16", pembeli: "MONOT", kg: 15, hargaPerKg: 25200, butir: 300 },
    { tanggal: "2025-11-16", pembeli: "MONOT", kg: 15, hargaPerKg: 25200, butir: 300 },
    { tanggal: "2025-11-16", pembeli: "MONOT", kg: 15, hargaPerKg: 25200, butir: 300 },
    { tanggal: "2025-11-16", pembeli: "MONOT", kg: 15, hargaPerKg: 25200, butir: 300 },
    { tanggal: "2025-11-17", pembeli: "GISMA", kg: 255, hargaPerKg: 25400, butir: 5100 },
    { tanggal: "2025-11-21", pembeli: "MONOT", kg: 15, hargaPerKg: 25200, butir: 300 },
    { tanggal: "2025-11-21", pembeli: "MONOT", kg: 15, hargaPerKg: 25200, butir: 300 },
    { tanggal: "2025-11-21", pembeli: "MONOT", kg: 15, hargaPerKg: 25400, butir: 300 },
    { tanggal: "2025-11-21", pembeli: "MONOT", kg: 15, hargaPerKg: 25400, butir: 300 },
    { tanggal: "2025-11-24", pembeli: "GISMA", kg: 285, hargaPerKg: 25000, butir: 5700 },
  ];

  console.log("\n🥚 Seeding Penjualan Telur November 2025...");
  for (const item of novemberData) {
    const totalHarga = item.kg * item.hargaPerKg;
    const saldoAwal = saldoAkhir;
    saldoAkhir = saldoAwal + totalHarga;

    await prisma.penjualanTelur.create({
      data: {
        kandangId: kandang.id,
        nomorTransaksi: `TRX-${String(nomorTransaksi).padStart(6, "0")}`,
        tanggal: new Date(item.tanggal),
        pembeli: item.pembeli,
        jumlahButir: item.butir,
        beratKg: item.kg,
        hargaPerKg: item.hargaPerKg,
        totalHarga: totalHarga,
        saldoAwal: saldoAwal,
        uangMasuk: totalHarga,
        uangKeluar: 0,
        saldoAkhir: saldoAkhir,
        metodeBayar: "TUNAI",
      },
    });
    nomorTransaksi++;
  }

  // DESEMBER 2025
  const desemberData = [
    { tanggal: "2025-12-01", pembeli: "MONOT", kg: 15, hargaPerKg: 25400, butir: 300 },
    { tanggal: "2025-12-01", pembeli: "MONOT", kg: 15, hargaPerKg: 24800, butir: 300 },
    { tanggal: "2025-12-01", pembeli: "MONOT", kg: 15, hargaPerKg: 24800, butir: 300 },
    { tanggal: "2025-12-01", pembeli: "MONOT", kg: 15, hargaPerKg: 24800, butir: 300 },
    { tanggal: "2025-12-01", pembeli: "MONOT", kg: 15, hargaPerKg: 24800, butir: 300 },
    { tanggal: "2025-12-01", pembeli: "MONOT", kg: 15, hargaPerKg: 25000, butir: 300 },
    { tanggal: "2025-12-01", pembeli: "MONOT", kg: 15, hargaPerKg: 25000, butir: 300 },
    { tanggal: "2025-12-02", pembeli: "GISMA", kg: 285, hargaPerKg: 25000, butir: 5700 },
    { tanggal: "2025-12-03", pembeli: "MONOT", kg: 15, hargaPerKg: 24800, butir: 300 },
    { tanggal: "2025-12-03", pembeli: "MONOT", kg: 15, hargaPerKg: 24800, butir: 300 },
    { tanggal: "2025-12-03", pembeli: "MONOT", kg: 15, hargaPerKg: 24800, butir: 300 },
    { tanggal: "2025-12-03", pembeli: "MONOT", kg: 15, hargaPerKg: 24800, butir: 300 },
    { tanggal: "2025-12-03", pembeli: "MONOT", kg: 15, hargaPerKg: 25000, butir: 300 },
  ];

  console.log("\n🥚 Seeding Penjualan Telur Desember 2025...");
  for (const item of desemberData) {
    const totalHarga = item.kg * item.hargaPerKg;
    const saldoAwal = saldoAkhir;
    saldoAkhir = saldoAwal + totalHarga;

    await prisma.penjualanTelur.create({
      data: {
        kandangId: kandang.id,
        nomorTransaksi: `TRX-${String(nomorTransaksi).padStart(6, "0")}`,
        tanggal: new Date(item.tanggal),
        pembeli: item.pembeli,
        jumlahButir: item.butir,
        beratKg: item.kg,
        hargaPerKg: item.hargaPerKg,
        totalHarga: totalHarga,
        saldoAwal: saldoAwal,
        uangMasuk: totalHarga,
        uangKeluar: 0,
        saldoAkhir: saldoAkhir,
        metodeBayar: "TUNAI",
      },
    });
    nomorTransaksi++;
  }

  console.log("\n✅ Seeding completed!");
  console.log(`Total transaksi: ${nomorTransaksi - 1}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
