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
