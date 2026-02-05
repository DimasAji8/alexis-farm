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

  // DATA PEMASUKAN MEI - AGUSTUS 2025
  const pemasukanData = [
    { tanggal: "2025-05-01", kategori: "Modal", jumlah: 5_000_000, keterangan: "PEMASUKAN" },
    { tanggal: "2025-05-14", kategori: "Modal", jumlah: 5_000_000, keterangan: "PEMASUKAN" },
    { tanggal: "2025-05-22", kategori: "Modal", jumlah: 5_000_000, keterangan: "PEMASUKAN" },
    { tanggal: "2025-06-19", kategori: "Modal", jumlah: 10_000_000, keterangan: "PEMASUKAN" },
    { tanggal: "2025-06-24", kategori: "Modal", jumlah: 40_000_000, keterangan: "PEMASUKAN" },
    { tanggal: "2025-06-27", kategori: "Modal", jumlah: 60_000_000, keterangan: "PEMASUKAN" },
    { tanggal: "2025-07-09", kategori: "Modal", jumlah: 5_000_000, keterangan: "PEMASUKAN" },
    { tanggal: "2025-07-20", kategori: "Modal", jumlah: 5_000_000, keterangan: "PEMASUKAN" },
    { tanggal: "2025-08-14", kategori: "Modal", jumlah: 10_000_000, keterangan: "PEMASUKAN" },
    { tanggal: "2025-08-20", kategori: "Modal", jumlah: 5_000_000, keterangan: "PEMASUKAN" },
    { tanggal: "2025-08-14", kategori: "Penjualan Telur", jumlah: 8_556_000, keterangan: "AGUNG GILING 80X5 SAK @6650 PEMASUKAN DARI PENJUALAN TELUR (3 JT)" },
  ];

  for (const data of pemasukanData) {
    await prisma.pemasukan.create({
      data: {
        tanggal: new Date(data.tanggal),
        kategori: data.kategori,
        jumlah: data.jumlah,
        keterangan: data.keterangan,
      },
    });
    console.log(`✅ Pemasukan ${data.tanggal}: Rp ${data.jumlah.toLocaleString('id-ID')}`);
  }

  // DATA PENGELUARAN OPERASIONAL MEI - AGUSTUS 2025
  const pengeluaranData = [
    // MEI 2025
    { tanggal: "2025-05-16", kategori: "Pakan", jumlah: 187_000, keterangan: "BELI PRING 1 IKAT, 2 KAWAT, 1/2 PAKU, 1 TARGEL" },
    { tanggal: "2025-05-17", kategori: "Pakan", jumlah: 50_000, keterangan: "2 KAWAT 16, 1/4 PAKU" },
    { tanggal: "2025-05-19", kategori: "Lainnya", jumlah: 150_000, keterangan: "PRING PANJANG DAN PENDEK 1 IKET" },
    { tanggal: "2025-05-21", kategori: "Pakan", jumlah: 25_000, keterangan: "PAKU 1 KG" },
    { tanggal: "2025-05-24", kategori: "Lainnya", jumlah: 45_000, keterangan: "2 KAWAT 16" },
    { tanggal: "2025-05-25", kategori: "Maintenance", jumlah: 2_076_000, keterangan: "GAJI PERBAIKAN KANDANG" },
    { tanggal: "2025-05-26", kategori: "Pakan", jumlah: 30_000, keterangan: "1 1/2 PAKU" },
    { tanggal: "2025-05-27", kategori: "Lainnya", jumlah: 200_000, keterangan: "2 IKAT BAMBU" },
    { tanggal: "2025-05-29", kategori: "Transport", jumlah: 500_000, keterangan: "BIAYA DL MAGETAN" },
    { tanggal: "2025-05-30", kategori: "Pakan", jumlah: 74_000, keterangan: "1 1/2 PAKU, 2 KAWAT 16" },
    { tanggal: "2025-05-31", kategori: "Maintenance", jumlah: 1_610_000, keterangan: "GAJI PERBAIKAN KANDANG" },

    // JUNI 2025
    { tanggal: "2025-06-04", kategori: "Pakan", jumlah: 20_000, keterangan: "1 kg PAKU" },
    { tanggal: "2025-06-07", kategori: "Lainnya", jumlah: 195_000, keterangan: "PRING, PAKU, LEM" },
    { tanggal: "2025-06-07", kategori: "Maintenance", jumlah: 1_380_000, keterangan: "GAJI PERBAIKAN KANDANG" },
    { tanggal: "2025-06-10", kategori: "Lainnya", jumlah: 45_000, keterangan: "2 KAWAT 16" },
    { tanggal: "2025-06-12", kategori: "Lainnya", jumlah: 45_000, keterangan: "2 KAWAT 16" },
    { tanggal: "2025-06-14", kategori: "Maintenance", jumlah: 1_495_000, keterangan: "GAJI PERBAIKAN KANDANG" },
    { tanggal: "2025-06-16", kategori: "Lainnya", jumlah: 32_000, keterangan: "LEM TANGIT, 1/2 PAKU, PAKU" },
    { tanggal: "2025-06-17", kategori: "Lainnya", jumlah: 3_185_000, keterangan: "PEMBELIAN SETEL TALANG & 10 BLABAK" },
    { tanggal: "2025-06-19", kategori: "Lainnya", jumlah: 175_000, keterangan: "3 KG SUMIK, 1 KG JAHE, 1 KG TEMU, CONTAINER" },
    { tanggal: "2025-06-19", kategori: "Pakan", jumlah: 65_500, keterangan: "2 PRALON, 1 LEM, 1/4 PAKU, KABEL 1 ROL" },
    { tanggal: "2025-06-19", kategori: "Lainnya", jumlah: 471_000, keterangan: "5 FITTING GANTUNG , 12 LED PHILIPS 4 WHAT" },
    { tanggal: "2025-06-19", kategori: "Lainnya", jumlah: 23_000, keterangan: "GULA MERAH 1 KG" },
    { tanggal: "2025-06-19", kategori: "Lainnya", jumlah: 8_000, keterangan: "Admin Bank" },
    { tanggal: "2025-06-20", kategori: "Lainnya", jumlah: 350_000, keterangan: "1 PICKUP PASIR" },
    { tanggal: "2025-06-20", kategori: "Pakan", jumlah: 35_000, keterangan: "4 WATER MOOR, 1/4 PAKU" },
    { tanggal: "2025-06-20", kategori: "Vitamin, Vaksin, Obat", jumlah: 3_131_500, keterangan: "5 KONSENTRAT, 2 PARDOC, 2 VITA STRESS, 2 EGG STIMULAN" },
    { tanggal: "2025-06-20", kategori: "Vitamin, Vaksin, Obat", jumlah: 191_000, keterangan: "1 NEOMEDITIL 1 GLUTAMAS" },
    { tanggal: "2025-06-20", kategori: "Lainnya", jumlah: 110_000, keterangan: "2 SAK SEMEN" },
    { tanggal: "2025-06-21", kategori: "Lainnya", jumlah: 1_610_000, keterangan: "BAYAR TUKANG" },
    { tanggal: "2025-06-21", kategori: "Lainnya", jumlah: 885_700_000, keterangan: "BAYAR AYAM PULLET 16 MINGGU 997 EKOR" },
    { tanggal: "2025-06-21", kategori: "Lainnya", jumlah: 218_000, keterangan: "1LEM TANGIT, SELOTIP, UPAH TENAGA AYAM 2 ORANG" },
    { tanggal: "2025-06-21", kategori: "Lainnya", jumlah: 262_000, keterangan: "KOPI,SNACK, 2 KNEE, 1 FITTINGAN, TIMBA JAMU, PANCI" },
    { tanggal: "2025-06-21", kategori: "Lainnya", jumlah: 72_000, keterangan: "2 STOPKRAN, 4 SCOK KRAN, 6 TUTUP PIPA" },
    { tanggal: "2025-06-23", kategori: "Transport", jumlah: 250_000, keterangan: "TRANSPORT MAGETAN" },
    { tanggal: "2025-06-23", kategori: "Lainnya", jumlah: 30_000, keterangan: "1LEM, 1 STOP KRAN" },
    { tanggal: "2025-06-24", kategori: "Lainnya", jumlah: 1_350_000, keterangan: "BELI HP A06, KARTU PERDANA, TEMPERGLAS" },
    { tanggal: "2025-06-25", kategori: "Lainnya", jumlah: 101_000, keterangan: "BUKA REKENING BANK BRI BARU" },
    { tanggal: "2025-06-26", kategori: "Lainnya", jumlah: 110_000, keterangan: "2 SAK SEMEN" },
    { tanggal: "2025-06-26", kategori: "Vitamin, Vaksin, Obat", jumlah: 160_000, keterangan: "TRYMEZEVIL NEOMEDITRIL, EM4 TERNAK 1 LITER" },
    { tanggal: "2025-06-28", kategori: "Lainnya", jumlah: 805_000, keterangan: "BAYAR TUKANG" },
    { tanggal: "2025-06-29", kategori: "Lainnya", jumlah: 10_000, keterangan: "TEMULAWAK 1 KG" },
    { tanggal: "2025-06-29", kategori: "Lainnya", jumlah: 22_000, keterangan: "GAS" },
    { tanggal: "2025-06-29", kategori: "Lainnya", jumlah: 750_000, keterangan: "BIAYA SMS" },

    // JULI 2025
    { tanggal: "2025-07-01", kategori: "Lainnya", jumlah: 250_000, keterangan: "KONSENTRAT 6 NEOMEDTRIL 1 LITER" },
    { tanggal: "2025-07-01", kategori: "Lainnya", jumlah: 50_000, keterangan: "TRANSFERAN DARI SALDO REKENING BRI 1" },
    { tanggal: "2025-07-01", kategori: "Lainnya", jumlah: 2_250, keterangan: "BIAYA SMS" },
    { tanggal: "2025-07-05", kategori: "Lainnya", jumlah: 2_220_000, keterangan: "JAGUNG GILING 80X5 SAK @5550" },
    { tanggal: "2025-07-05", kategori: "Lainnya", jumlah: 258_000, keterangan: "KATUL 15X5 SAK @3450" },
    { tanggal: "2025-07-05", kategori: "Lainnya", jumlah: 750_000, keterangan: "BIAYA SMS" },
    { tanggal: "2025-07-07", kategori: "Lainnya", jumlah: 222_000, keterangan: "TYMIZOLKUS @74000" },
    { tanggal: "2025-07-08", kategori: "Lainnya", jumlah: 1_265_250, keterangan: "3 SAK PARDOC @421750" },
    { tanggal: "2025-07-08", kategori: "Pakan", jumlah: 8_460_000, keterangan: "20 SAK KLKS-36 @423000" },
    { tanggal: "2025-07-08", kategori: "Lainnya", jumlah: 45_000, keterangan: "PENGEMBALIAN DARI DINAR PS" },
    { tanggal: "2025-07-08", kategori: "Lainnya", jumlah: 60_000, keterangan: "POTONGAN PAKAN" },
    { tanggal: "2025-07-12", kategori: "Lainnya", jumlah: 2_250, keterangan: "BIAYA SMS" },
    { tanggal: "2025-07-12", kategori: "Lainnya", jumlah: 2_260_000, keterangan: "JAGUNG GILING 80X5 SAK @5650" },
    { tanggal: "2025-07-12", kategori: "Lainnya", jumlah: 281_000, keterangan: "KATUL 15X5 SAK @3750" },
    { tanggal: "2025-07-16", kategori: "Lainnya", jumlah: 5_500, keterangan: "ADMIN FEE" },
    { tanggal: "2025-07-17", kategori: "Lainnya", jumlah: 2_500, keterangan: "MONTHLY FEE ATM" },
    { tanggal: "2025-07-17", kategori: "Vitamin, Vaksin, Obat", jumlah: 92_000, keterangan: "VITAMIN 4 BUNGKUS @23000" },
    { tanggal: "2025-07-17", kategori: "Lainnya", jumlah: 750_000, keterangan: "BIAYA NOTIFIKASI SMS" },
    { tanggal: "2025-07-20", kategori: "Lainnya", jumlah: 1_400_000, keterangan: "GAJI DAN UANG MAKAN 1 BULAN" },
    { tanggal: "2025-07-20", kategori: "Listrik", jumlah: 100_000, keterangan: "LISTRIK DAN AIR" },
    { tanggal: "2025-07-24", kategori: "Vitamin, Vaksin, Obat", jumlah: 412_000, keterangan: "VAKSIN + VITA STRESS" },
    { tanggal: "2025-07-24", kategori: "Lainnya", jumlah: 18_000, keterangan: "KOTAK TELUR 3" },
    { tanggal: "2025-07-24", kategori: "Vitamin, Vaksin, Obat", jumlah: 50_000, keterangan: "ONGKOS VAKSIN" },
    { tanggal: "2025-07-25", kategori: "Lainnya", jumlah: 2_250, keterangan: "BIAYA SMS" },
    { tanggal: "2025-07-27", kategori: "Lainnya", jumlah: 2_440_000, keterangan: "JAGUNG GILING 80X5 SAK @6100" },
    { tanggal: "2025-07-27", kategori: "Lainnya", jumlah: 288_000, keterangan: "KATUL 15X5 SAK @3850" },
    { tanggal: "2025-07-29", kategori: "Lainnya", jumlah: 750_000, keterangan: "BIAYA SMS" },
    { tanggal: "2025-07-30", kategori: "Lainnya", jumlah: 222_000, keterangan: "3 TRYMICIN SERBUK" },
    { tanggal: "2025-08-01", kategori: "Lainnya", jumlah: 750_000, keterangan: "BIAYA SMS" },
    { tanggal: "2025-08-05", kategori: "Lainnya", jumlah: 23_000, keterangan: "PEMBELIAN PAKET DATA" },
    { tanggal: "2025-08-05", kategori: "Lainnya", jumlah: 750_000, keterangan: "BIAYA SMS" },

    // AGUSTUS 2025
    { tanggal: "2025-08-06", kategori: "Lainnya", jumlah: 54_000, keterangan: "JAMU AYAM, JAHE, KUNJIR, TEMULAWAK" },
    { tanggal: "2025-08-09", kategori: "Lainnya", jumlah: 750_000, keterangan: "BIAYA SMS" },
    { tanggal: "2025-08-11", kategori: "Lainnya", jumlah: 2_600_000, keterangan: "JAGUNG GILING 80X5 SAK @6500" },
    { tanggal: "2025-08-11", kategori: "Lainnya", jumlah: 326_000, keterangan: "KATUL 15X5 SAK @4350" },
    { tanggal: "2025-08-14", kategori: "Lainnya", jumlah: 5_556_000, keterangan: "PEMBELIAN KLKS 20, 4 EGG STIMULAN" },
    { tanggal: "2025-08-14", kategori: "Lainnya", jumlah: 82_320_000, keterangan: "AGUNG GILING 80X1300 SAK @6650 PEMASUKAN DARI PENJUALAN TELUR (3 JT)" },
    { tanggal: "2025-08-16", kategori: "Lainnya", jumlah: 750_000, keterangan: "KATUL 15X10 SAK @5000" },
    { tanggal: "2025-08-16", kategori: "Lainnya", jumlah: 5_500, keterangan: "ADMIN ADMINISTRASI" },
    { tanggal: "2025-08-16", kategori: "Lainnya", jumlah: 2_500, keterangan: "BIAYA BULANAN ATM" },
    { tanggal: "2025-08-16", kategori: "Vitamin, Vaksin, Obat", jumlah: 417_000, keterangan: "OBAT CACING LEVAMID @142000, OBAT GUREM DIMETRIN@275000" },
    { tanggal: "2025-08-17", kategori: "Lainnya", jumlah: 3_750, keterangan: "BIAYA SMS" },
    { tanggal: "2025-08-20", kategori: "Lainnya", jumlah: 1_400_000, keterangan: "GAJI DAN UANG MAKAN 1 BULAN" },
    { tanggal: "2025-08-20", kategori: "Listrik", jumlah: 100_000, keterangan: "LISTRIK DAN AIR" },
    { tanggal: "2025-08-21", kategori: "Lainnya", jumlah: 24_000, keterangan: "BELI KOTAK TELUR 4 @6000" },
    { tanggal: "2025-08-21", kategori: "Lainnya", jumlah: 750_000, keterangan: "BIAYA SMS" },
    { tanggal: "2025-08-22", kategori: "Vitamin, Vaksin, Obat", jumlah: 432_000, keterangan: "OBAT FLU INJEK 4 BOTOL DOSIS 0,4 ml" },
    { tanggal: "2025-08-22", kategori: "Vitamin, Vaksin, Obat", jumlah: 50_000, keterangan: "BIAYA SUNTIK AYAM" },
    { tanggal: "2025-08-25", kategori: "Lainnya", jumlah: 2_250, keterangan: "BIAYA SMS" },
    { tanggal: "2025-08-29", kategori: "Vitamin, Vaksin, Obat", jumlah: 208_000, keterangan: "VAKSIN ND IB LIVE 1000, BIAYA VAKSIN, JAMU, KOTAK TELUR, VITASTRES" },
    { tanggal: "2025-08-30", kategori: "Lainnya", jumlah: 1_644_000, keterangan: "JAGUNG GILING 80X5 SAK @6850" },
    { tanggal: "2025-08-30", kategori: "Lainnya", jumlah: 256_000, keterangan: "KATUL 15X3 SAK @5700" },
    { tanggal: "2025-08-31", kategori: "Lainnya", jumlah: 935_000, keterangan: "BIAYA TRANSFER UANG TELUR @500017" },
  ];

  for (const data of pengeluaranData) {
    await prisma.pengeluaranOperasional.create({
      data: {
        kandangId: kandang.id,
        tanggal: new Date(data.tanggal),
        kategori: data.kategori,
        jumlah: data.jumlah,
        keterangan: data.keterangan,
      },
    });
    console.log(`✅ Pengeluaran ${data.tanggal}: ${data.kategori} - Rp ${data.jumlah.toLocaleString('id-ID')}`);
  }

  console.log("\n🎉 Selesai! Data keuangan Mei - Agustus 2025 berhasil di-seed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
