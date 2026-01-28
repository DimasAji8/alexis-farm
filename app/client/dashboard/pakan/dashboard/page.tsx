"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { DataStats, type StatItem } from "@/components/shared/data-stats";
import { DataFilters, type FilterConfig } from "@/components/shared/data-filters";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const formatCurrency = (value: number) => `Rp ${(value || 0).toLocaleString("id-ID")}`;

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function DashboardPakanPage() {
  const [bulan, setBulan] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  const dashboardUrl = `/api/pakan/dashboard?bulan=${bulan}`;
  
  const { data: dashboard, isLoading } = useQuery({
    queryKey: ["pakan-dashboard", bulan],
    queryFn: () => fetch(dashboardUrl).then(res => res.json()).then(r => r.data),
    staleTime: 5 * 60 * 1000,
  });

  const filterConfig: FilterConfig[] = useMemo(() => [
    { key: "bulan", label: "Bulan", type: "month" },
  ], []);

  const stats: StatItem[] = useMemo(() => {
    if (!dashboard?.summary) return [
      { label: "Konsumsi/Hari", value: "0 Kg", color: "emerald" },
      { label: "Konsumsi/Bulan", value: "0 Kg", color: "blue" },
      { label: "Konsumsi/Ekor", value: "0 gram", color: "purple" },
      { label: "Biaya/Kg", value: formatCurrency(0), color: "amber" },
      { label: "Total Biaya", value: formatCurrency(0), color: "rose" },
      { label: "Biaya/Ekor", value: formatCurrency(0), color: "slate" },
    ];

    const s = dashboard.summary;
    return [
      { label: "Konsumsi/Hari", value: `${s.konsumsiPerHari.toFixed(1)} Kg`, color: "emerald" },
      { label: "Konsumsi/Bulan", value: `${s.totalKonsumsi.toFixed(1)} Kg`, color: "blue" },
      { label: "Konsumsi/Ekor", value: `${s.konsumsiPerEkorGram.toFixed(0)} gram`, color: "purple" },
      { label: "Biaya/Kg", value: formatCurrency(s.biayaPerKg), color: "amber" },
      { label: "Total Biaya", value: formatCurrency(s.totalBiaya), color: "rose" },
      { label: "Biaya/Ekor", value: formatCurrency(s.biayaPerEkor), color: "slate" },
    ];
  }, [dashboard]);

  const handleFilterChange = (f: Record<string, string | null>) => {
    const month = f.bulan_month;
    const year = f.bulan_year;
    
    if (month !== null && year !== null) {
      const monthNum = String(Number(month) + 1).padStart(2, "0");
      setBulan(`${year}-${monthNum}`);
    }
  };

  const perJenisPakan = dashboard?.perJenisPakan || [];

  // Data for charts
  const barChartData = perJenisPakan.map((jp: any) => ({
    nama: jp.nama,
    konsumsi: jp.totalKonsumsi,
    biaya: jp.totalBiaya / 1000, // Convert to thousands
  }));

  const pieChartData = perJenisPakan.map((jp: any) => ({
    name: jp.nama,
    value: jp.totalKonsumsi,
  }));

  return (
    <section className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Dashboard Pakan</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">Overview konsumsi dan biaya pakan</p>
      </div>

      <DataStats stats={stats} columns={3} />
      <DataFilters config={filterConfig} onFilterChange={handleFilterChange} />

      <div className="grid gap-4 md:grid-cols-2">
        {/* Bar Chart - Konsumsi & Biaya */}
        <Card className="p-4 sm:p-6">
          <h3 className="font-semibold mb-4">Konsumsi & Biaya per Jenis Pakan</h3>
          {isLoading ? (
            <div className="h-[300px] flex items-center justify-center">
              <p className="text-sm text-muted-foreground">Memuat data...</p>
            </div>
          ) : perJenisPakan.length === 0 ? (
            <div className="h-[300px] flex items-center justify-center">
              <p className="text-sm text-muted-foreground">Tidak ada data</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nama" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value: number, name: string) => {
                    if (name === 'konsumsi') return [`${value.toFixed(1)} Kg`, 'Konsumsi'];
                    return [`Rp ${(value * 1000).toLocaleString('id-ID')}`, 'Biaya'];
                  }}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="konsumsi" fill="#10b981" name="Konsumsi (Kg)" />
                <Bar yAxisId="right" dataKey="biaya" fill="#f59e0b" name="Biaya (Ribu)" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Pie Chart - Proporsi Konsumsi */}
        <Card className="p-4 sm:p-6">
          <h3 className="font-semibold mb-4">Proporsi Konsumsi</h3>
          {isLoading ? (
            <div className="h-[300px] flex items-center justify-center">
              <p className="text-sm text-muted-foreground">Memuat data...</p>
            </div>
          ) : perJenisPakan.length === 0 ? (
            <div className="h-[300px] flex items-center justify-center">
              <p className="text-sm text-muted-foreground">Tidak ada data</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${value.toFixed(1)} Kg`} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      {/* Rincian Konsumsi per Jenis Pakan */}
      <Card className="p-4 sm:p-6">
        <h3 className="font-semibold mb-4">Rincian Konsumsi per Jenis Pakan</h3>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Memuat data...</p>
        ) : perJenisPakan.length === 0 ? (
          <p className="text-sm text-muted-foreground">Tidak ada data</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr className="text-left">
                  <th className="p-2 font-medium">Jenis Pakan</th>
                  <th className="p-2 font-medium text-right">Konsumsi (Kg)</th>
                  <th className="p-2 font-medium text-right">Persentase</th>
                  <th className="p-2 font-medium text-right">Total Biaya</th>
                  <th className="p-2 font-medium text-right">Stok Tersedia</th>
                </tr>
              </thead>
              <tbody>
                {perJenisPakan.map((jp: any, idx: number) => (
                  <tr key={jp.id} className="border-b hover:bg-muted/50">
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                        />
                        <span className="font-medium">{jp.nama}</span>
                        <span className="text-xs text-muted-foreground">({jp.kode})</span>
                      </div>
                    </td>
                    <td className="p-2 text-right font-semibold text-emerald-600">
                      {jp.totalKonsumsi.toFixed(1)} Kg
                    </td>
                    <td className="p-2 text-right text-muted-foreground">
                      {jp.persentase.toFixed(1)}%
                    </td>
                    <td className="p-2 text-right font-medium">
                      {formatCurrency(jp.totalBiaya)}
                    </td>
                    <td className="p-2 text-right">
                      <span className={jp.stokTersedia < 50 ? 'text-rose-600 font-semibold' : 'text-blue-600'}>
                        {jp.stokTersedia.toFixed(1)} Kg
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t-2 font-bold">
                <tr>
                  <td className="p-2">TOTAL</td>
                  <td className="p-2 text-right text-emerald-600">
                    {dashboard?.summary.totalKonsumsi.toFixed(1)} Kg
                  </td>
                  <td className="p-2 text-right">100%</td>
                  <td className="p-2 text-right">
                    {formatCurrency(dashboard?.summary.totalBiaya || 0)}
                  </td>
                  <td className="p-2"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </Card>
    </section>
  );
}
