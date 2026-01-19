"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

const formatCurrency = (value: number) => `Rp ${value.toLocaleString("id-ID")}`;

export default function RekapPakanPage() {
  const [bulan, setBulan] = useState(new Date().toISOString().slice(0, 7));
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchRekap = async () => {
    setLoading(true);
    const res = await fetch(`/api/pakan/rekap?bulan=${bulan}`);
    const json = await res.json();
    if (json.success) setData(json.data);
    setLoading(false);
  };

  return (
    <section className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Rekap Pakan</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">Laporan pemakaian dan stok pakan</p>
      </div>

      <Card className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
          <div className="flex-1">
            <Label htmlFor="bulan">Bulan</Label>
            <Input id="bulan" type="month" value={bulan} onChange={(e) => setBulan(e.target.value)} className="mt-2" />
          </div>
          <Button onClick={fetchRekap} disabled={loading} className="w-full sm:w-auto">
            {loading ? "Loading..." : "Tampilkan Rekap"}
          </Button>
        </div>
      </Card>

      {loading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-4 sm:p-6">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-8 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : !data ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <p>Pilih bulan dan klik "Tampilkan Rekap" untuk melihat data</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Card className="border-emerald-200 dark:border-emerald-800">
              <CardContent className="p-4 sm:p-6 bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/30 dark:to-emerald-900/20">
                <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">Total Masuk</p>
                <p className="text-xl sm:text-3xl font-bold text-emerald-700 dark:text-emerald-400 mt-2">{data.summary.totalMasuk.toFixed(0)} Kg</p>
              </CardContent>
            </Card>
            <Card className="border-blue-200 dark:border-blue-800">
              <CardContent className="p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/30 dark:to-blue-900/20">
                <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">Total Keluar</p>
                <p className="text-xl sm:text-3xl font-bold text-blue-700 dark:text-blue-400 mt-2">{data.summary.totalKeluar.toFixed(0)} Kg</p>
              </CardContent>
            </Card>
            <Card className="border-purple-200 dark:border-purple-800">
              <CardContent className="p-4 sm:p-6 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/30 dark:to-purple-900/20">
                <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">Total Biaya</p>
                <p className="text-xl sm:text-3xl font-bold text-purple-700 dark:text-purple-400 mt-2">{formatCurrency(data.summary.totalBiaya)}</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="jenis" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="jenis">Per Jenis</TabsTrigger>
              <TabsTrigger value="kandang">Per Kandang</TabsTrigger>
            </TabsList>

            <TabsContent value="jenis">
              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-base sm:text-lg">Rekap Per Jenis Pakan</CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  {data.rekapPerJenis.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>Tidak ada data untuk periode ini</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {data.rekapPerJenis.map((item: any) => (
                        <Card key={item.jenisPakan.id} className="border-l-4 border-l-emerald-500">
                          <CardContent className="p-4">
                            <h3 className="font-semibold text-lg mb-4">{item.jenisPakan.nama}</h3>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center py-2 border-b">
                                <span className="text-sm text-muted-foreground">Stok Awal</span>
                                <span className="font-semibold">{item.stokAwal.toFixed(0)} Kg</span>
                              </div>
                              <div className="flex justify-between items-center py-2 border-b">
                                <span className="text-sm text-muted-foreground">Masuk</span>
                                <span className="font-semibold text-emerald-600">{item.masuk.toFixed(0)} Kg</span>
                              </div>
                              <div className="flex justify-between items-center py-2 border-b">
                                <span className="text-sm text-muted-foreground">Keluar</span>
                                <span className="font-semibold text-blue-600">{item.keluar.toFixed(0)} Kg</span>
                              </div>
                              <div className="flex justify-between items-center py-2 border-b">
                                <span className="text-sm text-muted-foreground">Stok Akhir</span>
                                <span className="font-semibold">{item.stokAkhir.toFixed(0)} Kg</span>
                              </div>
                              <div className="flex justify-between items-center py-2 border-b">
                                <span className="text-sm text-muted-foreground">Total Biaya</span>
                                <span className="font-semibold">{formatCurrency(item.totalBiaya)}</span>
                              </div>
                              <div className="flex justify-between items-center py-2">
                                <span className="text-sm text-muted-foreground">Harga Rata-rata</span>
                                <span className="font-semibold">{formatCurrency(item.hargaRataRata)}/Kg</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="kandang">
              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-base sm:text-lg">Rekap Per Kandang</CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  {data.rekapPerKandang.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>Tidak ada data untuk periode ini</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {data.rekapPerKandang.map((item: any) => (
                        <Card key={item.kandang.id} className="border-l-4 border-l-blue-500">
                          <CardContent className="p-4">
                            <h3 className="font-semibold text-lg mb-4">{item.kandang.nama}</h3>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center py-2 border-b">
                                <span className="text-sm text-muted-foreground">Total Pemakaian</span>
                                <span className="font-semibold">{item.totalPemakaian.toFixed(0)} Kg</span>
                              </div>
                              <div className="flex justify-between items-center py-2 border-b">
                                <span className="text-sm text-muted-foreground">Total Biaya</span>
                                <span className="font-semibold">{formatCurrency(item.totalBiaya)}</span>
                              </div>
                              <div className="flex justify-between items-center py-2">
                                <span className="text-sm text-muted-foreground">Rata-rata Harian</span>
                                <span className="font-semibold">{item.rataRataHarian.toFixed(1)} Kg/hari</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </section>
  );
}
