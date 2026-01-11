"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { DataTable, type ColumnDef } from "@/components/shared/data-table";
import { DataStats, type StatItem } from "@/components/shared/data-stats";
import { DataFilters, type FilterConfig } from "@/components/shared/data-filters";
import { Pagination } from "@/components/shared/pagination";
import { styles } from "@/lib/styles";
import { Package, ArrowRight } from "lucide-react";
import { useSelectedKandang } from "@/hooks/use-selected-kandang";

import { useStokTelurList } from "../hooks/use-stok-telur";
import { useProduktivitasList } from "../../produktivitas/hooks/use-produktivitas";
import type { StokTelur } from "../types";

const ITEMS_PER_PAGE = 10;

const formatDate = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
};

const filterConfig: FilterConfig[] = [
  { key: "bulan", label: "Bulan", type: "month" },
];

export function StokTelurPage() {
  const { selectedKandangId } = useSelectedKandang();
  const { data, isLoading, isError, error, refetch } = useStokTelurList(selectedKandangId);
  const { data: produksiData } = useProduktivitasList(selectedKandangId);
  const [filters, setFilters] = useState<Record<string, string | null>>({});
  const [currentPage, setCurrentPage] = useState(1);

  // Map produksi by tanggal untuk lookup cepat
  const produksiByDate = useMemo(() => {
    if (!produksiData) return new Map<string, number>();
    const map = new Map<string, number>();
    for (const p of produksiData) {
      const dateKey = new Date(p.tanggal).toISOString().split("T")[0];
      map.set(dateKey, p.totalKg);
    }
    return map;
  }, [produksiData]);

  const { filteredData, stats, latestStock } = useMemo(() => {
    if (!data || data.length === 0) return { filteredData: [], stats: [], latestStock: null };
    
    // Data sudah sorted asc dari API, jadi index terakhir adalah yang terbaru
    const latestStock = data[data.length - 1];
    
    // Filter bulan yang dipilih
    const month = filters.bulan_month != null ? Number(filters.bulan_month) : null;
    const year = filters.bulan_year != null ? Number(filters.bulan_year) : null;
    
    const filtered = data.filter(item => {
      if (month !== null && year !== null) {
        const date = new Date(item.tanggal);
        if (date.getMonth() !== month || date.getFullYear() !== year) return false;
      }
      return true;
    });

    // Cari stok awal bulan (stok terakhir bulan sebelumnya)
    let stokAwal = 0;
    if (month !== null && year !== null) {
      const prevMonth = month === 0 ? 11 : month - 1;
      const prevYear = month === 0 ? year - 1 : year;
      
      // Filter data bulan sebelumnya dan ambil yang terakhir (data sudah sorted asc)
      const prevMonthStocks = data.filter(item => {
        const d = new Date(item.tanggal);
        return d.getMonth() === prevMonth && d.getFullYear() === prevYear;
      });
      
      if (prevMonthStocks.length > 0) {
        stokAwal = prevMonthStocks[prevMonthStocks.length - 1].stockKg;
      }
    }

    const stats: StatItem[] = [
      { label: "Stok Awal", value: stokAwal.toLocaleString("id-ID") + " kg", color: "slate" },
      { label: "Stok Saat Ini", value: latestStock.stockKg.toLocaleString("id-ID") + " kg", color: "emerald" },
    ];

    return { filteredData: filtered, stats, latestStock };
  }, [data, filters]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const columns: ColumnDef<StokTelur>[] = [
    { key: "tanggal", header: "Tanggal", className: styles.table.cellPrimary, render: (item) => formatDate(item.tanggal), skeleton: <Skeleton className="h-4 w-24" /> },
    { key: "masuk", header: "Masuk", headerClassName: "text-right", className: `${styles.table.cellSecondary} text-right tabular-nums text-emerald-600`, render: (item) => {
      const dateKey = new Date(item.tanggal).toISOString().split("T")[0];
      const masuk = produksiByDate.get(dateKey) ?? 0;
      return masuk > 0 ? `+${masuk.toLocaleString("id-ID")} kg` : "-";
    }, skeleton: <Skeleton className="h-4 w-16 ml-auto" /> },
    { key: "stockKg", header: "Stok", headerClassName: "text-right", className: `${styles.table.cellPrimary} text-right tabular-nums font-medium`, render: (item) => `${item.stockKg.toLocaleString("id-ID")} kg`, skeleton: <Skeleton className="h-4 w-16 ml-auto" /> },
  ];

  const handleFilterChange = (f: Record<string, string | null>) => { setFilters(f); setCurrentPage(1); };

  if (isLoading && !data) {
    return (
      <section className="space-y-6">
        <div>
          <div className={styles.pageHeader.eyebrow}>Telur</div>
          <h1 className={styles.pageHeader.title}>Stok Telur</h1>
          <p className={styles.pageHeader.description}>Posisi stok telur per kandang.</p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[1,2,3].map((i) => <Card key={i} className="p-6"><Skeleton className="h-4 w-20 mb-2" /><Skeleton className="h-8 w-16" /></Card>)}
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="space-y-6">
        <div><div className={styles.pageHeader.eyebrow}>Telur</div><h1 className={styles.pageHeader.title}>Stok Telur</h1></div>
        <Card className="p-6 text-center">
          <p className="text-red-500 mb-4">{error instanceof Error ? error.message : "Terjadi kesalahan"}</p>
          <Button variant="outline" onClick={() => refetch()}>Coba lagi</Button>
        </Card>
      </section>
    );
  }

  if (!data || data.length === 0) {
    return (
      <section className="space-y-6">
        <div>
          <div className={styles.pageHeader.eyebrow}>Telur</div>
          <h1 className={styles.pageHeader.title}>Stok Telur</h1>
          <p className={styles.pageHeader.description}>Posisi stok telur per kandang.</p>
        </div>
        <Card className="p-12 text-center">
          <Package className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="font-medium text-lg mb-2">Belum Ada Data Stok</h3>
          <p className="text-muted-foreground text-sm mb-4">Stok akan otomatis tercatat saat ada input produksi telur.</p>
          <Button variant="outline" asChild>
            <a href="/client/dashboard/telur/produktivitas">
              Input Produksi <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </Card>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div>
        <div className={styles.pageHeader.eyebrow}>Telur</div>
        <h1 className={styles.pageHeader.title}>Stok Telur</h1>
        <p className={styles.pageHeader.description}>Posisi stok telur per kandang.</p>
      </div>

      <DataStats stats={stats} columns={2} />
      <DataFilters config={filterConfig} onFilterChange={handleFilterChange} />

      <Card className={styles.card.table}>
        <DataTable data={paginatedData} columns={columns} isLoading={isLoading} getRowKey={(item) => item.id} showActions={false} />
        {filteredData.length > 0 && <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={filteredData.length} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setCurrentPage} />}
      </Card>
    </section>
  );
}
