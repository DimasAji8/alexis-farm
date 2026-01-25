"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { DataStats, type StatItem } from "@/components/shared/data-stats";
import { DataFilters, type FilterConfig } from "@/components/shared/data-filters";
import { useSelectedKandang } from "@/hooks/use-selected-kandang";
import { useRekapTelurHarian } from "../hooks/use-rekap-telur";
import { styles } from "@/lib/styles";

const formatDate = (value: string) => {
  return new Date(value).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
};

const formatCurrency = (value: number) => `Rp ${value.toLocaleString("id-ID")}`;

export function RekapTelurPage() {
  const { selectedKandangId } = useSelectedKandang();
  const [bulan, setBulan] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  const { data, isLoading } = useRekapTelurHarian(selectedKandangId, bulan);

  const filterConfig: FilterConfig[] = [
    { key: "bulan", label: "Bulan", type: "month" },
  ];

  const { summary, stats } = useMemo(() => {
    if (!data) {
      const emptySummary = { stokAwal: 0, totalMasuk: 0, totalKeluar: 0, stokAkhir: 0, totalPendapatan: 0 };
      return { 
        summary: emptySummary,
        stats: [
          { label: "Stok Awal", value: "0 kg", color: "slate" as const },
          { label: "Total Masuk", value: "0 kg", color: "emerald" as const },
          { label: "Total Keluar", value: "0 kg", color: "rose" as const },
          { label: "Stok Akhir", value: "0 kg", color: "blue" as const },
          { label: "Pendapatan", value: "Rp 0", color: "purple" as const },
        ]
      };
    }
    
    const stokAwal = data[0]?.stokAkhirKg - data[0]?.masukKg + data[0]?.keluarKg || 0;
    const totalMasuk = data.reduce((sum, d) => sum + d.masukKg, 0);
    const totalKeluar = data.reduce((sum, d) => sum + d.keluarKg, 0);
    const stokAkhir = data[data.length - 1]?.stokAkhirKg || 0;
    const totalPendapatan = data.reduce((sum, d) => 
      sum + d.penjualan.reduce((s, p) => s + p.totalHarga, 0), 0
    );

    const summary = { stokAwal, totalMasuk, totalKeluar, stokAkhir, totalPendapatan };
    const stats: StatItem[] = [
      { label: "Stok Awal", value: `${stokAwal.toFixed(1)} kg`, color: "slate" },
      { label: "Total Masuk", value: `${totalMasuk.toFixed(1)} kg`, color: "emerald" },
      { label: "Total Keluar", value: `${totalKeluar.toFixed(1)} kg`, color: "rose" },
      { label: "Stok Akhir", value: `${stokAkhir.toFixed(1)} kg`, color: "blue" },
      { label: "Pendapatan", value: formatCurrency(totalPendapatan), color: "purple" },
    ];

    return { summary, stats };
  }, [data]);

  const handleFilterChange = (f: Record<string, string | null>) => {
    const month = f.bulan_month;
    const year = f.bulan_year;
    
    if (month !== null && year !== null) {
      const monthNum = String(Number(month) + 1).padStart(2, "0");
      const newBulan = `${year}-${monthNum}`;
      setBulan(newBulan);
    }
  };

  return (
    <section className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Rekap Telur</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">Detail transaksi telur harian</p>
      </div>

      <DataStats stats={stats} columns={5} />
      <DataFilters 
        config={filterConfig} 
        onFilterChange={handleFilterChange}
      />

      <Card className="p-4 sm:p-6">
        <div className="flex flex-col rounded-lg overflow-hidden" style={{ height: '600px' }}>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-sm">
              <colgroup>
                <col style={{ width: '12.5%' }} />
                <col style={{ width: '12.5%' }} />
                <col style={{ width: '12.5%' }} />
                <col style={{ width: '12.5%' }} />
                <col style={{ width: '12.5%' }} />
                <col style={{ width: '12.5%' }} />
                <col style={{ width: '12.5%' }} />
                <col style={{ width: '12.5%' }} />
              </colgroup>
              <thead className="sticky top-0 bg-slate-900 text-white z-10 border-b">
                <tr>
                  <th className="text-center p-2 font-medium">Tanggal</th>
                  <th className="text-center p-2 font-medium">Stok Awal (kg)</th>
                  <th className="text-center p-2 font-medium">Masuk (kg)</th>
                  <th className="text-center p-2 font-medium">Keluar (kg)</th>
                  <th className="text-center p-2 font-medium">Stok Akhir (kg)</th>
                  <th className="text-center p-2 font-medium">Keterangan</th>
                  <th className="text-center p-2 font-medium">Harga/Kg</th>
                  <th className="text-center p-2 font-medium">Jumlah</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={8} className="text-center p-4 text-muted-foreground">Loading...</td></tr>
                ) : !data || data.length === 0 ? (
                  <tr><td colSpan={8} className="text-center p-4 text-muted-foreground">Tidak ada data</td></tr>
                ) : (
                  data.map((item, idx) => {
                    const stokAwal = idx === 0 
                      ? item.stokAkhirKg - item.masukKg + item.keluarKg 
                      : data[idx - 1].stokAkhirKg;
                    
                    if (item.penjualan.length === 0) {
                      return (
                        <tr key={item.tanggal} className="border-b hover:bg-muted/50">
                          <td className="p-2 text-center">{formatDate(item.tanggal)}</td>
                          <td className="p-2 text-center">{stokAwal.toFixed(1)}</td>
                          <td className="p-2 text-center text-emerald-600">{item.masukKg > 0 ? item.masukKg.toFixed(1) : "-"}</td>
                          <td className="p-2 text-center text-rose-600">-</td>
                          <td className="p-2 text-center font-medium">{item.stokAkhirKg.toFixed(1)}</td>
                          <td className="p-2 text-center">-</td>
                          <td className="p-2 text-center">-</td>
                          <td className="p-2 text-center">-</td>
                        </tr>
                      );
                    }

                    return item.penjualan.map((jual, jIdx) => (
                      <tr key={`${item.tanggal}-${jual.id}`} className="border-b hover:bg-muted/50">
                        {jIdx === 0 && (
                          <>
                            <td className="p-2 text-center" rowSpan={item.penjualan.length}>{formatDate(item.tanggal)}</td>
                            <td className="p-2 text-center" rowSpan={item.penjualan.length}>{stokAwal.toFixed(1)}</td>
                            <td className="p-2 text-center text-emerald-600" rowSpan={item.penjualan.length}>
                              {item.masukKg > 0 ? item.masukKg.toFixed(1) : "-"}
                            </td>
                            <td className="p-2 text-center text-rose-600" rowSpan={item.penjualan.length}>
                              {item.keluarKg.toFixed(1)}
                            </td>
                            <td className="p-2 text-center font-medium" rowSpan={item.penjualan.length}>
                              {item.stokAkhirKg.toFixed(1)}
                            </td>
                          </>
                        )}
                        <td className="p-2 text-center">{jual.pembeli}</td>
                        <td className="p-2 text-center">{formatCurrency(jual.hargaPerKg)}</td>
                        <td className="p-2 text-center">{formatCurrency(jual.totalHarga)}</td>
                      </tr>
                    ));
                  })
                )}
              </tbody>
            </table>
          </div>
          {data && data.length > 0 && (
            <div className="border-t-2 bg-background">
              <table className="w-full text-sm">
                <colgroup>
                  <col style={{ width: '12.5%' }} />
                  <col style={{ width: '12.5%' }} />
                  <col style={{ width: '12.5%' }} />
                  <col style={{ width: '12.5%' }} />
                  <col style={{ width: '12.5%' }} />
                  <col style={{ width: '12.5%' }} />
                  <col style={{ width: '12.5%' }} />
                  <col style={{ width: '12.5%' }} />
                </colgroup>
                <tfoot className="font-bold">
                  <tr>
                    <td className="p-2 text-center">TOTAL</td>
                    <td className="p-2 text-center">{summary.stokAwal.toFixed(1)}</td>
                    <td className="p-2 text-center text-emerald-600">{summary.totalMasuk.toFixed(1)}</td>
                    <td className="p-2 text-center text-rose-600">{summary.totalKeluar.toFixed(1)}</td>
                    <td className="p-2 text-center">{summary.stokAkhir.toFixed(1)}</td>
                    <td className="p-2 text-center"></td>
                    <td className="p-2 text-center"></td>
                    <td className="p-2 text-center">{formatCurrency(summary.totalPendapatan)}</td>
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
