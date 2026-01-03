"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";

interface KandangFiltersProps {
  onFilterChange: (filters: {
    search: string;
    status: string | null;
  }) => void;
}

export function KandangFilters({ onFilterChange }: KandangFiltersProps) {
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const handleSearchChange = (value: string) => {
    setSearch(value);
    onFilterChange({ search: value, status: selectedStatus === "all" ? null : selectedStatus });
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    onFilterChange({ search, status: value === "all" ? null : value });
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedStatus("all");
    onFilterChange({ search: "", status: null });
  };

  const hasActiveFilters = search || selectedStatus !== "all";

  return (
    <Card className="border-slate-200 bg-gradient-to-r from-white to-slate-50/30 shadow-sm">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
          {/* Search Input */}
          <div className="flex-1 space-y-1.5">
            <label className="text-xs sm:text-sm font-medium text-slate-700">
              Cari Kandang
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Cari kode atau nama..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9 border-slate-200 focus:border-amber-500 focus:ring-amber-500/20 bg-white text-sm"
              />
            </div>
          </div>

          {/* Status Select */}
          <div className="space-y-1.5 w-full sm:w-40">
            <label className="text-xs sm:text-sm font-medium text-slate-700">
              Status
            </label>
            <Select value={selectedStatus} onValueChange={handleStatusChange}>
              <SelectTrigger className="border-slate-200 bg-white text-sm">
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="aktif">Aktif</SelectItem>
                <SelectItem value="tidak_aktif">Tidak Aktif</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-slate-500 hover:text-slate-700 hover:bg-slate-100 h-10 px-3"
            >
              <X className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Reset</span>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
