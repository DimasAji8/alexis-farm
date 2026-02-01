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

  // Data produksi telur
  const produksiData = [
    { tanggal: "2025-11-01", bagus: 853, tidakBagus: 1, berat: 51 },
    { tanggal: "2025-11-02", bagus: 858, tidakBagus: 4, berat: 51.1 },
    { tanggal: "2025-11-03", bagus: 840, tidakBagus: 2, berat: 50.5 },
    { tanggal: "2025-11-04", bagus: 843, tidakBagus: 3, berat: 51.1 },
    { tanggal: "2025-11-05", bagus: 849, tidakBagus: 5, berat: 51.3 },
    { tanggal: "2025-11-06", bagus: 863, tidakBagus: 3, berat: 52.1 },
    { tanggal: "2025-11-07", bagus: 853, tidakBagus: 5, berat: 51.8 },
    { tanggal: "2025-11-08", bagus: 848, tidakBagus: 5, berat: 51.4 },
    { tanggal: "2025-11-09", bagus: 859, tidakBagus: 2, berat: 52.5 },
    { tanggal: "2025-11-10", bagus: 864, tidakBagus: 4, berat: 52.9 },
    { tanggal: "2025-11-11", bagus: 860, tidakBagus: 6, berat: 52.5 },
    { tanggal: "2025-11-12", bagus: 850, tidakBagus: 6, berat: 52 },
    { tanggal: "2025-11-13", bagus: 853, tidakBagus: 2, berat: 52.5 },
    { tanggal: "2025-11-14", bagus: 873, tidakBagus: 4, berat: 53.7 },
    { tanggal: "2025-11-15", bagus: 861, tidakBagus: 5, berat: 52.9 },
    { tanggal: "2025-11-16", bagus: 878, tidakBagus: 1, berat: 54.6 },
    { tanggal: "2025-11-17", bagus: 860, tidakBagus: 1, berat: 53.6 },
    { tanggal: "2025-11-18", bagus: 860, tidakBagus: 1, berat: 52.4 },
    { tanggal: "2025-11-19", bagus: 861, tidakBagus: 8, berat: 53 },
    { tanggal: "2025-11-20", bagus: 869, tidakBagus: 4, berat: 53.2 },
    { tanggal: "2025-11-21", bagus: 854, tidakBagus: 3, berat: 52.6 },
    { tanggal: "2025-11-22", bagus: 835, tidakBagus: 6, berat: 51.6 },
    { tanggal: "2025-11-23", bagus: 873, tidakBagus: 6, berat: 53.8 },
    { tanggal: "2025-11-24", bagus: 873, tidakBagus: 5, berat: 53.8 },
    { tanggal: "2025-11-25", bagus: 867, tidakBagus: 8, berat: 53.3 },
    { tanggal: "2025-11-26", bagus: 871, tidakBagus: 2, berat: 53.7 },
    { tanggal: "2025-11-27", bagus: 870, tidakBagus: 7, berat: 53.5 },
    { tanggal: "2025-11-28", bagus: 865, tidakBagus: 11, berat: 53.3 },
    { tanggal: "2025-11-29", bagus: 850, tidakBagus: 7, berat: 51.9 },
    { tanggal: "2025-11-30", bagus: 883, tidakBagus: 9, berat: 54.5 },
  ];

  // Seed produksi telur
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

    console.log(`✅ Produksi ${data.tanggal}: ${data.bagus} bagus, ${data.tidakBagus} tidak bagus = ${data.berat} Kg`);
  }

  const telurData = [
    { tanggal: "2025-11-01", masukKg: 51, keluarKg: 15, pembeli: "LASTRI", bayarTgl: "2025-11-04", hargaPerKg: 25000 },
    { tanggal: "2025-11-02", masukKg: 51.1, keluarKg: 15, pembeli: "LASTRI", bayarTgl: "2025-11-08", hargaPerKg: 25200 },
    { tanggal: "2025-11-03", masukKg: 50.5, keluarKg: 258.2, pembeli: "GISMA (GANTIL#3)", bayarTgl: "2025-11-08", hargaPerKg: 25200 },
    { tanggal: "2025-11-03", masukKg: 0, keluarKg: 15, pembeli: "LASTRI", bayarTgl: "2025-11-08", hargaPerKg: 25200 },
    { tanggal: "2025-11-05", masukKg: 51.3, keluarKg: 30, pembeli: "LASTRI", bayarTgl: "2025-11-08", hargaPerKg: 25200 },
    { tanggal: "2025-11-06", masukKg: 52.1, keluarKg: 15, pembeli: "LASTRI", bayarTgl: "2025-11-08", hargaPerKg: 24800 },
    { tanggal: "2025-11-07", masukKg: 51.8, keluarKg: 15, pembeli: "LASTRI", bayarTgl: "2025-11-16", hargaPerKg: 24800 },
    { tanggal: "2025-11-08", masukKg: 51.4, keluarKg: 15, pembeli: "LASTRI", bayarTgl: "2025-11-16", hargaPerKg: 24800 },
    { tanggal: "2025-11-09", masukKg: 52.5, keluarKg: 15, pembeli: "LASTRI", bayarTgl: "2025-11-16", hargaPerKg: 25200 },
    { tanggal: "2025-11-10", masukKg: 52.9, keluarKg: 15, pembeli: "LASTRI", bayarTgl: "2025-11-16", hargaPerKg: 25200 },
    { tanggal: "2025-11-10", masukKg: 0, keluarKg: 255, pembeli: "GISMA", bayarTgl: "2025-11-10", hargaPerKg: 25200 },
    { tanggal: "2025-11-11", masukKg: 52.5, keluarKg: 15, pembeli: "LASTRI", bayarTgl: "2025-11-16", hargaPerKg: 25200 },
    { tanggal: "2025-11-12", masukKg: 52, keluarKg: 15, pembeli: "LASTRI", bayarTgl: "2025-11-16", hargaPerKg: 25200 },
    { tanggal: "2025-11-13", masukKg: 52.5, keluarKg: 15, pembeli: "LASTRI", bayarTgl: "2025-11-21", hargaPerKg: 25200 },
    { tanggal: "2025-11-14", masukKg: 53.7, keluarKg: 15, pembeli: "LASTRI", bayarTgl: "2025-11-21", hargaPerKg: 25200 },
    { tanggal: "2025-11-15", masukKg: 52.9, keluarKg: 15, pembeli: "LASTRI", bayarTgl: "2025-11-21", hargaPerKg: 25400 },
    { tanggal: "2025-11-16", masukKg: 54.6, keluarKg: 255, pembeli: "GISMA", bayarTgl: "2025-11-17", hargaPerKg: 25400 },
    { tanggal: "2025-11-16", masukKg: 0, keluarKg: 15, pembeli: "LASTRI", bayarTgl: "2025-11-21", hargaPerKg: 25400 },
    { tanggal: "2025-11-17", masukKg: 53.6, keluarKg: 15, pembeli: "LASTRI", bayarTgl: "2025-12-01", hargaPerKg: 25400 },
    { tanggal: "2025-11-18", masukKg: 52.4, keluarKg: 0, pembeli: "", bayarTgl: "", hargaPerKg: 0 },
    { tanggal: "2025-11-19", masukKg: 53, keluarKg: 15, pembeli: "LASTRI", bayarTgl: "2025-12-01", hargaPerKg: 24800 },
    { tanggal: "2025-11-20", masukKg: 53.2, keluarKg: 15, pembeli: "LASTRI", bayarTgl: "2025-12-01", hargaPerKg: 24800 },
    { tanggal: "2025-11-21", masukKg: 52.6, keluarKg: 15, pembeli: "LASTRI", bayarTgl: "2025-12-01", hargaPerKg: 24800 },
    { tanggal: "2025-11-22", masukKg: 51.6, keluarKg: 15, pembeli: "LASTRI", bayarTgl: "2025-12-01", hargaPerKg: 24800 },
    { tanggal: "2025-11-23", masukKg: 53.8, keluarKg: 15, pembeli: "LASTRI", bayarTgl: "2025-12-01", hargaPerKg: 25000 },
    { tanggal: "2025-11-23", masukKg: -0.3, keluarKg: 285, pembeli: "GISMA(GANTIL02)", bayarTgl: "2025-11-24", hargaPerKg: 25000 },
    { tanggal: "2025-11-24", masukKg: 53.8, keluarKg: 15, pembeli: "LASTRI", bayarTgl: "2025-12-01", hargaPerKg: 25000 },
    { tanggal: "2025-11-25", masukKg: 53.3, keluarKg: 15, pembeli: "LASTRI", bayarTgl: "2025-12-03", hargaPerKg: 24800 },
    { tanggal: "2025-11-26", masukKg: 53.7, keluarKg: 15, pembeli: "LASTRI", bayarTgl: "2025-12-03", hargaPerKg: 24800 },
    { tanggal: "2025-11-27", masukKg: 53.5, keluarKg: 15, pembeli: "LASTRI", bayarTgl: "2025-12-03", hargaPerKg: 24800 },
    { tanggal: "2025-11-28", masukKg: 53.3, keluarKg: 15, pembeli: "LASTRI", bayarTgl: "2025-12-03", hargaPerKg: 24800 },
    { tanggal: "2025-11-29", masukKg: 51.9, keluarKg: 0, pembeli: "", bayarTgl: "", hargaPerKg: 0 },
    { tanggal: "2025-11-30", masukKg: 54.5, keluarKg: 15, pembeli: "LASTRI", bayarTgl: "2025-12-03", hargaPerKg: 25000 },
    { tanggal: "2025-11-30", masukKg: 0, keluarKg: 285, pembeli: "GISMA", bayarTgl: "2025-12-02", hargaPerKg: 25000 },
  ];

  let nomorTransaksi = 1;
  
  for (const data of telurData) {
    if (data.keluarKg === 0 || !data.pembeli) {
      // Skip jika tidak ada penjualan
      console.log(`⏭️  Skip ${data.tanggal} - Tidak ada penjualan`);
      continue;
    }

    const existing = await prisma.penjualanTelur.findFirst({
      where: {
        kandangId: kandang.id,
        tanggal: new Date(data.tanggal),
        pembeli: data.pembeli,
        beratKg: data.keluarKg,
      },
    });

    if (existing) {
      console.log(`ℹ️  Penjualan ${data.tanggal} - ${data.pembeli} sudah ada, skip...`);
      continue;
    }

    const totalHarga = data.keluarKg * data.hargaPerKg;
    const jumlahButir = Math.round(data.keluarKg * 16.67); // Estimasi 1kg = ~16.67 butir

    await prisma.penjualanTelur.create({
      data: {
        kandangId: kandang.id,
        nomorTransaksi: `TRX-NOV25-${String(nomorTransaksi++).padStart(3, "0")}`,
        tanggal: new Date(data.tanggal),
        pembeli: data.pembeli,
        jumlahButir,
        beratKg: data.keluarKg,
        hargaPerKg: data.hargaPerKg,
        totalHarga,
        saldoAwal: 0,
        uangMasuk: totalHarga,
        uangKeluar: 0,
        saldoAkhir: totalHarga,
        metodeBayar: "TEMPO",
        keterangan: data.bayarTgl ? `Bayar: ${data.bayarTgl}` : undefined,
        createdBy: admin.id,
      },
    });

    console.log(`✅ ${data.tanggal} - ${data.pembeli}: ${data.keluarKg} Kg @ Rp ${data.hargaPerKg.toLocaleString()} = Rp ${totalHarga.toLocaleString()}`);
  }

  console.log("✅ Seed selesai - Data Telur November 2025");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
