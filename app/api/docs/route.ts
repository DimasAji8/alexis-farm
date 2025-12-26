import { NextResponse } from "next/server";

const openapiSpec = {
  openapi: "3.1.0",
  info: {
    title: "Alexis Farm API",
    version: "1.0.0",
    description: "Dokumentasi API untuk Auth, Kandang, Jenis Pakan, dan Users.",
  },
  servers: [{ url: "http://localhost:3000" }],
  paths: {
    "/api/auth/register": {
      post: {
        summary: "Register user baru",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              example: {
                username: "admin",
                name: "Administrator",
                password: "admin123!",
                role: "admin",
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
                    username: "admin",
                    name: "Administrator",
                    role: "admin",
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
        requestBody: {
          required: true,
          content: {
            "application/x-www-form-urlencoded": {
              example: {
                username: "admin",
                password: "admin123!",
                callbackUrl: "/client/dashboard",
              },
            },
            "application/json": {
              example: {
                username: "admin",
                password: "admin123!",
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
        summary: "Catat ayam masuk",
        tags: ["Ayam"],
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
        summary: "Catat kematian ayam",
        tags: ["Ayam"],
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
        summary: "Catat produksi telur per kandang per tanggal",
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
        summary: "Catat penjualan telur",
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
        summary: "Buat kandang",
        tags: ["Kandang"],
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
        summary: "Update kandang",
        tags: ["Kandang"],
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
        summary: "Hapus kandang",
        tags: ["Kandang"],
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
        summary: "Buat jenis pakan",
        tags: ["Jenis Pakan"],
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
        summary: "Update jenis pakan",
        tags: ["Jenis Pakan"],
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
        summary: "Hapus jenis pakan",
        tags: ["Jenis Pakan"],
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
                  data: [{ id: "u1", username: "admin", name: "Administrator", role: "admin", isActive: true }],
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
  },
};

export const GET = () => NextResponse.json(openapiSpec);
