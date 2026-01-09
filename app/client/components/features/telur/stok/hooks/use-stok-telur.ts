import { useQuery } from "@tanstack/react-query";
import { fetchStokTelurList } from "./api";

export function useStokTelurList() {
  return useQuery({ queryKey: ["stok-telur"], queryFn: fetchStokTelurList, staleTime: 0 });
}
