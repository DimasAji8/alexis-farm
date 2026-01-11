import { useQuery } from "@tanstack/react-query";
import { fetchStokTelurList } from "./api";

export function useStokTelurList(kandangId?: string | null) {
  return useQuery({
    queryKey: ["stok-telur", kandangId],
    queryFn: () => fetchStokTelurList(kandangId),
    staleTime: 5 * 60 * 1000,
    enabled: !!kandangId,
  });
}
