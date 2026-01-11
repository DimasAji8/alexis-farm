"use client";

import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";

type KandangContextType = {
  selectedKandangId: string | null;
  setSelectedKandangId: (id: string | null) => void;
  isChanging: boolean;
};

const KandangContext = createContext<KandangContextType | null>(null);

export function KandangProvider({ children }: { children: ReactNode }) {
  const [selectedKandangId, setSelectedKandangIdState] = useState<string | null>(null);
  const [isChanging, setIsChanging] = useState(false);

  const setSelectedKandangId = useCallback((id: string | null) => {
    if (id === selectedKandangId) return;
    setIsChanging(true);
    setTimeout(() => {
      setSelectedKandangIdState(id);
      setIsChanging(false);
    }, 500);
  }, [selectedKandangId]);

  return (
    <KandangContext.Provider value={{ selectedKandangId, setSelectedKandangId, isChanging }}>
      {children}
    </KandangContext.Provider>
  );
}

export function useSelectedKandang() {
  const context = useContext(KandangContext);
  if (!context) throw new Error("useSelectedKandang must be used within KandangProvider");
  return context;
}
