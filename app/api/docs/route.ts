import { NextResponse } from "next/server";

const openapiSpec = {
  openapi: "3.1.0",
  info: {
    title: "Alexis Farm API",
    version: "1.0.0",
    description: "Dokumentasi API untuk Auth, Kandang, Jenis Pakan, dan Users.",
  },
  components: {
    securitySchemes: {
      sessionCookie: {
        type: "apiKey",
        in: "cookie",
        name: "next-auth.session-token",
        description:
          "Login terlebih dahulu via /api/auth/callback/credentials atau UI client, lalu gunakan cookie sesi ini.",
      },
    },
  },
  security: [{ sessionCookie: [] }],
  servers: [{ url: "http://localhost:3000" }],
  paths: {
    "/api/auth/register": {
      post: {
        summary: "Register user baru (Akses: super_user)",
        tags: ["Auth"],
        description: "Hanya super_user yang boleh register via API.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              example: {
                username: "superuser",
                name: "Administrator",
                password: "super123!",
                role: "super_user",
                isActive: true,
              },
            },
          },
        },
        responses: {
          201: {
            description: "User berhasil dibuat",
            content: {
              "application/json": {
                example: {
                  success: true,
                  message: "User berhasil dibuat",
                  data: {
                    id: "cuid123",
                    username: "superuser",
                    name: "Administrator",
                    role: "super_user",
                    isActive: true,
                  },
                },
              },
            },
          },
          400: {
            description: "Validasi gagal",
            content: {
              "application/json": {
                example: {
                  success: false,
                  message: "Username sudah digunakan",
                },
              },
            },
          },
        },
      },
    },
    "/api/auth/callback/credentials": {
      post: {
        summary: "Login dengan credentials",
        tags: ["Auth"],
        description:
          "Langkah: 1) GET /api/auth/csrf untuk ambil csrfToken. 2) POST ke endpoint ini dengan csrfToken, username, password, callbackUrl.",
        requestBody: {
          required: true,
          content: {
            "application/x-www-form-urlencoded": {
              example: {
                csrfToken: "isi_dari_/api/auth/csrf",
                username: "superuser",
                password: "super123!",
                callbackUrl: "/client/dashboard",
              },
            },
            "application/json": {
              example: {
                csrfToken: "isi_dari_/api/auth/csrf",
                username: "superuser",
                password: "super123!",
                callbackUrl: "/client/dashboard",
              },
            },
          },
        },
        responses: {
          302: {
            description: "Redirect ke callbackUrl jika sukses",
          },
          401: {
            description: "Login gagal (username/password salah atau akun non-aktif)",
            content: {
              "application/json": {
                example: {
                  success: false,
                  message: "Password salah",
                },
              },
            },
          },
        },
      },
    },
    "/api/auth/csrf": {
      get: {
        summary: "Ambil CSRF token untuk login",
        tags: ["Auth"],
        responses: {
          200: {
            description: "Token CSRF",
            content: {
              "application/json": {
                example: {
                  csrfToken: "contoh-token",
                  cookie: "next-auth.csrf-token=contoh-token; Path=/; HttpOnly; SameSite=Lax",
                },
              },
            },
          },
        },
      },
    },
    "/api/ayam/masuk": {
      get: {
        summary: "Ambil riwayat ayam masuk",
        tags: ["Ayam"],
        responses: {
          200: {
            description: "Daftar ayam masuk",
            content: {
              "application/json": {
                example: {
                  success: true,
                  message: "Riwayat ayam masuk berhasil diambil",
                  data: [
                    {
                      id: "am1",
                      kandangId: "id_mst_kandang_1",
                      tanggal: "2024-01-01T00:00:00.000Z",
                      jumlahAyam: 100,
                    },
                  ],
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Catat ayam masuk (Akses: super_user, staff)",
        tags: ["Ayam"],
        description: "Akses: super_user, staff",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              example: {
                kandangId: "id_mst_kandang_1",
                tanggal: "2024-01-02",
                jumlahAyam: 120,
              },
            },
          },
        },
        responses: {
          201: { description: "Ayam masuk berhasil dicatat" },
          400: { description: "Validasi gagal / kandang tidak ditemukan" },
        },
      },
      put: {
        summary: "Update ayam masuk (Akses: super_user, staff)",
        tags: ["Ayam"],
        description: "Akses: super_user, staff",
        parameters: [{ name: "id", in: "path", required: true }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              example: {
                kandangId: "id_mst_kandang_2",
                tanggal: "2024-01-03",
                jumlahAyam: 100,
              },
            },
          },
        },
        responses: {
          200: { description: "Ayam masuk berhasil diperbarui" },
          400: { description: "Validasi gagal / stok negatif" },
        },
      },
    },
    "/api/ayam/kematian": {
      get: {
        summary: "Ambil riwayat kematian ayam",
        tags: ["Ayam"],
        responses: {
          200: {
            description: "Daftar kematian ayam",
            content: {
              "application/json": {
                example: {
                  success: true,
                  message: "Riwayat kematian ayam berhasil diambil",
                  data: [
                    {
                      id: "km1",
                      kandangId: "id_mst_kandang_1",
                      tanggal: "2024-01-05T00:00:00.000Z",
                      jumlahMati: 3,
                      keterangan: "Sakit",
                    },
                  ],
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Catat kematian ayam (Akses: super_user, staff)",
        tags: ["Ayam"],
        description: "Akses: super_user, staff",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              example: {
                kandangId: "id_mst_kandang_1",
                tanggal: "2024-01-06",
                jumlahMati: 2,
                keterangan: "Stres panas",
              },
            },
          },
        },
        responses: {
          201: { description: "Kematian ayam berhasil dicatat" },
          400: { description: "Validasi gagal / stok ayam kurang" },
        },
      },
      put: {
        summary: "Update kematian ayam (Akses: super_user, staff)",
        tags: ["Ayam"],
        description: "Akses: super_user, staff",
        parameters: [{ name: "id", in: "path", required: true }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              example: {
                kandangId: "id_mst_kandang_2",
                tanggal: "2024-01-07",
                jumlahMati: 1,
                keterangan: "Revisi data",
              },
            },
          },
        },
        responses: {
          200: { description: "Kematian ayam berhasil diperbarui" },
          400: { description: "Validasi gagal / stok ayam kurang" },
        },
      },
    },
    "/api/telur/produksi": {
      get: {
        summary: "Ambil produksi telur",
        tags: ["Telur"],
        responses: {
          200: {
            description: "Daftar produksi telur",
            content: {
              "application/json": {
                example: {
                  success: true,
                  message: "Produksi telur berhasil diambil",
                  data: [
                    {
                      id: "id_trx_produksi_telur_1",
                      kandangId: "id_mst_kandang_1",
                      tanggal: "2024-01-01T00:00:00.000Z",
                      jumlahBagusButir: 100,
                      jumlahTidakBagusButir: 5,
                      totalButir: 105,
                      totalKg: 6.5,
                    },
                  ],
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Catat produksi telur per kandang per tanggal (Akses: super_user, staff)",
        tags: ["Telur"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              example: {
                kandangId: "id_mst_kandang_1",
                tanggal: "2024-01-02",
                jumlahBagusButir: 110,
                jumlahTidakBagusButir: 4,
                totalKg: 6.8,
                keterangan: "Harian",
              },
            },
          },
        },
        responses: {
          201: { description: "Produksi telur berhasil dicatat" },
          400: { description: "Validasi gagal / duplikat tanggal" },
        },
      },
      put: {
        summary: "Update produksi telur (Akses: super_user, staff)",
        tags: ["Telur"],
        parameters: [{ name: "id", in: "path", required: true }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              example: {
                tanggal: "2024-01-03",
                jumlahBagusButir: 105,
                jumlahTidakBagusButir: 5,
                totalKg: 6.7,
                keterangan: "Revisi data",
              },
            },
          },
        },
        responses: {
          200: { description: "Produksi telur berhasil diperbarui" },
          400: { description: "Validasi gagal / stok tidak cukup" },
        },
      },
    },
    "/api/telur/penjualan": {
      get: {
        summary: "Ambil penjualan telur",
        tags: ["Telur"],
        responses: {
          200: {
            description: "Daftar penjualan telur",
            content: {
              "application/json": {
                example: {
                  success: true,
                  message: "Penjualan telur berhasil diambil",
                  data: [
                    {
                      id: "id_trx_penjualan_telur_1",
                      tanggal: "2024-01-03T00:00:00.000Z",
                      pembeli: "Pembeli A",
                      beratKg: 15,
                      hargaPerKg: 25000,
                      totalHarga: 375000,
                      uangMasuk: 375000,
                      uangKeluar: 0,
                      saldoAkhir: 1375000,
                      metodeBayar: "transfer",
                      keterangan: "Batch pagi",
                    },
                  ],
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Catat penjualan telur (Akses: super_user, staff)",
        tags: ["Telur"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              example: {
                tanggal: "2024-01-03",
                deskripsi: "Penjualan ke toko A",
                pembeli: "Toko A",
                beratKg: 15,
                hargaPerKg: 25000,
                uangKeluar: 0,
                metodeBayar: "transfer",
              },
            },
          },
        },
        responses: {
          201: { description: "Penjualan telur berhasil dicatat" },
          400: { description: "Validasi gagal / stok tidak cukup" },
        },
      },
      put: {
        summary: "Update penjualan telur (Akses: super_user, staff)",
        tags: ["Telur"],
        parameters: [{ name: "id", in: "path", required: true }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              example: {
                tanggal: "2024-01-04",
                pembeli: "Toko B",
                beratKg: 12,
                hargaPerKg: 25500,
                metodeBayar: "cash",
              },
            },
          },
        },
        responses: {
          200: { description: "Penjualan telur berhasil diperbarui" },
          400: { description: "Validasi gagal / stok tidak cukup" },
        },
      },
    },
    "/api/telur/penjualan/{id}": {
      delete: {
        summary: "Hapus penjualan telur (Akses: super_user, staff)",
        tags: ["Telur"],
        parameters: [{ name: "id", in: "path", required: true }],
        responses: {
          200: { description: "Penjualan telur berhasil dihapus" },
          404: { description: "Tidak ditemukan" },
        },
      },
    },
    "/api/telur/stock": {
      get: {
        summary: "Ambil stok telur harian",
        tags: ["Telur"],
        responses: {
          200: {
            description: "Daftar stok telur",
            content: {
              "application/json": {
                example: {
                  success: true,
                  message: "Stok telur berhasil diambil",
                  data: [
                    {
                      id: "id_trx_stock_telur_1",
                      tanggal: "2024-01-03T00:00:00.000Z",
                      stockButir: 300,
                      stockKg: 18.5,
                      keterangan: null,
                    },
                  ],
                },
              },
            },
          },
        },
      },
    },
    "/api/kandang": {
      get: {
        summary: "Ambil semua kandang",
        tags: ["Kandang"],
        responses: {
          200: {
            description: "Daftar kandang",
            content: {
              "application/json": {
                example: {
                  success: true,
                  message: "Daftar kandang berhasil diambil",
                  data: [
                    { id: "k1", kode: "KDG1", nama: "Kandang 1", status: "aktif", jumlahAyam: 0 },
                  ],
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Buat kandang (Akses: super_user, staff)",
        tags: ["Kandang"],
        description: "Akses: super_user, staff",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              example: {
                kode: "KDG1",
                nama: "Kandang 1",
                lokasi: "Blok A",
                status: "aktif",
                keterangan: "Catatan",
              },
            },
          },
        },
        responses: {
          201: {
            description: "Kandang dibuat",
            content: {
              "application/json": {
                example: {
                  success: true,
                  message: "Kandang berhasil dibuat",
                  data: {
                    id: "k1",
                    kode: "KDG1",
                    nama: "Kandang 1",
                    lokasi: "Blok A",
                    status: "aktif",
                    jumlahAyam: 0,
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/kandang/{id}": {
      get: {
        summary: "Ambil detail kandang",
        tags: ["Kandang"],
        parameters: [{ name: "id", in: "path", required: true }],
        responses: {
          200: { description: "OK" },
          404: { description: "Tidak ditemukan" },
        },
      },
      put: {
        summary: "Update kandang (Akses: super_user, staff)",
        tags: ["Kandang"],
        description: "Akses: super_user, staff",
        parameters: [{ name: "id", in: "path", required: true }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              example: {
                nama: "Kandang 1",
                status: "maintenance",
              },
            },
          },
        },
        responses: {
          200: { description: "Berhasil diperbarui" },
        },
      },
      delete: {
        summary: "Hapus kandang (Akses: super_user, staff)",
        tags: ["Kandang"],
        description: "Akses: super_user, staff",
        parameters: [{ name: "id", in: "path", required: true }],
        responses: {
          200: { description: "Berhasil dihapus" },
          404: { description: "Tidak ditemukan" },
        },
      },
    },
    "/api/jenis-pakan": {
      get: {
        summary: "Ambil semua jenis pakan",
        tags: ["Jenis Pakan"],
        responses: {
          200: {
            description: "Daftar jenis pakan",
            content: {
              "application/json": {
                example: {
                  success: true,
                  message: "Daftar jenis pakan berhasil diambil",
                  data: [{ id: "p1", kode: "JG001", nama: "JAGUNG", satuan: "KG", isActive: true }],
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Buat jenis pakan (Akses: super_user, staff)",
        tags: ["Jenis Pakan"],
        description: "Akses: super_user, staff",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              example: {
                kode: "JG001",
                nama: "JAGUNG",
                satuan: "KG",
                keterangan: "Jagung giling",
                isActive: true,
              },
            },
          },
        },
        responses: {
          201: {
            description: "Jenis pakan dibuat",
          },
        },
      },
    },
    "/api/jenis-pakan/{id}": {
      get: {
        summary: "Ambil detail jenis pakan",
        tags: ["Jenis Pakan"],
        parameters: [{ name: "id", in: "path", required: true }],
        responses: { 200: { description: "OK" }, 404: { description: "Tidak ditemukan" } },
      },
      put: {
        summary: "Update jenis pakan (Akses: super_user, staff)",
        tags: ["Jenis Pakan"],
        description: "Akses: super_user, staff",
        parameters: [{ name: "id", in: "path", required: true }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              example: {
                nama: "JAGUNG PREMIUM",
                isActive: true,
              },
            },
          },
        },
        responses: { 200: { description: "Berhasil diperbarui" } },
      },
      delete: {
        summary: "Hapus jenis pakan (Akses: super_user, staff)",
        tags: ["Jenis Pakan"],
        description: "Akses: super_user, staff",
        parameters: [{ name: "id", in: "path", required: true }],
        responses: { 200: { description: "Berhasil dihapus" }, 404: { description: "Tidak ditemukan" } },
      },
    },
    "/api/users": {
      get: {
        summary: "Ambil semua user",
        tags: ["Users"],
        responses: {
          200: {
            description: "Daftar user",
            content: {
              "application/json": {
                example: {
                  success: true,
                  message: "Daftar user berhasil diambil",
                  data: [{ id: "u1", username: "superuser", name: "Administrator", role: "super_user", isActive: true }],
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Buat user",
        tags: ["Users"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              example: {
                username: "staf1",
                name: "Staf Satu",
                password: "password123",
                role: "staff",
                isActive: true,
              },
            },
          },
        },
        responses: { 201: { description: "User dibuat" } },
      },
    },
    "/api/users/{id}": {
      delete: {
        summary: "Hapus user",
        tags: ["Users"],
        parameters: [{ name: "id", in: "path", required: true }],
        responses: {
          200: { description: "Berhasil dihapus" },
          404: { description: "Tidak ditemukan" },
        },
      },
    },
    "/api/pakan/pembelian": {
      get: {
        summary: "Ambil pembelian pakan",
        tags: ["Pakan"],
        responses: {
          200: {
            description: "Daftar pembelian pakan",
            content: {
              "application/json": {
                example: {
                  success: true,
                  message: "Pembelian pakan berhasil diambil",
                  data: [
                    {
                      id: "id_trx_pembelian_pakan_1",
                      jenisPakanId: "id_mst_jenis_pakan_1",
                      tanggalBeli: "2024-01-01T00:00:00.000Z",
                      jumlahKg: 100,
                      hargaPerKg: 7500,
                      totalHarga: 750000,
                      sisaStokKg: 100,
                      keterangan: "Batch awal",
                    },
                  ],
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Catat pembelian pakan (Akses: super_user, staff)",
        tags: ["Pakan"],
        description: "Akses: super_user, staff",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              example: {
                jenisPakanId: "id_mst_jenis_pakan_1",
                tanggalBeli: "2024-01-02",
                jumlahKg: 120,
                hargaPerKg: 8000,
                keterangan: "Supplier A",
              },
            },
          },
        },
        responses: {
          201: { description: "Pembelian pakan berhasil dicatat" },
          400: { description: "Validasi gagal / jenis pakan tidak ditemukan" },
        },
      },
      put: {
        summary: "Update pembelian pakan (Akses: super_user, staff)",
        tags: ["Pakan"],
        description: "Akses: super_user, staff",
        parameters: [{ name: "id", in: "path", required: true }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              example: {
                tanggalBeli: "2024-01-05",
                jumlahKg: 150,
                hargaPerKg: 7800,
                keterangan: "Revisi harga",
              },
            },
          },
        },
        responses: {
          200: { description: "Pembelian pakan berhasil diperbarui" },
          400: { description: "Validasi gagal / stok terpakai melebihi jumlah baru" },
        },
      },
    },
    "/api/pakan/pemakaian": {
      get: {
        summary: "Ambil pemakaian pakan",
        tags: ["Pakan"],
        responses: {
          200: {
            description: "Daftar pemakaian pakan",
            content: {
              "application/json": {
                example: {
                  success: true,
                  message: "Pemakaian pakan berhasil diambil",
                  data: [
                    {
                      id: "id_trx_pemakaian_pakan_1",
                      kandangId: "id_mst_kandang_1",
                      jenisPakanId: "id_mst_jenis_pakan_1",
                      pembelianPakanId: "id_trx_pembelian_pakan_1",
                      tanggalPakai: "2024-01-03T00:00:00.000Z",
                      jumlahKg: 15,
                      hargaPerKg: 8000,
                      totalBiaya: 120000,
                      keterangan: "Pagi",
                    },
                  ],
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Catat pemakaian pakan (per batch pembelian) (Akses: super_user, staff)",
        tags: ["Pakan"],
        description: "Akses: super_user, staff",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              example: {
                kandangId: "id_mst_kandang_1",
                jenisPakanId: "id_mst_jenis_pakan_1",
                pembelianPakanId: "id_trx_pembelian_pakan_1",
                tanggalPakai: "2024-01-03",
                jumlahKg: 15,
                keterangan: "Pagi",
              },
            },
          },
        },
        responses: {
          201: { description: "Pemakaian pakan berhasil dicatat" },
          400: { description: "Validasi gagal / stok batch tidak cukup" },
        },
      },
      put: {
        summary: "Update pemakaian pakan (Akses: super_user, staff)",
        tags: ["Pakan"],
        description: "Akses: super_user, staff",
        parameters: [{ name: "id", in: "path", required: true }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              example: {
                kandangId: "id_mst_kandang_1",
                jenisPakanId: "id_mst_jenis_pakan_1",
                pembelianPakanId: "id_trx_pembelian_pakan_1",
                tanggalPakai: "2024-01-04",
                jumlahKg: 18,
                keterangan: "Revisi pemakaian",
              },
            },
          },
        },
        responses: {
          200: { description: "Pemakaian pakan berhasil diperbarui" },
          400: { description: "Validasi gagal / stok batch tidak cukup" },
        },
      },
    },
    "/api/pakan/rekap": {
      get: {
        summary: "Rekap pakan per jenis per bulan",
        tags: ["Pakan"],
        parameters: [
          { name: "bulan", in: "query", required: true, description: "Format YYYY-MM" },
          { name: "jenisPakanId", in: "query", required: false },
          { name: "harian", in: "query", required: false, description: "true untuk detail per hari" },
          { name: "byKandang", in: "query", required: false, description: "true untuk rekap per kandang" },
        ],
        responses: {
          200: {
            description: "Rekap pakan",
            content: {
              "application/json": {
                example: {
                  success: true,
                  message: "Rekap pakan berhasil diambil",
                  data: {
                    periode: { start: "2025-11-01T00:00:00.000Z", end: "2025-12-01T00:00:00.000Z" },
                    rekap: [
                      {
                        jenisPakanId: "id_mst_jenis_pakan_1",
                        kode: "JG001",
                        nama: "JAGUNG",
                        stokAwalKg: 160,
                        masukKg: 680,
                        masukRp: 5_746_000,
                        keluarKg: 840,
                        stokAkhirKg: 0,
                        hargaRataKg: 6840.48,
                        konsumsiRp: 5_746_000,
                      },
                    ],
                    total: {
                      stokAwalKg: 160,
                      masukKg: 680,
                      masukRp: 5_746_000,
                      keluarKg: 840,
                      stokAkhirKg: 0,
                      konsumsiRp: 5_746_000,
                    },
                    summary: {
                      days: 30,
                      jumlahAyam: 965,
                      totalKeluarKg: 840,
                      totalKonsumsiRp: 5_746_000,
                      hargaRataKgGabungan: 6840.48,
                      konsumsiPerHariKg: 28,
                      konsumsiPerEkorKg: 0.87,
                      konsumsiPerEkorGram: 870,
                      biayaPerEkor: 5955,
                      biayaPerHari: 191533.33,
                    },
                    daily: [
                      {
                        tanggal: "2025-11-01",
                        stokAwalKg: 160,
                        masukKg: 0,
                        masukRp: 0,
                        keluarKg: 0,
                        keluarRp: 0,
                        stokAkhirKg: 160,
                      },
                    ],
                    byKandang: [
                      {
                        kandangId: "id_mst_kandang_1",
                        kode: "KDG1",
                        nama: "Kandang 1",
                        jumlahAyam: 965,
                        keluarKg: 200,
                        konsumsiRp: 1_368_096,
                        konsumsiPerHariKg: 6.67,
                        konsumsiPerEkorKg: 0.207,
                        konsumsiPerEkorGram: 207,
                        biayaPerEkor: 1418.86,
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/keuangan/pengeluaran": {
      get: {
        summary: "Ambil pengeluaran operasional",
        tags: ["Keuangan"],
        responses: {
          200: {
            description: "Daftar pengeluaran operasional",
            content: {
              "application/json": {
                example: {
                  success: true,
                  message: "Pengeluaran operasional berhasil diambil",
                  data: [
                    {
                      id: "id_trx_pengeluaran_operasional_1",
                      tanggal: "2024-01-05T00:00:00.000Z",
                      kategori: "Listrik",
                      jumlah: 500000,
                      keterangan: "Tagihan bulan Jan",
                      bukti: "bukti.jpg",
                    },
                  ],
                },
              },
            },
          },
        },
      },
    },
    "/api/keuangan/pengeluaran/{id}": {
      put: {
        summary: "Update pengeluaran operasional (Akses: super_user, staff)",
        tags: ["Keuangan"],
        parameters: [{ name: "id", in: "path", required: true }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              example: {
                tanggal: "2024-01-06",
                kategori: "Gaji",
                jumlah: 2100000,
                keterangan: "Revisi gaji",
              },
            },
          },
        },
        responses: {
          200: { description: "Pengeluaran operasional berhasil diperbarui" },
          400: { description: "Validasi gagal" },
        },
      },
    },
    "/api/keuangan/transaksi": {
      get: {
        summary: "Ambil semua transaksi keuangan (buku besar)",
        tags: ["Keuangan"],
        parameters: [
          { name: "startDate", in: "query", required: false },
          { name: "endDate", in: "query", required: false },
          { name: "jenis", in: "query", required: false, description: "pemasukan/pengeluaran" },
          { name: "kategori", in: "query", required: false },
          { name: "referensiType", in: "query", required: false, description: "penjualan_telur/pembelian_pakan/pemakaian_pakan/operasional" },
        ],
        responses: {
          200: {
            description: "Daftar transaksi keuangan",
            content: {
              "application/json": {
                example: {
                  success: true,
                  message: "Transaksi keuangan berhasil diambil",
                  data: [
                    {
                      id: "id_trx_transaksi_keuangan_1",
                      tanggal: "2024-01-03T00:00:00.000Z",
                      jenis: "pemasukan",
                      kategori: "penjualan_telur",
                      jumlah: 375000,
                      keterangan: "Penjualan telur - TRX-TELUR-123",
                      referensiId: "id_trx_penjualan_telur_1",
                      referensiType: "penjualan_telur",
                    },
                  ],
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Catat transaksi keuangan manual (Akses: super_user, staff)",
        tags: ["Keuangan"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              example: {
                tanggal: "2024-01-05",
                jenis: "pengeluaran",
                kategori: "operasional",
                jumlah: 500000,
                keterangan: "Vaksinasi ayam",
              },
            },
          },
        },
        responses: {
          201: { description: "Transaksi keuangan berhasil dicatat" },
          400: { description: "Validasi gagal" },
        },
      },
    },
    "/api/keuangan/transaksi/{id}": {
      put: {
        summary: "Update transaksi keuangan (Akses: super_user, staff)",
        tags: ["Keuangan"],
        parameters: [{ name: "id", in: "path", required: true }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              example: {
                tanggal: "2024-01-06",
                jenis: "pengeluaran",
                kategori: "operasional",
                jumlah: 600000,
                keterangan: "Revisi biaya vaksin",
              },
            },
          },
        },
        responses: {
          200: { description: "Transaksi keuangan berhasil diperbarui" },
          400: { description: "Validasi gagal" },
        },
      },
      delete: {
        summary: "Hapus transaksi keuangan (Akses: super_user, staff)",
        tags: ["Keuangan"],
        parameters: [{ name: "id", in: "path", required: true }],
        responses: {
          200: { description: "Transaksi keuangan berhasil dihapus" },
          404: { description: "Tidak ditemukan" },
        },
      },
    },
  },
};

export const GET = () => NextResponse.json(openapiSpec);
