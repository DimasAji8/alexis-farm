"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DataStats, type StatItem } from "@/components/shared/data-stats";
import { DataFilters, type FilterConfig } from "@/components/shared/data-filters";
import { styles } from "@/lib/styles";

import { useLaporanKeuangan } from "../hooks/use-laporan";

const formatDate = (value: string) => {
  return new Date(value).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
};

const formatCurrency = (value: number) => `Rp ${value.toLocaleString("id-ID")}`;

const filterConfig: FilterConfig[] = [
  { key: "bulan", label: "Bulan", type: "month" },
];

export function LaporanKeuanganPage() {
  const [filters, setFilters] = useState<Record<string, string | null>>({});

  const bulan = useMemo(() => {
    if (filters.bulan_year && filters.bulan_month != null) {
      const monthNum = String(Number(filters.bulan_month) + 1).padStart(2, "0");
      return `${filters.bulan_year}-${monthNum}`;
    }
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  }, [filters]);

  const { data, isLoading, isError, error } = useLaporanKeuangan(bulan);

  const { stats, transaksiGrouped } = useMemo(() => {
    if (!data) {
      return {
        stats: [
          { label: "Saldo Awal", value: "Rp 0", color: "slate" as const },
          { label: "Total Pemasukan", value: "Rp 0", color: "emerald" as const },
          { label: "Total Pengeluaran", value: "Rp 0", color: "rose" as const },
          { label: "Saldo Akhir", value: "Rp 0", color: "blue" as const },
        ],
        transaksiGrouped: [],
      };
    }

    const stats: StatItem[] = [
      { label: "Saldo Awal", value: formatCurrency(data.summary.saldoAwal), color: "slate" },
      { label: "Total Pemasukan", value: formatCurrency(data.summary.totalPemasukan), color: "emerald" },
      { label: "Total Pengeluaran", value: formatCurrency(data.summary.totalPengeluaran), color: "rose" },
      { label: "Saldo Akhir", value: formatCurrency(data.summary.saldoAkhir), color: "blue" },
    ];

    // Group transaksi per tanggal
    const grouped = new Map<string, typeof data.transaksi>();
    data.transaksi.forEach((t) => {
      const dateKey = new Date(t.tanggal).toISOString().split("T")[0];
      if (!grouped.has(dateKey)) {
        grouped.set(dateKey, []);
      }
      grouped.get(dateKey)!.push(t);
    });

    // Hitung saldo per grup tanggal
    let saldo = data.summary.saldoAwal;
    const transaksiGrouped = Array.from(grouped.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([dateKey, items]) => {
        const totalDebit = items.filter((t) => t.jenis === "pemasukan").reduce((sum, t) => sum + t.jumlah, 0);
        const totalKredit = items.filter((t) => t.jenis === "pengeluaran").reduce((sum, t) => sum + t.jumlah, 0);
        saldo = saldo + totalDebit - totalKredit;
        
        return {
          tanggal: dateKey,
          items,
          totalDebit,
          totalKredit,
          saldo,
        };
      });

    return { stats, transaksiGrouped };
  }, [data]);

  if (isError) {
    return (
      <section className="space-y-6">
        <div>
          <div className={styles.pageHeader.eyebrow}>Keuangan</div>
          <h1 className={styles.pageHeader.title}>Laporan Keuangan</h1>
        </div>
        <Card className="p-6 text-center">
          <p className="text-red-500 mb-4">{error instanceof Error ? error.message : "Terjadi kesalahan"}</p>
        </Card>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div>
        <div className={styles.pageHeader.eyebrow}>Keuangan</div>
        <h1 className={styles.pageHeader.title}>Laporan Keuangan</h1>
        <p className={styles.pageHeader.description}>Buku besar dan ringkasan keuangan bulanan</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-6">
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-8 w-24" />
            </Card>
          ))}
        </div>
      ) : (
        <DataStats stats={stats} columns={4} />
      )}

      <DataFilters config={filterConfig} onFilterChange={setFilters} />

      <Card className="p-4 sm:p-6">
        <div className="flex flex-col rounded-lg overflow-hidden" style={{ height: "600px" }}>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-slate-900 text-white z-10 border-b">
                <tr>
                  <th className="text-center p-3 font-medium">Tanggal</th>
                  <th className="text-left p-3 font-medium">Keterangan</th>
                  <th className="text-right p-3 font-medium">Debit (Masuk)</th>
                  <th className="text-right p-3 font-medium">Kredit (Keluar)</th>
                  <th className="text-right p-3 font-medium">Total</th>
                  <th className="text-right p-3 font-medium">Saldo</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="text-center p-4 text-muted-foreground">
                      Loading...
                    </td>
                  </tr>
                ) : transaksiGrouped.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center p-4 text-muted-foreground">
                      Tidak ada transaksi
                    </td>
                  </tr>
                ) : (
                  transaksiGrouped.map((group) => 
                    group.items.map((item, idx) => (
                      <tr key={`${group.tanggal}-${idx}`} className={`hover:bg-muted/50 ${idx === group.items.length - 1 ? 'border-b-2 border-slate-300 dark:border-slate-600' : ''}`}>
                        {idx === 0 && (
                          <td className="p-3 text-center align-middle border-x border-slate-200 dark:border-slate-700" rowSpan={group.items.length}>
                            {formatDate(group.tanggal)}
                          </td>
                        )}
                        <td className="p-3 border-x border-slate-200 dark:border-slate-700">{item.keterangan}</td>
                        <td className="p-3 text-right tabular-nums text-emerald-600 border-x border-slate-200 dark:border-slate-700">
                          {item.jenis === "pemasukan" ? formatCurrency(item.jumlah) : <span className="block text-center">-</span>}
                        </td>
                        <td className="p-3 text-right tabular-nums text-rose-600 border-x border-slate-200 dark:border-slate-700">
                          {item.jenis === "pengeluaran" ? formatCurrency(item.jumlah) : <span className="block text-center">-</span>}
                        </td>
                        {idx === 0 && (
                          <>
                            <td className="p-3 text-right tabular-nums font-medium border-x border-slate-200 dark:border-slate-700" rowSpan={group.items.length}>
                              {formatCurrency(group.totalDebit - group.totalKredit)}
                            </td>
                            <td className="p-3 text-right tabular-nums font-semibold border-x border-slate-200 dark:border-slate-700" rowSpan={group.items.length}>
                              {formatCurrency(group.saldo)}
                            </td>
                          </>
                        )}
                      </tr>
                    ))
                  )
                )}
              </tbody>
            </table>
          </div>
          {data && data.transaksi.length > 0 && (
            <div className="border-t-2 bg-slate-50 dark:bg-slate-800">
              <table className="w-full text-sm">
                <colgroup>
                  <col style={{ width: '12%' }} />
                  <col style={{ width: '35%' }} />
                  <col style={{ width: '13%' }} />
                  <col style={{ width: '13%' }} />
                  <col style={{ width: '13%' }} />
                  <col style={{ width: '14%' }} />
                </colgroup>
                <tfoot className="font-bold">
                  <tr>
                    <td className="p-3 text-center" colSpan={2}>TOTAL</td>
                    <td className="p-3 text-right text-emerald-600">{formatCurrency(data.summary.totalPemasukan)}</td>
                    <td className="p-3 text-right text-rose-600">{formatCurrency(data.summary.totalPengeluaran)}</td>
                    <td className="p-3 text-right">{formatCurrency(data.summary.totalPemasukan - data.summary.totalPengeluaran)}</td>
                    <td className="p-3 text-right">{formatCurrency(data.summary.saldoAkhir)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      </Card>
    </section>
  );
}
