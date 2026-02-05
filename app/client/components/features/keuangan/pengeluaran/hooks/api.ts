export const API_ENDPOINTS = {
  getAll: (bulan?: string) => bulan ? `/api/keuangan/pengeluaran?bulan=${bulan}` : "/api/keuangan/pengeluaran",
  create: "/api/keuangan/pengeluaran",
  update: (id: string) => `/api/keuangan/pengeluaran/${id}`,
  delete: (id: string) => `/api/keuangan/pengeluaran/${id}`,
};
