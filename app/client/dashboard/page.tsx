"use client";

import { useQuery } from "@tanstack/react-query";
import { useSelectedKandang } from "@/hooks/use-selected-kandang";
import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";

const formatCurrency = (value: number) => `Rp ${(value || 0).toLocaleString("id-ID")}`;

interface AktivitasItem {
  tanggal: string;
  jenis: string;
  deskripsi: string;
}

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Selamat Pagi";
  if (hour < 15) return "Selamat Siang";
  if (hour < 18) return "Selamat Sore";
  return "Selamat Malam";
};

export default function DashboardPage() {
  const { selectedKandangId } = useSelectedKandang();
  const { data: session } = useSession();
  const periode = "7"; // Fixed 7 hari

  const { data: dashboard, isLoading } = useQuery({
    queryKey: ["dashboard", selectedKandangId, periode],
    queryFn: async () => {
      const res = await fetch(`/api/dashboard?kandangId=${selectedKandangId}&periode=${periode}`);
      const json = await res.json();
      return json.data || null;
    },
    enabled: !!selectedKandangId,
    staleTime: 2 * 60 * 1000,
  });

  if (!selectedKandangId) {
    return (
      <section className="space-y-6">
        <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 p-6 shadow-sm ring-1 ring-amber-200/80 dark:ring-amber-700/50">
          <p className="text-sm uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">{getGreeting()}</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">
            {session?.user?.name || "Pengguna"}
          </h1>
          
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4 sm:space-y-6">
      {/* Greeting Card */}
      <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 p-6 shadow-sm ring-1 ring-amber-200/80 dark:ring-amber-700/50">
        <p className="text-sm uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">{getGreeting()}</p>
        <h1 className="mt-2 text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white">
          {session?.user?.name || "Pengguna"}
        </h1>
       
      </div>

      {/* Stats Grid - 4 Cards Utama */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-3 sm:p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
          <p className="text-xs text-blue-700 dark:text-blue-300 uppercase tracking-wider">Total Ayam Hidup</p>
          <div className="flex items-baseline gap-2 mt-1 sm:mt-2">
            <p className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">
              {isLoading ? "..." : dashboard?.stats.totalAyam.toLocaleString("id-ID") || 0}
            </p>
            <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-400">ekor</p>
          </div>
        </Card>

        <Card className="p-3 sm:p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/30 dark:to-emerald-900/20 border-emerald-200 dark:border-emerald-800">
          <p className="text-xs text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">Produksi Hari Ini</p>
          <div className="flex items-baseline gap-2 mt-1 sm:mt-2">
            <p className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              {isLoading ? "..." : dashboard?.stats.produksiHariIni.butir || 0}
            </p>
            <p className="text-xs sm:text-sm text-emerald-600 dark:text-emerald-400">butir</p>
          </div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
            {dashboard?.stats.produksiHariIni.kg.toFixed(1)} kg
          </p>
        </Card>

        <Card className="p-3 sm:p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/20 border-purple-200 dark:border-purple-800">
          <p className="text-xs text-purple-700 dark:text-purple-300 uppercase tracking-wider">Stok Telur</p>
          <div className="flex items-baseline gap-2 mt-1 sm:mt-2">
            <p className="text-2xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400">
              {isLoading ? "..." : dashboard?.stats.stokTelur.butir.toLocaleString("id-ID") || 0}
            </p>
            <p className="text-xs sm:text-sm text-purple-600 dark:text-purple-400">butir</p>
          </div>
          <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
            {dashboard?.stats.stokTelur.kg.toFixed(1)} kg
          </p>
        </Card>

        <Card className={`p-3 sm:p-4 ${
          (dashboard?.stats.tingkatKematian || 0) > 2
            ? "bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-950/30 dark:to-rose-900/20 border-rose-200 dark:border-rose-800"
            : "bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/30 dark:to-slate-700/20 border-slate-200 dark:border-slate-700"
        }`}>
          <p className={`text-xs uppercase tracking-wider ${
            (dashboard?.stats.tingkatKematian || 0) > 2
              ? "text-rose-700 dark:text-rose-300"
              : "text-slate-700 dark:text-slate-300"
          }`}>Tingkat Kematian</p>
          <div className="flex items-baseline gap-2 mt-1 sm:mt-2">
            <p className={`text-2xl sm:text-3xl font-bold ${
              (dashboard?.stats.tingkatKematian || 0) > 2 
                ? "text-rose-600 dark:text-rose-400" 
                : "text-slate-700 dark:text-slate-300"
            }`}>
              {isLoading ? "..." : dashboard?.stats.tingkatKematian.toFixed(2) || 0}
            </p>
            <p className={`text-xs sm:text-sm ${
              (dashboard?.stats.tingkatKematian || 0) > 2
                ? "text-rose-600 dark:text-rose-400"
                : "text-slate-600 dark:text-slate-400"
            }`}>%</p>
          </div>
          <p className={`text-xs mt-1 ${
            (dashboard?.stats.tingkatKematian || 0) > 2
              ? "text-rose-600 dark:text-rose-400"
              : "text-slate-600 dark:text-slate-400"
          }`}>
            {(dashboard?.stats.tingkatKematian || 0) > 2 ? "Perlu perhatian" : "Normal"}
          </p>
        </Card>
      </div>

      {/* 3 Charts: Line + Bar + Donut */}
      <div className="grid gap-4 lg:grid-cols-5">
        {/* Line Chart - Trend Produksi */}
        <Card className="p-4 sm:p-6 lg:col-span-2">
          <div className="mb-4">
            <h3 className="font-semibold">Trend Produksi Telur</h3>
            <p className="text-xs text-muted-foreground mt-1">Produksi 7 hari terakhir</p>
          </div>
          {isLoading ? (
            <div className="h-[250px] flex items-center justify-center">
              <p className="text-sm text-muted-foreground">Memuat data...</p>
            </div>
          ) : !dashboard?.charts.trendProduksi.length ? (
            <div className="h-[250px] flex items-center justify-center">
              <p className="text-sm text-muted-foreground">Tidak ada data</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={dashboard.charts.trendProduksi}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                <XAxis dataKey="tanggal" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} width={50} />
                <Tooltip contentStyle={{ fontSize: 12 }} formatter={(value: number | undefined) => [`${value || 0} butir`, 'Produksi']} />
                <Line type="monotone" dataKey="butir" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Bar Chart - Pemasukan vs Pengeluaran */}
        <Card className="p-4 sm:p-6 lg:col-span-2">
          <div className="mb-4">
            <h3 className="font-semibold">Pemasukan vs Pengeluaran</h3>
            <p className="text-xs text-muted-foreground mt-1">Bulan ini</p>
          </div>
          {isLoading ? (
            <div className="h-[250px] flex items-center justify-center">
              <p className="text-sm text-muted-foreground">Memuat data...</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={[
                  {
                    kategori: 'Pemasukan',
                    jumlah: dashboard?.charts.keuangan.pemasukan || 0,
                  },
                  {
                    kategori: 'Pengeluaran',
                    jumlah: dashboard?.charts.keuangan.totalPengeluaran || 0,
                  },
                ]}
              >
                <defs>
                  <linearGradient id="colorPemasukan" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.9}/>
                    <stop offset="100%" stopColor="#0d9488" stopOpacity={0.8}/>
                  </linearGradient>
                  <linearGradient id="colorPengeluaran" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#818cf8" stopOpacity={0.9}/>
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                <XAxis dataKey="kategori" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} width={70} tickFormatter={(value) => `${(value / 1000000).toFixed(1)}jt`} />
                <Tooltip 
                  contentStyle={{ fontSize: 12 }} 
                  formatter={(value: number | undefined) => [formatCurrency(value || 0), '']}
                />
                <Bar dataKey="jumlah" radius={[8, 8, 0, 0]}>
                  {[
                    { kategori: 'Pemasukan', jumlah: dashboard?.charts.keuangan.pemasukan || 0 },
                    { kategori: 'Pengeluaran', jumlah: dashboard?.charts.keuangan.totalPengeluaran || 0 },
                  ].map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.kategori === 'Pemasukan' ? 'url(#colorPemasukan)' : 'url(#colorPengeluaran)'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Progress Bar - Produktivitas Bulanan */}
        <Card className="p-4 sm:p-6 lg:col-span-1">
          <div className="mb-4">
            <h3 className="font-semibold text-sm">Produktivitas</h3>
            <p className="text-xs text-muted-foreground mt-1">Rata-rata bulan ini</p>
          </div>
          {isLoading ? (
            <div className="h-[250px] flex items-center justify-center">
              <p className="text-sm text-muted-foreground">Memuat...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Circular Progress */}
              <div className="flex flex-col items-center justify-center py-4">
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-slate-200 dark:text-slate-700"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 56}`}
                      strokeDashoffset={`${2 * Math.PI * 56 * (1 - (dashboard?.stats.produktivitasBulanan?.persentase || 0) / 100)}`}
                      className={`transition-all duration-1000 ${
                        (dashboard?.stats.produktivitasBulanan?.persentase || 0) >= 70
                          ? "text-emerald-500"
                          : (dashboard?.stats.produktivitasBulanan?.persentase || 0) >= 60
                          ? "text-amber-500"
                          : "text-rose-500"
                      }`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold">
                      {dashboard?.stats.produktivitasBulanan?.persentase.toFixed(1)}%
                    </span>
                    <span className="text-xs text-muted-foreground mt-1">
                      ~{dashboard?.stats.produktivitasBulanan?.rataRataProduksi.toFixed(0)} butir/hari
                    </span>
                  </div>
                </div>
              </div>

              {/* Target Info */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Target Minimum</span>
                  <span className="font-medium">70%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Target Optimal</span>
                  <span className="font-medium">80%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Jumlah Hari</span>
                  <span className="font-medium">{dashboard?.stats.produktivitasBulanan?.jumlahHari || 0} hari</span>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      (dashboard?.stats.produktivitasBulanan?.persentase || 0) >= 70
                        ? "bg-emerald-500"
                        : (dashboard?.stats.produktivitasBulanan?.persentase || 0) >= 60
                        ? "bg-amber-500"
                        : "bg-rose-500"
                    }`} />
                    <span className="text-xs font-medium">
                      {(dashboard?.stats.produktivitasBulanan?.persentase || 0) >= 70
                        ? "Target Tercapai"
                        : (dashboard?.stats.produktivitasBulanan?.persentase || 0) >= 60
                        ? "Mendekati Target"
                        : "Di Bawah Target"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* 2 Kolom: Aktivitas + Alert */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Aktivitas Terbaru */}
        <Card className="p-4 sm:p-6">
          <div className="mb-4">
            <h3 className="font-semibold">Aktivitas Terbaru</h3>
            <p className="text-xs text-muted-foreground mt-1">5 transaksi terakhir</p>
          </div>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Memuat data...</p>
          ) : !dashboard?.aktivitas.length ? (
            <p className="text-sm text-muted-foreground">Tidak ada aktivitas</p>
          ) : (
            <div className="space-y-3">
              {dashboard.aktivitas.map((a: AktivitasItem, idx: number) => (
                <div key={idx} className="flex items-start gap-3 pb-3 border-b last:border-0">
                  <div className="text-xs text-muted-foreground min-w-[70px]">
                    {format(new Date(a.tanggal), "dd/MM/yyyy")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{a.jenis}</p>
                    <p className="text-xs text-muted-foreground truncate">{a.deskripsi}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Alert & Notifikasi */}
        <Card className="p-4 sm:p-6">
          <div className="mb-4">
            <h3 className="font-semibold">Alert & Notifikasi</h3>
            <p className="text-xs text-muted-foreground mt-1">Status kandang</p>
          </div>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Memuat data...</p>
          ) : (
            <div className="space-y-3">
              {dashboard?.stats.produksiHariIni.butir === 0 && (
                <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                  <p className="text-sm font-medium text-amber-900 dark:text-amber-100">Belum Ada Produksi</p>
                  <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
                    Belum ada input produksi telur hari ini
                  </p>
                </div>
              )}
              
              {dashboard?.stats.produksiHariIni.persentase > 0 && 
               dashboard?.stats.produksiHariIni.persentase < 60 && (
                <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                  <p className="text-sm font-medium text-amber-900 dark:text-amber-100">Produktivitas Rendah</p>
                  <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
                    {dashboard.stats.produksiHariIni.persentase.toFixed(1)}% (target 70-80%)
                  </p>
                </div>
              )}

              {dashboard?.stats.tingkatKematian > 2 && (
                <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800">
                  <p className="text-sm font-medium text-rose-900 dark:text-rose-100">Tingkat Kematian Tinggi</p>
                  <p className="text-xs text-rose-700 dark:text-rose-300 mt-0.5">
                    {dashboard.stats.tingkatKematian.toFixed(2)}% (normal &lt; 2%)
                  </p>
                </div>
              )}

              {dashboard?.stats.pakanHariIni.kg === 0 && (
                <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                  <p className="text-sm font-medium text-amber-900 dark:text-amber-100">Belum Input Pakan</p>
                  <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
                    Belum ada pemakaian pakan hari ini
                  </p>
                </div>
              )}

              {dashboard?.stats.produksiHariIni.butir > 0 &&
               dashboard?.stats.produksiHariIni.persentase >= 60 &&
               dashboard?.stats.tingkatKematian <= 2 &&
               dashboard?.stats.pakanHariIni.kg > 0 && (
                <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800">
                  <p className="text-sm font-medium text-emerald-900 dark:text-emerald-100">Semua Normal</p>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-0.5">
                    Tidak ada masalah yang terdeteksi
                  </p>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </section>
  );
}
