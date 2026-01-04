"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, X } from "lucide-react";

export type FilterOption = { value: string; label: string };

export type FilterConfig = {
  key: string;
  label: string;
  type: "search" | "select";
  placeholder?: string;
  options?: FilterOption[];
};

interface DataFiltersProps {
  config: FilterConfig[];
  onFilterChange: (filters: Record<string, string | null>) => void;
}

export function DataFilters({ config, onFilterChange }: DataFiltersProps) {
  const initialState = config.reduce((acc, f) => ({ ...acc, [f.key]: f.type === "select" ? "all" : "" }), {} as Record<string, string>);
  const [filters, setFilters] = useState(initialState);

  const handleChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    const output = Object.fromEntries(
      Object.entries(newFilters).map(([k, v]) => [k, v === "all" || v === "" ? null : v])
    );
    onFilterChange(output);
  };

  const clear = () => {
    setFilters(initialState);
    onFilterChange(Object.fromEntries(config.map((f) => [f.key, null])));
  };

  const hasActive = Object.entries(filters).some(([k, v]) => {
    const cfg = config.find((c) => c.key === k);
    return cfg?.type === "select" ? v !== "all" : v !== "";
  });

  return (
    <Card className="border-slate-200 dark:border-slate-700 shadow-sm">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
          {config.map((f) =>
            f.type === "search" ? (
              <div key={f.key} className="flex-1 space-y-1.5">
                <label className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">{f.label}</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder={f.placeholder || "Cari..."}
                    value={filters[f.key]}
                    onChange={(e) => handleChange(f.key, e.target.value)}
                    className="pl-9 text-sm"
                  />
                </div>
              </div>
            ) : (
              <div key={f.key} className="space-y-1.5 w-full sm:w-40">
                <label className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">{f.label}</label>
                <Select value={filters[f.key]} onValueChange={(v) => handleChange(f.key, v)}>
                  <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua</SelectItem>
                    {f.options?.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )
          )}
          {hasActive && (
            <Button variant="ghost" size="sm" onClick={clear} className="h-10 px-3 text-slate-500 dark:text-slate-400">
              <X className="h-4 w-4 sm:mr-1" /><span className="hidden sm:inline">Reset</span>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
