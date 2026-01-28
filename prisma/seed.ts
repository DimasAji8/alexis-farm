import "dotenv/config";

import { prisma } from "../app/api/db/prisma";

async function main() {
  // Get existing admin user
  const admin = await prisma.user.findFirst({
    where: { role: "super_user" },
  });

  if (!admin) {
    throw new Error("Admin user tidak ditemukan. Jalankan seed admin dulu.");
  }

  console.log(`✅ Using admin: ${admin.username}`);

  // Get first active kandang
  const kandang1 = await prisma.kandang.findFirst({
    where: { status: "aktif" },
    orderBy: { nama: "asc" },
  });

  if (!kandang1) {
    throw new Error("Tidak ada kandang aktif. Tambahkan kandang dulu di master data.");
  }

  console.log(`✅ Using Kandang: ${kandang1.nama}`);

  // Seed data pakan
  const pakanData = [
    {
      kode: "JG001",
      nama: "JAGUNG",
      tanggalBeli: "2025-06-24",
      jumlahKg: 320,
      hargaPerKg: 5450,
      tanggalPakai: "2025-06-27",
      jumlahPakai: 240,
    },
    {
      kode: "KT001",
      nama: "KATUL",
      tanggalBeli: "2025-06-24",
      jumlahKg: 60,
      hargaPerKg: 3400,
      tanggalPakai: "2025-06-27",
      jumlahPakai: 45,
    },
    {
      kode: "PD001",
      nama: "PARDOC",
      tanggalBeli: "2025-06-24",
      jumlahKg: 100,
      hargaPerKg: 8435,
      tanggalPakai: "2025-06-27",
      jumlahPakai: 30,
    },
    {
      kode: "KLKS001",
      nama: "KONSENTRAT",
      tanggalBeli: "2025-06-24",
      jumlahKg: 250,
      hargaPerKg: 8460,
      tanggalPakai: "2025-06-27",
      jumlahPakai: 150,
    },
  ];

  for (const pakan of pakanData) {
    // Get jenis pakan
    const jenisPakan = await prisma.jenisPakan.findUnique({
      where: { kode: pakan.kode },
    });

    if (!jenisPakan) {
      console.log(`⚠️  Jenis pakan ${pakan.nama} (${pakan.kode}) tidak ditemukan, skip...`);
      continue;
    }

    // Check if pembelian already exists
    const existingPembelian = await prisma.pembelianPakan.findFirst({
      where: {
        jenisPakanId: jenisPakan.id,
        tanggalBeli: new Date(pakan.tanggalBeli),
        jumlahKg: pakan.jumlahKg,
      },
    });

    let pembelian;
    if (existingPembelian) {
      console.log(`ℹ️  Pembelian ${pakan.nama} sudah ada, skip...`);
      pembelian = existingPembelian;
    } else {
      // Create pembelian
      pembelian = await prisma.pembelianPakan.create({
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
      console.log(`✅ Pembelian ${pakan.nama}: ${pakan.jumlahKg} Kg @ Rp ${pakan.hargaPerKg.toLocaleString()}`);
    }

    // Check if pemakaian already exists
    const existingPemakaian = await prisma.pemakaianPakanHeader.findFirst({
      where: {
        kandangId: kandang1.id,
        jenisPakanId: jenisPakan.id,
        tanggalPakai: new Date(pakan.tanggalPakai),
        jumlahKg: pakan.jumlahPakai,
      },
    });

    if (existingPemakaian) {
      console.log(`ℹ️  Pemakaian ${pakan.nama} sudah ada, skip...`);
    } else {
      // Create pemakaian
      const totalBiaya = pakan.jumlahPakai * pakan.hargaPerKg;
      await prisma.pemakaianPakanHeader.create({
        data: {
          kandangId: kandang1.id,
          jenisPakanId: jenisPakan.id,
          tanggalPakai: new Date(pakan.tanggalPakai),
          jumlahKg: pakan.jumlahPakai,
          totalBiaya,
          createdBy: admin.id,
          details: {
            create: [
              {
                pembelianPakanId: pembelian.id,
                jumlahKg: pakan.jumlahPakai,
                hargaPerKg: pakan.hargaPerKg,
                totalBiaya,
              },
            ],
          },
        },
      });

      // Update sisa stok pembelian
      await prisma.pembelianPakan.update({
        where: { id: pembelian.id },
        data: { sisaStokKg: pakan.jumlahKg - pakan.jumlahPakai },
      });

      console.log(`✅ Pemakaian ${pakan.nama}: ${pakan.jumlahPakai} Kg (Sisa: ${pakan.jumlahKg - pakan.jumlahPakai} Kg)`);
    }
  }

  console.log("✅ Seed selesai - Data Pakan Juni 2025");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
