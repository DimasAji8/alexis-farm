"use client";

import { useState } from "react";
import { ChevronsUpDown, Warehouse, Check, Globe } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useSidebar } from "@/components/ui/sidebar";
import { useKandangList } from "@/components/features/kandang/hooks/use-kandang";
import { useSelectedKandang } from "@/hooks/use-selected-kandang";
import { cn } from "@/lib/utils";

export function KandangSwitcher() {
  const [open, setOpen] = useState(false);
  const { state } = useSidebar();
  const { data: kandangList } = useKandangList();
  const { selectedKandangId, setSelectedKandangId } = useSelectedKandang();

  const currentKandang = kandangList?.find(k => k.id === selectedKandangId);
  const activeKandangs = kandangList?.filter(k => k.status === "aktif") || [];

  const isCollapsed = state === "collapsed";
  const isGlobal = selectedKandangId === null;

  const handleSelect = (id: string | null) => {
    setSelectedKandangId(id);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button 
          type="button"
          className={cn(
            "flex w-full items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm hover:bg-accent transition-colors",
            isCollapsed && "justify-center px-2"
          )}
        >
          {isGlobal ? (
            <Globe className="h-4 w-4 shrink-0 text-muted-foreground" />
          ) : (
            <Warehouse className="h-4 w-4 shrink-0 text-muted-foreground" />
          )}
          {!isCollapsed && (
            <>
              <span className="flex-1 text-left truncate text-muted-foreground">
                {currentKandang ? `${currentKandang.kode} - ${currentKandang.nama}` : "Semua Kandang"}
              </span>
              <ChevronsUpDown className="h-4 w-4 shrink-0 text-muted-foreground" />
            </>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent side={isCollapsed ? "right" : "bottom"} align="start" className="w-56 p-1">
        <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">Pilih Kandang</div>
        <div className="space-y-0.5">
          <button
            onClick={() => handleSelect(null)}
            className={cn(
              "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent transition-colors",
              isGlobal && "bg-accent"
            )}
          >
            <Globe className="h-4 w-4 text-muted-foreground" />
            <span className="flex-1 text-left">Semua Kandang</span>
            {isGlobal && <Check className="h-4 w-4" />}
          </button>
          {activeKandangs.map(kandang => (
            <button
              key={kandang.id}
              onClick={() => handleSelect(kandang.id)}
              className={cn(
                "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent transition-colors",
                selectedKandangId === kandang.id && "bg-accent"
              )}
            >
              <Warehouse className="h-4 w-4 text-muted-foreground" />
              <span className="flex-1 text-left truncate">{kandang.kode} - {kandang.nama}</span>
              {selectedKandangId === kandang.id && <Check className="h-4 w-4" />}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
