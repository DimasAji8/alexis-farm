import { useQuery } from "@tanstack/react-query";
import { fetchStokTelurList } from "./api";

export function useStokTelurList(kandangId?: string | null, bulan?: string | null) {
  return useQuery({
    queryKey: ["stok-telur", kandangId, bulan],
    queryFn: () => fetchStokTelurList(kandangId, bulan),
    staleTime: 5 * 60 * 1000,
    enabled: !!kandangId,
  });
}
