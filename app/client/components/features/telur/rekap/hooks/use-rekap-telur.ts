import { useQuery } from "@tanstack/react-query";
import { fetchRekapHarian } from "./api";

export function useRekapTelurHarian(kandangId: string | null, bulan: string) {
  return useQuery({
    queryKey: ["rekap-telur-harian", kandangId, bulan],
    queryFn: () => fetchRekapHarian(kandangId!, bulan),
    enabled: !!kandangId && !!bulan,
    staleTime: 5 * 60 * 1000,
  });
}
