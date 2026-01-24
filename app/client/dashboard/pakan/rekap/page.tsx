"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useApiList } from "@/hooks/use-api";

const formatCurrency = (value: number) => `Rp ${value.toLocaleString("id-ID")}`;
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
};

export default function RekapPakanPage() {
  const [bulan, setBulan] = useState(new Date().toISOString().slice(0, 7));
  const [data, setData] = useState<any>(null);
  const [dataHarian, setDataHarian] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedJenisPakan, setSelectedJenisPakan] = useState("");

  const { data: jenisPakan = [] } = useApiList<any>("/api/jenis-pakan");
  const { data: kandang = [] } = useApiList<any>("/api/kandang");

  const fetchRekap = async () => {
    setLoading(true);
    const res = await fetch(`/api/pakan/rekap?bulan=${bulan}`);
    const json = await res.json();
    if (json.success) setData(json.data);
    setLoading(false);
  };

  const fetchRekapHarian = async (jenisPakanId: string) => {
    setLoading(true);
    const res = await fetch(`/api/pakan/rekap?type=harian&bulan=${bulan}&jenisPakanId=${jenisPakanId}`);
    const json = await res.json();
    if (json.success) setDataHarian(json.data);
    setLoading(false);
  };

  const handleJenisPakanChange = (value: string) => {
    setSelectedJenisPakan(value);
    if (value) fetchRekapHarian(value);
  };

  const totalAyam = kandang.reduce((sum: number, k: any) => sum + (k.jumlahAyam || 0), 0);
  const jumlahHari = bulan ? new Date(parseInt(bulan.split("-")[0]), parseInt(bulan.split("-")[1]), 0).getDate() : 30;

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

          {/* Konsumsi Ayam */}
          {totalAyam > 0 && data.summary.totalKeluar > 0 && (
            <Card className="border-amber-200 dark:border-amber-800">
              <CardHeader className="p-4 sm:p-6 pb-3">
                <CardTitle className="text-base sm:text-lg">Konsumsi Pakan Ayam ({totalAyam} ekor)</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Konsumsi/Bulan</p>
                    <p className="text-lg font-semibold">{data.summary.totalKeluar.toFixed(2)} Kg</p>
                    <p className="text-sm text-muted-foreground">{formatCurrency(data.summary.totalBiaya)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Konsumsi/Hari</p>
                    <p className="text-lg font-semibold">{(data.summary.totalKeluar / jumlahHari).toFixed(2)} Kg</p>
                    <p className="text-sm text-muted-foreground">{formatCurrency(data.summary.totalBiaya / jumlahHari)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Konsumsi/Ekor</p>
                    <p className="text-lg font-semibold">{(data.summary.totalKeluar / totalAyam).toFixed(3)} Kg</p>
                    <p className="text-lg font-semibold text-amber-600">{((data.summary.totalKeluar * 1000) / totalAyam).toFixed(1)} gram</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Rp/Kg Konsumsi</p>
                    <p className="text-lg font-semibold">{formatCurrency(data.summary.totalBiaya / data.summary.totalKeluar)}</p>
                    <p className="text-sm text-muted-foreground">Rp/ekor: {formatCurrency(data.summary.totalBiaya / totalAyam)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Tabs defaultValue="bulanan" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="bulanan">Bulanan</TabsTrigger>
              <TabsTrigger value="harian">Harian</TabsTrigger>
              <TabsTrigger value="kandang">Per Kandang</TabsTrigger>
            </TabsList>

            <TabsContent value="bulanan">
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
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                              <div className="py-2">
                                <span className="text-sm text-muted-foreground">Stok Awal</span>
                                <p className="font-semibold">{item.stokAwal.toFixed(0)} Kg</p>
                              </div>
                              <div className="py-2">
                                <span className="text-sm text-muted-foreground">Masuk</span>
                                <p className="font-semibold text-emerald-600">{item.masuk.toFixed(0)} Kg</p>
                              </div>
                              <div className="py-2">
                                <span className="text-sm text-muted-foreground">Keluar</span>
                                <p className="font-semibold text-blue-600">{item.keluar.toFixed(0)} Kg</p>
                              </div>
                              <div className="py-2">
                                <span className="text-sm text-muted-foreground">Stok Akhir</span>
                                <p className="font-semibold">{item.stokAkhir.toFixed(0)} Kg</p>
                              </div>
                              <div className="py-2">
                                <span className="text-sm text-muted-foreground">Total Biaya</span>
                                <p className="font-semibold">{formatCurrency(item.totalBiaya)}</p>
                              </div>
                              <div className="py-2">
                                <span className="text-sm text-muted-foreground">Harga Rata-rata</span>
                                <p className="font-semibold">{formatCurrency(item.hargaRataRata)}/Kg</p>
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

            <TabsContent value="harian">
              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <CardTitle className="text-base sm:text-lg">Rincian Stok Harian</CardTitle>
                    <div className="w-full sm:w-64">
                      <Select value={selectedJenisPakan} onValueChange={handleJenisPakanChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih jenis pakan" />
                        </SelectTrigger>
                        <SelectContent>
                          {jenisPakan.map((jp: any) => (
                            <SelectItem key={jp.id} value={jp.id}>{jp.nama}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  {!dataHarian ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>Pilih jenis pakan untuk melihat rincian harian</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-muted">
                          <tr>
                            <th className="p-2 text-left">Tanggal</th>
                            <th className="p-2 text-right">Harga/Kg</th>
                            <th className="p-2 text-right">Stok Awal</th>
                            <th className="p-2 text-right">Masuk (Kg)</th>
                            <th className="p-2 text-right">Keluar (Kg)</th>
                            <th className="p-2 text-right">Keluar (Rp)</th>
                            <th className="p-2 text-right">Stok Akhir</th>
                            <th className="p-2 text-right">Stok Akhir (Rp)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dataHarian.dataHarian.map((row: any, idx: number) => (
                            <tr key={idx} className="border-b hover:bg-muted/50">
                              <td className="p-2">{formatDate(row.tanggal)}</td>
                              <td className="p-2 text-right">{row.hargaPerKg > 0 ? formatCurrency(row.hargaPerKg) : "-"}</td>
                              <td className="p-2 text-right">{row.stokAwalKg.toFixed(0)}</td>
                              <td className="p-2 text-right text-emerald-600">{row.masukKg > 0 ? row.masukKg.toFixed(0) : "-"}</td>
                              <td className="p-2 text-right text-blue-600">{row.keluarKg > 0 ? row.keluarKg.toFixed(0) : "-"}</td>
                              <td className="p-2 text-right">{row.keluarRp > 0 ? formatCurrency(row.keluarRp) : "-"}</td>
                              <td className="p-2 text-right font-medium">{row.stokAkhirKg.toFixed(0)}</td>
                              <td className="p-2 text-right">{formatCurrency(row.stokAkhirRp)}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-amber-50 dark:bg-amber-900/20 font-semibold">
                          <tr>
                            <td className="p-2">TOTAL</td>
                            <td className="p-2 text-right">{formatCurrency(dataHarian.summary.rataRataHargaPerKg)}</td>
                            <td className="p-2"></td>
                            <td className="p-2 text-right">{dataHarian.summary.totalMasukKg.toFixed(0)}</td>
                            <td className="p-2 text-right">{dataHarian.summary.totalKeluarKg.toFixed(0)}</td>
                            <td className="p-2 text-right">{formatCurrency(dataHarian.summary.totalKeluarRp)}</td>
                            <td className="p-2"></td>
                            <td className="p-2"></td>
                          </tr>
                        </tfoot>
                      </table>
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
