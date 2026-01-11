"use client";

import { useEffect, useRef } from "react";
import { useKandangList } from "@/components/features/kandang/hooks/use-kandang";
import { useSelectedKandang } from "@/hooks/use-selected-kandang";

export function KandangAutoSelect() {
  const { data: kandangList } = useKandangList();
  const { selectedKandangId, setSelectedKandangId } = useSelectedKandang();
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current && selectedKandangId === null && kandangList && kandangList.length > 0) {
      const firstActive = kandangList.find(k => k.status === "aktif");
      if (firstActive) {
        setSelectedKandangId(firstActive.id);
        initialized.current = true;
      }
    }
  }, [kandangList, selectedKandangId, setSelectedKandangId]);

  return null;
}
