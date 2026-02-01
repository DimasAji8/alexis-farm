import { useQuery } from "@tanstack/react-query";
import type { TransaksiKeuangan, LaporanKeuanganSummary } from "../types";
import { API_ENDPOINTS } from "./api";

type LaporanResponse = {
  kandang: { id: string; kode: string; nama: string } | null;
  summary: LaporanKeuanganSummary;
  transaksi: TransaksiKeuangan[];
};

export function useLaporanKeuangan(bulan: string, kandangId?: string | null) {
  return useQuery<LaporanResponse>({
    queryKey: ["laporan-keuangan", bulan, kandangId],
    queryFn: async () => {
      const res = await fetch(API_ENDPOINTS.getLaporan(bulan, kandangId));
      if (!res.ok) throw new Error("Gagal mengambil data");
      const json = await res.json();
      return json.data;
    },
    enabled: !!bulan,
  });
}
