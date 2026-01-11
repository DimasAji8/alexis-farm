"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Filter, X } from "lucide-react";

export type FilterOption = { value: string; label: string };

export type FilterConfig = {
  key: string;
  label: string;
  type: "search" | "select" | "month";
  placeholder?: string;
  options?: FilterOption[];
};

const MONTHS = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

interface DataFiltersProps {
  config: FilterConfig[];
  onFilterChange: (filters: Record<string, string | null>) => void;
}

export function DataFilters({ config, onFilterChange }: DataFiltersProps) {
  const initialized = useRef(false);
  const [mounted, setMounted] = useState(false);
  const [currentMonth, setCurrentMonth] = useState("0");
  const [currentYear, setCurrentYear] = useState("2026");
  const [years, setYears] = useState<string[]>(["2026", "2025", "2024"]);

  useEffect(() => {
    const now = new Date();
    setCurrentMonth(String(now.getMonth()));
    setCurrentYear(String(now.getFullYear()));
    setYears(Array.from({ length: 3 }, (_, i) => String(now.getFullYear() - i)));
    setMounted(true);
  }, []);

  const getInitialState = () => {
    return config.reduce((acc, f) => {
      if (f.type === "month") {
        acc[`${f.key}_month`] = currentMonth;
        acc[`${f.key}_year`] = currentYear;
      } else {
        acc[f.key] = f.type === "select" ? "all" : "";
      }
      return acc;
    }, {} as Record<string, string>);
  };

  const [filters, setFilters] = useState<Record<string, string>>({});
  const [open, setOpen] = useState(false);

  // Initialize filters after mount
  useEffect(() => {
    if (mounted && !initialized.current) {
      const initial = getInitialState();
      setFilters(initial);
      emitChange(initial);
      initialized.current = true;
    }
  }, [mounted, currentMonth, currentYear]);

  const emitChange = (newFilters: Record<string, string>) => {
    const output: Record<string, string | null> = {};
    config.forEach((f) => {
      if (f.type === "month") {
        output[`${f.key}_month`] = newFilters[`${f.key}_month`];
        output[`${f.key}_year`] = newFilters[`${f.key}_year`];
      } else {
        const v = newFilters[f.key];
        output[f.key] = v === "all" || v === "" ? null : v;
      }
    });
    onFilterChange(output);
  };

  const handleChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    emitChange(newFilters);
  };

  const clear = () => {
    const initial = getInitialState();
    setFilters(initial);
    emitChange(initial);
  };

  // Count non-default filters
  const activeCount = Object.entries(filters).filter(([k, v]) => {
    const cfg = config.find((c) => c.key === k || k.startsWith(c.key + "_"));
    if (!cfg) return false;
    if (cfg.type === "month") {
      if (k === `${cfg.key}_month`) return v !== currentMonth;
      if (k === `${cfg.key}_year`) return v !== currentYear;
    }
    if (cfg.type === "select") return v !== "all";
    return v !== "";
  }).length;

  // Build summary label
  const getSummary = () => {
    if (!mounted) return "Filter";
    const parts: string[] = [];
    config.forEach(f => {
      if (f.type === "month") {
        const m = MONTHS[Number(filters[`${f.key}_month`] ?? 0)];
        const y = filters[`${f.key}_year`] ?? currentYear;
        parts.push(`${m} ${y}`);
      } else if (f.type === "select" && filters[f.key] !== "all") {
        const opt = f.options?.find(o => o.value === filters[f.key]);
        if (opt) parts.push(opt.label);
      }
    });
    return parts.length > 0 ? parts.join(" · ") : "Filter";
  };

  if (!mounted) {
    return (
      <Button variant="outline" size="sm" className="h-9 gap-2">
        <Filter className="h-4 w-4" />
        <span className="max-w-[200px] truncate">Filter</span>
      </Button>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 gap-2">
          <Filter className="h-4 w-4" />
          <span className="max-w-[200px] truncate">{getSummary()}</span>
          {activeCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
              {activeCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72" align="start">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Filter</span>
            {activeCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clear} className="h-7 px-2 text-xs">
                <X className="h-3 w-3 mr-1" />Reset
              </Button>
            )}
          </div>
          {config.map((f) => (
            <div key={f.key} className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">{f.label}</label>
              {f.type === "month" ? (
                <div className="flex gap-2">
                  <Select value={filters[`${f.key}_month`]} onValueChange={(v) => handleChange(`${f.key}_month`, v)}>
                    <SelectTrigger className="h-9 text-sm flex-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {MONTHS.map((name, i) => <SelectItem key={i} value={String(i)}>{name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={filters[`${f.key}_year`]} onValueChange={(v) => handleChange(`${f.key}_year`, v)}>
                    <SelectTrigger className="h-9 text-sm w-24"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {years.map((y) => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              ) : f.type === "search" ? (
                <Input
                  placeholder={f.placeholder || "Cari..."}
                  value={filters[f.key]}
                  onChange={(e) => handleChange(f.key, e.target.value)}
                  className="h-9 text-sm"
                />
              ) : (
                <Select value={filters[f.key]} onValueChange={(v) => handleChange(f.key, v)}>
                  <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua</SelectItem>
                    {f.options?.map((opt) => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              )}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
