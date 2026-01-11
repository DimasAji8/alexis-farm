"use client";

import { useSelectedKandang } from "@/hooks/use-selected-kandang";
import { Loader } from "@/components/ui/loader";

export function KandangLoader() {
  const { isChanging } = useSelectedKandang();
  return isChanging ? <Loader /> : null;
}
