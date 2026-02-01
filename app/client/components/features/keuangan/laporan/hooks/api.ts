export const API_ENDPOINTS = {
  getLaporan: (bulan: string, kandangId?: string | null) => {
    const params = new URLSearchParams({ bulan });
    if (kandangId) params.append("kandangId", kandangId);
    return `/api/keuangan/laporan?${params.toString()}`;
  },
};
