import "dotenv/config";
import { prisma } from "../app/api/db/prisma";
import { subDays, startOfDay } from "date-fns";

async function main() {
  console.log("🌱 Generating dummy data for dashboard...");

  // Get or create kandang
  let kandang = await prisma.kandang.findFirst({ where: { status: "aktif" } });
  
  if (!kandang) {
    kandang = await prisma.kandang.create({
      data: {
        kode: "KDG001",
        nama: "Kandang A",
        lokasi: "Blok Utara",
        jumlahAyam: 1000,
        status: "aktif",
      },
    });
    console.log("✅ Created kandang:", kandang.nama);
  } else {
    await prisma.kandang.update({
      where: { id: kandang.id },
      data: { jumlahAyam: 1000 },
    });
    console.log("✅ Using kandang:", kandang.nama);
  }

  // Get or create jenis pakan
  let jenisPakan = await prisma.jenisPakan.findFirst({ where: { isActive: true } });
  
  if (!jenisPakan) {
    jenisPakan = await prisma.jenisPakan.create({
      data: {
        kode: "PKN001",
        nama: "Pakan Layer",
        satuan: "KG",
        isActive: true,
      },
    });
    console.log("✅ Created jenis pakan:", jenisPakan.nama);
  } else {
    console.log("✅ Using jenis pakan:", jenisPakan.nama);
  }

  const today = new Date();

  // 1. Ayam Masuk
  await prisma.ayamMasuk.create({
    data: {
      kandangId: kandang.id,
      tanggal: subDays(today, 60),
      jumlahAyam: 1000,
    },
  });

  // 2. Kematian (random 1-3 ekor per minggu)
  for (let i = 0; i < 8; i++) {
    await prisma.kematianRecord.create({
      data: {
        kandangId: kandang.id,
        tanggal: subDays(today, i * 7),
        jumlahMati: Math.floor(Math.random() * 3) + 1,
      },
    });
  }

  // 3. Pembelian Pakan
  const pembelian = await prisma.pembelianPakan.create({
    data: {
      jenisPakanId: jenisPakan.id,
      tanggalBeli: subDays(today, 30),
      jumlahKg: 5000,
      hargaPerKg: 8000,
      totalHarga: 40000000,
      sisaStokKg: 3000,
    },
  });

  // 4. Pemakaian Pakan (30 hari terakhir)
  for (let i = 0; i < 30; i++) {
    const jumlahKg = 80 + Math.random() * 40; // 80-120 kg per hari
    const totalBiaya = jumlahKg * 8000;

    const header = await prisma.pemakaianPakanHeader.create({
      data: {
        kandangId: kandang.id,
        jenisPakanId: jenisPakan.id,
        tanggalPakai: startOfDay(subDays(today, i)),
        jumlahKg,
        totalBiaya,
      },
    });

    await prisma.pemakaianPakanDetail.create({
      data: {
        headerId: header.id,
        pembelianPakanId: pembelian.id,
        jumlahKg,
        hargaPerKg: 8000,
        totalBiaya,
      },
    });
  }

  // 5. Produksi Telur (30 hari terakhir)
  let stockButir = 0;
  let stockKg = 0;

  for (let i = 29; i >= 0; i--) {
    const jumlahBagus = 700 + Math.floor(Math.random() * 100); // 700-800 butir
    const jumlahTidakBagus = Math.floor(Math.random() * 20); // 0-20 butir
    const totalButir = jumlahBagus + jumlahTidakBagus;
    const totalKg = totalButir * 0.06; // asumsi 60 gram per butir

    await prisma.produksiTelur.create({
      data: {
        kandangId: kandang.id,
        tanggal: startOfDay(subDays(today, i)),
        jumlahBagusButir: jumlahBagus,
        jumlahTidakBagusButir: jumlahTidakBagus,
        totalButir,
        totalKg,
      },
    });

    stockButir += totalButir;
    stockKg += totalKg;

    // Simulasi penjualan setiap 3 hari
    if (i % 3 === 0 && stockButir > 0) {
      const jualButir = Math.min(stockButir, 1500 + Math.floor(Math.random() * 500));
      const jualKg = jualButir * 0.06;
      const hargaPerKg = 28000 + Math.random() * 2000; // 28k-30k
      const totalHarga = jualKg * hargaPerKg;

      const saldoAwal = i === 27 ? 0 : 5000000 + Math.random() * 2000000;
      const saldoAkhir = saldoAwal + totalHarga;

      await prisma.penjualanTelur.create({
        data: {
          kandangId: kandang.id,
          nomorTransaksi: `TRX${Date.now()}-${i}`,
          tanggal: startOfDay(subDays(today, i)),
          pembeli: i % 2 === 0 ? "Toko Sumber Rejeki" : "Pasar Sentral",
          jumlahButir: jualButir,
          beratKg: jualKg,
          hargaPerKg,
          totalHarga,
          saldoAwal,
          uangMasuk: totalHarga,
          uangKeluar: 0,
          saldoAkhir,
          metodeBayar: "tunai",
        },
      });

      stockButir -= jualButir;
      stockKg -= jualKg;
    }

    // Simpan stock harian
    await prisma.stockTelur.create({
      data: {
        kandangId: kandang.id,
        tanggal: startOfDay(subDays(today, i)),
        stockButir,
        stockKg,
      },
    });
  }

  // 6. Pengeluaran Operasional (bulan ini)
  const kategoriPengeluaran = ["Listrik", "Air", "Obat-obatan", "Vitamin", "Maintenance"];
  
  for (let i = 0; i < 10; i++) {
    await prisma.pengeluaranOperasional.create({
      data: {
        kandangId: kandang.id,
        tanggal: subDays(today, Math.floor(Math.random() * 28)), // dalam 28 hari terakhir
        kategori: kategoriPengeluaran[Math.floor(Math.random() * kategoriPengeluaran.length)],
        jumlah: 100000 + Math.random() * 400000, // 100k-500k
        keterangan: "Pengeluaran operasional rutin",
      },
    });
  }

  console.log("✅ Dummy data generated successfully!");
  console.log(`📊 Kandang: ${kandang.nama} (${kandang.kode})`);
  console.log(`   - 1000 ayam`);
  console.log(`   - 30 hari produksi telur`);
  console.log(`   - 30 hari pemakaian pakan`);
  console.log(`   - ${stockButir} butir stok telur`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
