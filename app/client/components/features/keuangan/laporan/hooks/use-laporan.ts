import { useQuery } from "@tanstack/react-query";
import type { TransaksiKeuangan, LaporanKeuanganSummary } from "../types";
import { API_ENDPOINTS } from "./api";

type LaporanResponse = {
  summary: LaporanKeuanganSummary;
  transaksi: TransaksiKeuangan[];
};

export function useLaporanKeuangan(bulan: string) {
  return useQuery<LaporanResponse>({
    queryKey: ["laporan-keuangan", bulan],
    queryFn: async () => {
      const res = await fetch(API_ENDPOINTS.getLaporan(bulan));
      if (!res.ok) throw new Error("Gagal mengambil data");
      const json = await res.json();
      return json.data;
    },
    enabled: !!bulan,
  });
}
