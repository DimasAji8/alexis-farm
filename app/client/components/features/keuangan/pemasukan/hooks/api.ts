export const API_ENDPOINTS = {
  getAll: (bulan?: string) => bulan ? `/api/keuangan/pemasukan?bulan=${bulan}` : "/api/keuangan/pemasukan",
  create: "/api/keuangan/pemasukan",
  update: (id: string) => `/api/keuangan/pemasukan/${id}`,
  delete: (id: string) => `/api/keuangan/pemasukan/${id}`,
};