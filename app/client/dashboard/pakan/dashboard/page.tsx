"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DataStats, type StatItem } from "@/components/shared/data-stats";
import { DataFilters, type FilterConfig } from "@/components/shared/data-filters";
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

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
      { label: "Konsumsi/Ekor", value: "0 gram", color: "purple", highlight: true },
      { label: "Biaya/Kg", value: formatCurrency(0), color: "amber" },
      { label: "Total Biaya", value: formatCurrency(0), color: "rose" },
      { label: "Biaya/Ekor", value: formatCurrency(0), color: "slate", highlight: true },
    ];

    const s = dashboard.summary;
    return [
      { label: "Konsumsi/Hari", value: `${s.konsumsiPerHari.toFixed(1)} Kg`, color: "emerald" },
      { label: "Konsumsi/Bulan", value: `${s.totalKonsumsi.toFixed(1)} Kg`, color: "blue" },
      { label: "Konsumsi/Ekor", value: `${s.konsumsiPerEkorGram.toFixed(0)} gram`, color: "purple", highlight: true },
      { label: "Biaya/Kg", value: formatCurrency(s.biayaPerKg), color: "amber" },
      { label: "Total Biaya", value: formatCurrency(s.totalBiaya), color: "rose" },
      { label: "Biaya/Ekor", value: formatCurrency(s.biayaPerEkor), color: "slate", highlight: true },
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
  const konsumsiHarian = dashboard?.konsumsiHarian || [];
  const perbandingan = dashboard?.perbandingan || [];

  // Data for pie chart
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

      <div className="grid gap-4 lg:grid-cols-4">
        {/* Line Chart - Trend Konsumsi Harian (3 kolom) */}
        <Card className="p-4 sm:p-6 lg:col-span-3">
          <div className="mb-4">
            <h3 className="font-semibold">Trend Konsumsi Harian</h3>
            <p className="text-xs text-muted-foreground mt-1">Pola konsumsi pakan per hari dalam bulan ini</p>
          </div>
          {isLoading ? (
            <div className="h-[300px] flex items-center justify-center">
              <Skeleton className="h-full w-full" />
            </div>
          ) : konsumsiHarian.length === 0 ? (
            <div className="h-[300px] flex items-center justify-center">
              <p className="text-sm text-muted-foreground">Tidak ada data</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={konsumsiHarian} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="stroke-slate-200 dark:stroke-slate-700" />
                <XAxis 
                  dataKey="tanggal" 
                  tick={{ fontSize: 11 }}
                  interval="preserveStartEnd"
                  tickFormatter={(value) => value % 5 === 0 || value === 1 ? value : ''}
                />
                <YAxis 
                  tick={{ fontSize: 11 }}
                  width={50}
                />
                <Tooltip 
                  formatter={(value: number | undefined) => [`${(value || 0).toFixed(1)} Kg`, 'Konsumsi']}
                  labelFormatter={(label) => `Tanggal ${label}`}
                  contentStyle={{ fontSize: 12 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="konsumsi" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: '#3b82f6' }}
                  name="Konsumsi (Kg)"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Pie Chart - Proporsi Konsumsi (1 kolom) */}
        <Card className="p-4 sm:p-6 lg:col-span-1">
          <div className="mb-4">
            <h3 className="font-semibold">Proporsi Konsumsi</h3>
            <p className="text-xs text-muted-foreground mt-1">Distribusi per jenis pakan</p>
          </div>
          {isLoading ? (
            <div className="h-[300px] flex items-center justify-center">
              <Skeleton className="h-full w-full" />
            </div>
          ) : perJenisPakan.length === 0 ? (
            <div className="h-[300px] flex items-center justify-center">
              <p className="text-sm text-muted-foreground">Tidak ada data</p>
            </div>
          ) : (
            <div className="space-y-4">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={75}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number | undefined) => `${(value || 0).toFixed(1)} Kg`}
                    contentStyle={{ fontSize: 11 }}
                  />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Custom Legend */}
              <div className="space-y-2">
                {perJenisPakan.slice(0, 5).map((jp: any, idx: number) => (
                  <div key={jp.id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div 
                        className="w-3 h-3 rounded-sm flex-shrink-0" 
                        style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                      />
                      <span className="font-medium text-slate-700 dark:text-slate-300 truncate">
                        {jp.nama}
                      </span>
                    </div>
                    <span className="text-slate-600 dark:text-slate-400 font-semibold ml-2">
                      {jp.persentase.toFixed(1)}%
                    </span>
                  </div>
                ))}
                {perJenisPakan.length > 5 && (
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span className="ml-5">+{perJenisPakan.length - 5} lainnya</span>
                    <span className="font-semibold">
                      {perJenisPakan.slice(5).reduce((sum: number, jp: any) => sum + jp.persentase, 0).toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Rincian Konsumsi per Jenis Pakan */}
      <Card className="p-4 sm:p-6">
        <div className="mb-4">
          <h3 className="font-semibold">Rincian Konsumsi per Jenis Pakan</h3>
          <p className="text-xs text-muted-foreground mt-1">Detail konsumsi, biaya, dan stok per jenis pakan</p>
        </div>
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : perJenisPakan.length === 0 ? (
          <p className="text-sm text-muted-foreground">Tidak ada data</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr className="text-left">
                  <th className="p-2 font-medium">Jenis Pakan</th>
                  <th className="p-2 font-medium text-right">Konsumsi (Kg)</th>
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
                  <td className="p-2">TOTAL PAKAN</td>
                  <td className="p-2 text-right text-emerald-600">
                    {dashboard?.summary.totalKonsumsi.toFixed(1)} Kg
                  </td>
                  <td className="p-2 text-right">
                    {formatCurrency(dashboard?.summary.totalBiaya || 0)}
                  </td>
                  <td className="p-2 text-right text-blue-600">
                    {perJenisPakan.reduce((sum: number, jp: any) => sum + jp.stokTersedia, 0).toFixed(1)} Kg
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </Card>
    </section>
  );
}
