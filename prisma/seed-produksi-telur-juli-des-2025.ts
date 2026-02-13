import "dotenv/config";
import { prisma } from "../app/api/db/prisma";

async function main() {
  console.log("🌱 Seeding Produksi Telur Juli - Desember 2025...");

  const kandang = await prisma.kandang.findFirst({
    where: { kode: "KDG1" },
  });

  if (!kandang) {
    throw new Error("Kandang KDG1 not found");
  }

  // JULI 2025 - Jumlah Ayam: 995
  const juliData = [
    { tgl: 1, bagus: 0, tidakBagus: 0, berat: 0 },
    { tgl: 2, bagus: 0, tidakBagus: 0, berat: 0 },
    { tgl: 3, bagus: 0, tidakBagus: 0, berat: 0 },
    { tgl: 4, bagus: 1, tidakBagus: 0, berat: 0.05 },
    { tgl: 5, bagus: 0, tidakBagus: 0, berat: 0 },
    { tgl: 6, bagus: 1, tidakBagus: 0, berat: 0.05 },
    { tgl: 7, bagus: 0, tidakBagus: 0, berat: 0 },
    { tgl: 8, bagus: 1, tidakBagus: 0, berat: 0.05 },
    { tgl: 9, bagus: 3, tidakBagus: 0, berat: 0.15 },
    { tgl: 10, bagus: 4, tidakBagus: 0, berat: 0.2 },
    { tgl: 11, bagus: 7, tidakBagus: 0, berat: 0.35 },
    { tgl: 12, bagus: 7, tidakBagus: 0, berat: 0.35 },
    { tgl: 13, bagus: 9, tidakBagus: 0, berat: 0.45 },
    { tgl: 14, bagus: 9, tidakBagus: 0, berat: 0.45 },
    { tgl: 15, bagus: 15, tidakBagus: 0, berat: 0.75 },
    { tgl: 16, bagus: 19, tidakBagus: 0, berat: 0.95 },
    { tgl: 17, bagus: 23, tidakBagus: 0, berat: 1.15 },
    { tgl: 18, bagus: 28, tidakBagus: 0, berat: 1.4 },
    { tgl: 19, bagus: 37, tidakBagus: 1, berat: 1.9 },
    { tgl: 20, bagus: 45, tidakBagus: 0, berat: 2.25 },
    { tgl: 21, bagus: 52, tidakBagus: 0, berat: 2.6 },
    { tgl: 22, bagus: 61, tidakBagus: 0, berat: 3.05 },
    { tgl: 23, bagus: 67, tidakBagus: 0, berat: 3.35 },
    { tgl: 24, bagus: 79, tidakBagus: 0, berat: 3.95 },
    { tgl: 25, bagus: 85, tidakBagus: 0, berat: 4.25 },
    { tgl: 26, bagus: 90, tidakBagus: 0, berat: 4.5 },
    { tgl: 27, bagus: 90, tidakBagus: 0, berat: 4.5 },
    { tgl: 28, bagus: 96, tidakBagus: 0, berat: 4.8 },
    { tgl: 29, bagus: 118, tidakBagus: 0, berat: 5.9 },
    { tgl: 30, bagus: 111, tidakBagus: 0, berat: 5.55 },
    { tgl: 31, bagus: 118, tidakBagus: 2, berat: 6 },
  ];

  console.log("\n🥚 Seeding Produksi Telur Juli 2025...");
  for (const item of juliData) {
    await prisma.produksiTelur.create({
      data: {
        kandangId: kandang.id,
        tanggal: new Date(`2025-07-${item.tgl.toString().padStart(2, "0")}`),
        jumlahAyam: 995,
        jumlahBagusButir: item.bagus,
        jumlahTidakBagusButir: item.tidakBagus,
        totalButir: item.bagus + item.tidakBagus,
        totalKg: item.berat,
      },
    });
  }

  // AGUSTUS 2025 - Jumlah Ayam: 995
  const agustusData = [
    { tgl: 1, bagus: 131, tidakBagus: 0, berat: 6.77 },
    { tgl: 2, bagus: 140, tidakBagus: 4, berat: 7.34 },
    { tgl: 3, bagus: 145, tidakBagus: 3, berat: 7.49 },
    { tgl: 4, bagus: 157, tidakBagus: 3, berat: 8.12 },
    { tgl: 5, bagus: 172, tidakBagus: 0, berat: 8.9 },
    { tgl: 6, bagus: 176, tidakBagus: 0, berat: 9.23 },
    { tgl: 7, bagus: 196, tidakBagus: 0, berat: 10.21 },
    { tgl: 8, bagus: 201, tidakBagus: 2, berat: 10.55 },
    { tgl: 9, bagus: 212, tidakBagus: 1, berat: 11.25 },
    { tgl: 10, bagus: 219, tidakBagus: 2, berat: 11.55 },
    { tgl: 11, bagus: 242, tidakBagus: 3, berat: 12.82 },
    { tgl: 12, bagus: 259, tidakBagus: 4, berat: 13.74 },
    { tgl: 13, bagus: 280, tidakBagus: 2, berat: 14.92 },
    { tgl: 14, bagus: 292, tidakBagus: 2, berat: 15.63 },
    { tgl: 15, bagus: 325, tidakBagus: 4, berat: 17.25 },
    { tgl: 16, bagus: 341, tidakBagus: 1, berat: 18.57 },
    { tgl: 17, bagus: 362, tidakBagus: 4, berat: 19.55 },
    { tgl: 18, bagus: 390, tidakBagus: 4, berat: 20.9 },
    { tgl: 19, bagus: 410, tidakBagus: 1, berat: 22.91 },
    { tgl: 20, bagus: 448, tidakBagus: 5, berat: 24.3 },
    { tgl: 21, bagus: 464, tidakBagus: 9, berat: 25.2 },
    { tgl: 22, bagus: 497, tidakBagus: 2, berat: 27 },
    { tgl: 23, bagus: 519, tidakBagus: 9, berat: 28.36 },
    { tgl: 24, bagus: 559, tidakBagus: 6, berat: 30.36 },
    { tgl: 25, bagus: 602, tidakBagus: 5, berat: 33.03 },
    { tgl: 26, bagus: 621, tidakBagus: 2, berat: 34 },
    { tgl: 27, bagus: 622, tidakBagus: 5, berat: 34.5 },
    { tgl: 28, bagus: 668, tidakBagus: 5, berat: 36.9 },
    { tgl: 29, bagus: 665, tidakBagus: 4, berat: 36.9 },
    { tgl: 30, bagus: 690, tidakBagus: 5, berat: 38.8 },
  ];

  console.log("\n🥚 Seeding Produksi Telur Agustus 2025...");
  for (const item of agustusData) {
    await prisma.produksiTelur.create({
      data: {
        kandangId: kandang.id,
        tanggal: new Date(`2025-08-${item.tgl.toString().padStart(2, "0")}`),
        jumlahAyam: 995,
        jumlahBagusButir: item.bagus,
        jumlahTidakBagusButir: item.tidakBagus,
        totalButir: item.bagus + item.tidakBagus,
        totalKg: item.berat,
      },
    });
  }

  // SEPTEMBER 2025 - Jumlah Ayam: 970
  const septemberData = [
    { tgl: 1, bagus: 740, tidakBagus: 9, berat: 41.4 },
    { tgl: 2, bagus: 769, tidakBagus: 3, berat: 43.9 },
    { tgl: 3, bagus: 777, tidakBagus: 8, berat: 44 },
    { tgl: 4, bagus: 804, tidakBagus: 4, berat: 45.2 },
    { tgl: 5, bagus: 822, tidakBagus: 11, berat: 46.4 },
    { tgl: 6, bagus: 831, tidakBagus: 6, berat: 47.4 },
    { tgl: 7, bagus: 830, tidakBagus: 5, berat: 47.5 },
    { tgl: 8, bagus: 825, tidakBagus: 9, berat: 47.2 },
    { tgl: 9, bagus: 843, tidakBagus: 4, berat: 48.3 },
    { tgl: 10, bagus: 839, tidakBagus: 7, berat: 48.2 },
    { tgl: 11, bagus: 847, tidakBagus: 7, berat: 49 },
    { tgl: 12, bagus: 847, tidakBagus: 8, berat: 48.6 },
    { tgl: 13, bagus: 850, tidakBagus: 10, berat: 48.9 },
    { tgl: 14, bagus: 837, tidakBagus: 8, berat: 48.4 },
    { tgl: 15, bagus: 844, tidakBagus: 8, berat: 49.3 },
    { tgl: 16, bagus: 852, tidakBagus: 6, berat: 49.5 },
    { tgl: 17, bagus: 844, tidakBagus: 2, berat: 49.2 },
    { tgl: 18, bagus: 853, tidakBagus: 4, berat: 49.9 },
    { tgl: 19, bagus: 852, tidakBagus: 7, berat: 49.7 },
    { tgl: 20, bagus: 844, tidakBagus: 8, berat: 47.7 },
    { tgl: 21, bagus: 816, tidakBagus: 10, berat: 47.9 },
    { tgl: 22, bagus: 842, tidakBagus: 4, berat: 49.3 },
    { tgl: 23, bagus: 861, tidakBagus: 7, berat: 50.2 },
    { tgl: 24, bagus: 851, tidakBagus: 6, berat: 49.5 },
    { tgl: 25, bagus: 837, tidakBagus: 10, berat: 49 },
    { tgl: 26, bagus: 857, tidakBagus: 6, berat: 50.4 },
    { tgl: 27, bagus: 837, tidakBagus: 6, berat: 49 },
    { tgl: 28, bagus: 847, tidakBagus: 11, berat: 49.7 },
    { tgl: 29, bagus: 859, tidakBagus: 11, berat: 50.5 },
    { tgl: 30, bagus: 852, tidakBagus: 6, berat: 50 },
  ];

  console.log("\n🥚 Seeding Produksi Telur September 2025...");
  for (const item of septemberData) {
    await prisma.produksiTelur.create({
      data: {
        kandangId: kandang.id,
        tanggal: new Date(`2025-09-${item.tgl.toString().padStart(2, "0")}`),
        jumlahAyam: 970,
        jumlahBagusButir: item.bagus,
        jumlahTidakBagusButir: item.tidakBagus,
        totalButir: item.bagus + item.tidakBagus,
        totalKg: item.berat,
      },
    });
  }

  // OKTOBER 2025 - Jumlah Ayam: 965
  const oktoberData = [
    { tgl: 1, bagus: 854, tidakBagus: 6, berat: 50.7 },
    { tgl: 2, bagus: 845, tidakBagus: 12, berat: 49.5 },
    { tgl: 3, bagus: 845, tidakBagus: 7, berat: 49.5 },
    { tgl: 4, bagus: 848, tidakBagus: 11, berat: 49.3 },
    { tgl: 5, bagus: 858, tidakBagus: 7, berat: 50.5 },
    { tgl: 6, bagus: 846, tidakBagus: 10, berat: 49.8 },
    { tgl: 7, bagus: 865, tidakBagus: 6, berat: 51.2 },
    { tgl: 8, bagus: 870, tidakBagus: 7, berat: 51.2 },
    { tgl: 9, bagus: 858, tidakBagus: 8, berat: 50.6 },
    { tgl: 10, bagus: 855, tidakBagus: 6, berat: 50.3 },
    { tgl: 11, bagus: 864, tidakBagus: 8, berat: 51 },
    { tgl: 12, bagus: 848, tidakBagus: 4, berat: 50.1 },
    { tgl: 13, bagus: 870, tidakBagus: 4, berat: 51.3 },
    { tgl: 14, bagus: 862, tidakBagus: 6, berat: 51 },
    { tgl: 15, bagus: 867, tidakBagus: 13, berat: 50.9 },
    { tgl: 16, bagus: 858, tidakBagus: 10, berat: 50.6 },
    { tgl: 17, bagus: 865, tidakBagus: 8, berat: 51 },
    { tgl: 18, bagus: 864, tidakBagus: 10, berat: 50.7 },
    { tgl: 19, bagus: 841, tidakBagus: 7, berat: 49.4 },
    { tgl: 20, bagus: 860, tidakBagus: 5, berat: 50.7 },
    { tgl: 21, bagus: 846, tidakBagus: 4, berat: 50 },
    { tgl: 22, bagus: 840, tidakBagus: 4, berat: 49.8 },
    { tgl: 23, bagus: 800, tidakBagus: 10, berat: 47 },
    { tgl: 24, bagus: 823, tidakBagus: 4, berat: 48.8 },
    { tgl: 25, bagus: 830, tidakBagus: 7, berat: 49.3 },
    { tgl: 26, bagus: 815, tidakBagus: 2, berat: 48.4 },
    { tgl: 27, bagus: 837, tidakBagus: 4, berat: 49.3 },
    { tgl: 28, bagus: 848, tidakBagus: 2, berat: 50.3 },
    { tgl: 29, bagus: 830, tidakBagus: 5, berat: 49.4 },
    { tgl: 30, bagus: 829, tidakBagus: 4, berat: 49.7 },
    { tgl: 31, bagus: 820, tidakBagus: 1, berat: 49.2 },
  ];

  console.log("\n🥚 Seeding Produksi Telur Oktober 2025...");
  for (const item of oktoberData) {
    await prisma.produksiTelur.create({
      data: {
        kandangId: kandang.id,
        tanggal: new Date(`2025-10-${item.tgl.toString().padStart(2, "0")}`),
        jumlahAyam: 965,
        jumlahBagusButir: item.bagus,
        jumlahTidakBagusButir: item.tidakBagus,
        totalButir: item.bagus + item.tidakBagus,
        totalKg: item.berat,
      },
    });
  }

  // NOVEMBER 2025 - Jumlah Ayam: 965
  const novemberData = [
    { tgl: 1, bagus: 853, tidakBagus: 1, berat: 51 },
    { tgl: 2, bagus: 858, tidakBagus: 4, berat: 51.1 },
    { tgl: 3, bagus: 840, tidakBagus: 2, berat: 50.5 },
    { tgl: 4, bagus: 843, tidakBagus: 3, berat: 51.1 },
    { tgl: 5, bagus: 849, tidakBagus: 5, berat: 51.3 },
    { tgl: 6, bagus: 863, tidakBagus: 3, berat: 52.1 },
    { tgl: 7, bagus: 853, tidakBagus: 5, berat: 51.8 },
    { tgl: 8, bagus: 848, tidakBagus: 5, berat: 51.4 },
    { tgl: 9, bagus: 859, tidakBagus: 2, berat: 52.5 },
    { tgl: 10, bagus: 864, tidakBagus: 4, berat: 52.9 },
    { tgl: 11, bagus: 860, tidakBagus: 6, berat: 52.5 },
    { tgl: 12, bagus: 850, tidakBagus: 6, berat: 52 },
    { tgl: 13, bagus: 853, tidakBagus: 2, berat: 52.5 },
    { tgl: 14, bagus: 873, tidakBagus: 4, berat: 53.7 },
    { tgl: 15, bagus: 861, tidakBagus: 5, berat: 52.9 },
    { tgl: 16, bagus: 878, tidakBagus: 1, berat: 54.6 },
    { tgl: 17, bagus: 860, tidakBagus: 1, berat: 53.6 },
    { tgl: 18, bagus: 860, tidakBagus: 1, berat: 52.4 },
    { tgl: 19, bagus: 861, tidakBagus: 8, berat: 53 },
    { tgl: 20, bagus: 869, tidakBagus: 4, berat: 53.2 },
    { tgl: 21, bagus: 854, tidakBagus: 3, berat: 52.6 },
    { tgl: 22, bagus: 835, tidakBagus: 6, berat: 51.6 },
    { tgl: 23, bagus: 873, tidakBagus: 6, berat: 53.8 },
    { tgl: 24, bagus: 873, tidakBagus: 5, berat: 53.8 },
    { tgl: 25, bagus: 867, tidakBagus: 8, berat: 53.3 },
    { tgl: 26, bagus: 871, tidakBagus: 2, berat: 53.7 },
    { tgl: 27, bagus: 870, tidakBagus: 7, berat: 53.5 },
    { tgl: 28, bagus: 865, tidakBagus: 11, berat: 53.3 },
    { tgl: 29, bagus: 850, tidakBagus: 7, berat: 51.9 },
    { tgl: 30, bagus: 883, tidakBagus: 9, berat: 54.5 },
  ];

  console.log("\n🥚 Seeding Produksi Telur November 2025...");
  for (const item of novemberData) {
    await prisma.produksiTelur.create({
      data: {
        kandangId: kandang.id,
        tanggal: new Date(`2025-11-${item.tgl.toString().padStart(2, "0")}`),
        jumlahAyam: 965,
        jumlahBagusButir: item.bagus,
        jumlahTidakBagusButir: item.tidakBagus,
        totalButir: item.bagus + item.tidakBagus,
        totalKg: item.berat,
      },
    });
  }

  // DESEMBER 2025 - Jumlah Ayam: 965 (hanya 2 hari data)
  const desemberData = [
    { tgl: 1, bagus: 868, tidakBagus: 7, berat: 52.3 },
    { tgl: 2, bagus: 875, tidakBagus: 6, berat: 53.7 },
  ];

  console.log("\n🥚 Seeding Produksi Telur Desember 2025...");
  for (const item of desemberData) {
    await prisma.produksiTelur.create({
      data: {
        kandangId: kandang.id,
        tanggal: new Date(`2025-12-${item.tgl.toString().padStart(2, "0")}`),
        jumlahAyam: 965,
        jumlahBagusButir: item.bagus,
        jumlahTidakBagusButir: item.tidakBagus,
        totalButir: item.bagus + item.tidakBagus,
        totalKg: item.berat,
      },
    });
  }

  console.log("\n✅ Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
