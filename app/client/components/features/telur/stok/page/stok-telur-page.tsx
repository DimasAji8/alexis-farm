"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DataStats, type StatItem } from "@/components/shared/data-stats";
import { PageSkeleton } from "@/components/shared/page-skeleton";
import { DataFilters, type FilterConfig } from "@/components/shared/data-filters";
import { styles } from "@/lib/styles";
import { Package, ArrowRight } from "lucide-react";
import { useSelectedKandang } from "@/hooks/use-selected-kandang";

import { useStokTelurList } from "../hooks/use-stok-telur";
import { useProduktivitasList } from "../../produktivitas/hooks/use-produktivitas";
import { usePenjualanList } from "../../penjualan/hooks/use-penjualan";

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
  const { data: penjualanData } = usePenjualanList(selectedKandangId);
  const [filters, setFilters] = useState<Record<string, string | null>>({});

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

  // Map penjualan by tanggal untuk lookup cepat
  const penjualanByDate = useMemo(() => {
    if (!penjualanData) return new Map<string, number>();
    const map = new Map<string, number>();
    for (const p of penjualanData) {
      const dateKey = new Date(p.tanggal).toISOString().split("T")[0];
      const current = map.get(dateKey) || 0;
      map.set(dateKey, current + p.beratKg);
    }
    return map;
  }, [penjualanData]);

  const { filteredData, stats, latestStock } = useMemo(() => {
    if (!data || data.length === 0) return { filteredData: [], stats: [], latestStock: null };
    
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
    } else {
      // Jika tidak ada filter, stok awal = 0
      stokAwal = 0;
    }

    // Stok akhir adalah stok terakhir dari data yang difilter
    const stokAkhir = filtered.length > 0 ? filtered[filtered.length - 1].stockKg : stokAwal;

    // Hitung total masuk dan keluar dari filtered data
    let totalMasuk = 0;
    let totalKeluar = 0;
    
    filtered.forEach(item => {
      const dateKey = new Date(item.tanggal).toISOString().split("T")[0];
      const masuk = produksiByDate.get(dateKey) ?? 0;
      const keluar = penjualanByDate.get(dateKey) ?? 0;
      totalMasuk += masuk;
      totalKeluar += keluar;
    });

    const stats: StatItem[] = [
      { label: "Stok Awal", value: stokAwal.toLocaleString("id-ID") + " kg", color: "slate" },
      { label: "Total Masuk", value: totalMasuk.toLocaleString("id-ID") + " kg", color: "emerald" },
      { label: "Total Keluar", value: totalKeluar.toLocaleString("id-ID") + " kg", color: "rose" },
      { label: "Stok Saat Ini", value: stokAkhir.toLocaleString("id-ID") + " kg", color: "blue" },
    ];

    return { filteredData: filtered, stats, latestStock: filtered[filtered.length - 1] || null };
  }, [data, filters, produksiByDate, penjualanByDate]);

  const handleFilterChange = (f: Record<string, string | null>) => setFilters(f);

  if (isLoading && !data) {
    return <PageSkeleton eyebrow="Telur" title="Stok Telur" description="Pantau stok telur per kandang." statsCount={4} statsColumns={2} tableColumns={4} />;
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

      <DataStats stats={stats} columns={4} />
      <DataFilters config={filterConfig} onFilterChange={handleFilterChange} />

      <Card className="p-4 sm:p-6">
        <div className="flex flex-col rounded-lg overflow-hidden" style={{ height: '600px' }}>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-slate-900 text-white z-10 border-b">
                <tr>
                  <th className="text-left p-3 font-medium">Tanggal</th>
                  <th className="text-right p-3 font-medium">Masuk</th>
                  <th className="text-right p-3 font-medium">Keluar</th>
                  <th className="text-right p-3 font-medium">Stok</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={4} className="text-center p-4 text-muted-foreground">Loading...</td></tr>
                ) : filteredData.length === 0 ? (
                  <tr><td colSpan={4} className="text-center p-4 text-muted-foreground">Tidak ada data</td></tr>
                ) : (
                  filteredData.map((item) => {
                    const dateKey = new Date(item.tanggal).toISOString().split("T")[0];
                    const masuk = produksiByDate.get(dateKey) ?? 0;
                    const keluar = penjualanByDate.get(dateKey) ?? 0;
                    
                    return (
                      <tr key={item.id} className="border-b hover:bg-muted/50">
                        <td className="p-3">{formatDate(item.tanggal)}</td>
                        <td className="p-3 text-right tabular-nums text-emerald-600">
                          {masuk > 0 ? `+${masuk.toLocaleString("id-ID")} kg` : "-"}
                        </td>
                        <td className="p-3 text-right tabular-nums text-rose-600">
                          {keluar > 0 ? `-${keluar.toLocaleString("id-ID")} kg` : "-"}
                        </td>
                        <td className="p-3 text-right tabular-nums font-medium">
                          {item.stockKg.toLocaleString("id-ID")} kg
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </section>
  );
}
