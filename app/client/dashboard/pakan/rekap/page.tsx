"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { DataStats, type StatItem } from "@/components/shared/data-stats";
import { DataFilters, type FilterConfig } from "@/components/shared/data-filters";
import { useApiList } from "@/hooks/use-api";

const formatDate = (value: string) => new Date(value).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
const formatCurrency = (value: number) => `Rp ${(value || 0).toLocaleString("id-ID")}`;

export default function RekapPakanPage() {
  const [bulan, setBulan] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [jenisPakanId, setJenisPakanId] = useState<string>("");

  const { data: jenisPakan = [] } = useApiList<any>("/api/jenis-pakan?active=true");

  // Fetch rekap from backend
  const rekapUrl = `/api/pakan/rekap?type=harian&bulan=${bulan}${jenisPakanId ? `&jenisPakanId=${jenisPakanId}` : ''}`;
  const { data: rekap, loading } = useApiList<any>(rekapUrl);

  const filterConfig: FilterConfig[] = useMemo(() => [
    { key: "bulan", label: "Bulan", type: "month" },
    { 
      key: "jenisPakan", 
      label: "Jenis Pakan", 
      type: "select", 
      placeholder: "Pilih Jenis Pakan",
      options: jenisPakan.map((jp: any) => ({ value: jp.id, label: jp.nama }))
    },
  ], [jenisPakan]);

  const stats: StatItem[] = useMemo(() => {
    if (!rekap || Array.isArray(rekap) || !(rekap as any).summary) return [
      { label: "Konsumsi/Hari", value: "0 Kg", color: "emerald" },
      { label: "Konsumsi/Bulan", value: "0 Kg", color: "blue" },
      { label: "Konsumsi/Ekor", value: "0 gram", color: "purple" },
      { label: "Biaya/Kg", value: formatCurrency(0), color: "amber" },
      { label: "Total Biaya", value: formatCurrency(0), color: "rose" },
      { label: "Biaya/Ekor", value: formatCurrency(0), color: "slate" },
    ];

    const s = (rekap as any).summary;
    return [
      { label: "Konsumsi/Hari", value: `${s.konsumsiPerHari.toFixed(1)} Kg`, color: "emerald" },
      { label: "Konsumsi/Bulan", value: `${s.totalKeluarKg.toFixed(1)} Kg`, color: "blue" },
      { label: "Konsumsi/Ekor", value: `${s.konsumsiPerEkorGram.toFixed(0)} gram`, color: "purple" },
      { label: "Biaya/Kg", value: formatCurrency(s.biayaPerKg), color: "amber" },
      { label: "Total Biaya", value: formatCurrency(s.totalKeluarRp), color: "rose" },
      { label: "Biaya/Ekor", value: formatCurrency(s.biayaPerEkor), color: "slate" },
    ];
  }, [rekap]);

  const handleFilterChange = (f: Record<string, string | null>) => {
    const month = f.bulan_month;
    const year = f.bulan_year;
    
    if (month !== null && year !== null) {
      const monthNum = String(Number(month) + 1).padStart(2, "0");
      setBulan(`${year}-${monthNum}`);
    }

    setJenisPakanId(f.jenisPakan || "");
  };

  const dataHarian = (rekap as any)?.dataHarian || [];
  const summary = (rekap as any)?.summary || {};
  const jenisPakanNama = jenisPakanId 
    ? jenisPakan.find((jp: any) => jp.id === jenisPakanId)?.nama || "-"
    : "Semua Jenis Pakan";

  return (
    <section className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Rekap Pakan</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">Detail transaksi pakan harian</p>
      </div>

      <DataStats stats={stats} columns={3} />
      <DataFilters config={filterConfig} onFilterChange={handleFilterChange} />

      <Card className="p-4 sm:p-6">
        <div className="overflow-x-auto">
          <div className="flex flex-col rounded-lg overflow-hidden min-w-[800px] sm:min-w-0" style={{ height: '600px' }}>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-sm">
              <colgroup>
                <col style={{ width: '15%' }} />
                <col style={{ width: '12%' }} />
                <col style={{ width: '12%' }} />
                <col style={{ width: '12%' }} />
                <col style={{ width: '12%' }} />
                <col style={{ width: '12%' }} />
                <col style={{ width: '12%' }} />
                <col style={{ width: '13%' }} />
              </colgroup>
              <thead className="sticky top-0 bg-slate-900 text-white z-10 border-b">
                <tr>
                  <th className="text-center p-2 font-medium">Tanggal</th>
                  <th className="text-center p-2 font-medium">Rp/Kg</th>
                  <th className="text-center p-2 font-medium">Stok Awal</th>
                  <th className="text-center p-2 font-medium">Masuk (Kg)</th>
                  <th className="text-center p-2 font-medium">Masuk (Rp)</th>
                  <th className="text-center p-2 font-medium">Keluar (Kg)</th>
                  <th className="text-center p-2 font-medium">Keluar (Rp)</th>
                  <th className="text-center p-2 font-medium">Stok Akhir</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={8} className="text-center p-4 text-muted-foreground">Memuat data...</td></tr>
                ) : dataHarian.length === 0 ? (
                  <tr><td colSpan={8} className="text-center p-4 text-muted-foreground">Tidak ada data untuk periode ini</td></tr>
                ) : (
                  dataHarian.map((item: any, idx: number) => (
                    <tr key={item.tanggal} className="border-b hover:bg-muted/50">
                      <td className="p-2 text-center">{formatDate(item.tanggal)}</td>
                      <td className="p-2 text-center">{item.hargaPerKg > 0 ? formatCurrency(item.hargaPerKg) : "-"}</td>
                      <td className="p-2 text-center">{idx === 0 ? item.stokAwalKg.toFixed(0) : ""}</td>
                      <td className="p-2 text-center text-emerald-600">{item.masukKg > 0 ? item.masukKg.toFixed(0) : "-"}</td>
                      <td className="p-2 text-center text-emerald-600">{item.masukRp > 0 ? formatCurrency(item.masukRp) : "-"}</td>
                      <td className="p-2 text-center text-rose-600">{item.keluarKg > 0 ? item.keluarKg.toFixed(0) : "-"}</td>
                      <td className="p-2 text-center text-rose-600">{item.keluarRp > 0 ? formatCurrency(item.keluarRp) : "-"}</td>
                      <td className="p-2 text-center">{item.stokAkhirKg.toFixed(0)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {dataHarian.length > 0 && (
            <div className="border-t-2 bg-background">
              <table className="w-full text-sm">
                <colgroup>
                  <col style={{ width: '15%' }} />
                  <col style={{ width: '12%' }} />
                  <col style={{ width: '12%' }} />
                  <col style={{ width: '12%' }} />
                  <col style={{ width: '12%' }} />
                  <col style={{ width: '12%' }} />
                  <col style={{ width: '12%' }} />
                  <col style={{ width: '13%' }} />
                </colgroup>
                <tfoot className="font-bold">
                  <tr>
                    <td className="p-2 text-center">TOTAL</td>
                    <td className="p-2 text-center"></td>
                    <td className="p-2 text-center">{dataHarian[0]?.stokAwalKg.toFixed(0) || 0}</td>
                    <td className="p-2 text-center text-emerald-600">{summary.totalMasukKg?.toFixed(0) || 0}</td>
                    <td className="p-2 text-center text-emerald-600"></td>
                    <td className="p-2 text-center text-rose-600">{summary.totalKeluarKg?.toFixed(0) || 0}</td>
                    <td className="p-2 text-center text-rose-600">{formatCurrency(summary.totalKeluarRp || 0)}</td>
                    <td className="p-2 text-center"></td>
                  </tr>
                  <tr>
                    <td className="p-2 text-center" colSpan={5}></td>
                    <td className="p-2 text-center text-xs">RATA2 /KG /BULAN</td>
                    <td className="p-2 text-center">{summary.biayaPerKg > 0 ? formatCurrency(summary.biayaPerKg) : "-"}</td>
                    <td className="p-2 text-center"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
          </div>
        </div>
      </Card>
    </section>
  );
}
