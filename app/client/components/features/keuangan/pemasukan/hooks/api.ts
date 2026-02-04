export const API_ENDPOINTS = {
  getAll: "/api/keuangan/pemasukan",
  create: "/api/keuangan/pemasukan",
  update: (id: string) => `/api/keuangan/pemasukan/${id}`,
  delete: (id: string) => `/api/keuangan/pemasukan/${id}`,
};