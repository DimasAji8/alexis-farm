"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { DataTable, type ColumnDef } from "@/components/shared/data-table";
import { DataStats, type StatItem } from "@/components/shared/data-stats";
import { styles } from "@/lib/styles";
import { Package, TrendingUp, TrendingDown, ArrowRight } from "lucide-react";

import { useStokTelurList } from "../hooks/use-stok-telur";
import type { StokTelur } from "../types";

const formatDate = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
};

export function StokTelurPage() {
  const { data, isLoading, isError, error, refetch } = useStokTelurList();

  const { latest, stats, trend } = useMemo(() => {
    if (!data || data.length === 0) return { latest: null, stats: [], trend: [] };
    
    const sorted = [...data].sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());
    const latest = sorted[0];
    const prev = sorted[1];
    
    const deltaButir = prev ? latest.stockButir - prev.stockButir : 0;
    const deltaKg = prev ? latest.stockKg - prev.stockKg : 0;

    const stats: StatItem[] = [
      { label: "Stok Saat Ini (Butir)", value: latest.stockButir.toLocaleString("id-ID"), color: "blue" },
      { label: "Stok Saat Ini (Kg)", value: `${latest.stockKg.toLocaleString("id-ID")} kg`, color: "emerald" },
      { label: "Perubahan Butir", value: `${deltaButir >= 0 ? "+" : ""}${deltaButir.toLocaleString("id-ID")}`, color: deltaButir >= 0 ? "emerald" : "rose" },
      { label: "Perubahan Kg", value: `${deltaKg >= 0 ? "+" : ""}${deltaKg.toLocaleString("id-ID")} kg`, color: deltaKg >= 0 ? "emerald" : "rose" },
    ];

    return { latest, stats, trend: sorted.slice(0, 10) };
  }, [data]);

  const columns: ColumnDef<StokTelur>[] = [
    { key: "tanggal", header: "Tanggal", className: styles.table.cellPrimary, render: (item) => formatDate(item.tanggal), skeleton: <Skeleton className="h-4 w-28" /> },
    { key: "stockButir", header: "Stok Butir", headerClassName: "text-right", className: `${styles.table.cellSecondary} text-right tabular-nums`, render: (item) => item.stockButir.toLocaleString("id-ID"), skeleton: <Skeleton className="h-4 w-16 ml-auto" /> },
    { key: "stockKg", header: "Stok Kg", headerClassName: "text-right", className: `${styles.table.cellPrimary} text-right tabular-nums font-medium`, render: (item) => `${item.stockKg.toLocaleString("id-ID")} kg`, skeleton: <Skeleton className="h-4 w-16 ml-auto" /> },
    { key: "keterangan", header: "Keterangan", headerClassName: "hidden md:table-cell", className: `${styles.table.cellTertiary} hidden md:table-cell`, render: (item) => item.keterangan || "-", skeleton: <Skeleton className="h-4 w-24" /> },
  ];

  if (isLoading && !data) {
    return (
      <section className="space-y-6">
        <div>
          <div className={styles.pageHeader.eyebrow}>Telur</div>
          <h1 className={styles.pageHeader.title}>Stok Telur</h1>
          <p className={styles.pageHeader.description}>Posisi stok telur hasil dari produksi dan penjualan.</p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[1,2,3,4].map((i) => <Card key={i} className="p-6"><Skeleton className="h-4 w-20 mb-2" /><Skeleton className="h-8 w-16" /></Card>)}
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
          <p className={styles.pageHeader.description}>Posisi stok telur hasil dari produksi dan penjualan.</p>
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
        <p className={styles.pageHeader.description}>Posisi stok telur hasil dari produksi dan penjualan. Data per {formatDate(latest?.tanggal)}.</p>
      </div>

      <DataStats stats={stats} columns={4} />

      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
          <TrendingUp className="h-4 w-4" />
          <span>Histori Stok (10 Terakhir)</span>
        </div>
        <DataTable data={trend} columns={columns} isLoading={isLoading} getRowKey={(item) => item.id} showActions={false} />
      </Card>

      <Card className="p-4 bg-muted/30">
        <p className="text-sm text-muted-foreground">
          <strong>Catatan:</strong> Stok dihitung otomatis dari produksi (masuk) dan penjualan (keluar). 
          Untuk menambah stok, input data di <a href="/client/dashboard/telur/produktivitas" className="text-primary underline">Produktivitas</a>. 
          Untuk mengurangi stok, catat di <a href="/client/dashboard/telur/penjualan" className="text-primary underline">Penjualan</a>.
        </p>
      </Card>
    </section>
  );
}
