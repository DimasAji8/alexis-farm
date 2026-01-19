"use client";

import { useState } from "react";
import { Button } from "@/app/client/components/ui/button";
import { Input } from "@/app/client/components/ui/input";
import { Label } from "@/app/client/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/client/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/client/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/client/components/ui/tabs";
import { Skeleton } from "@/app/client/components/ui/skeleton";

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
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Rekap Pakan</h1>

      <Card>
        <CardHeader>
          <CardTitle>Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label>Bulan</Label>
              <Input type="month" value={bulan} onChange={(e) => setBulan(e.target.value)} />
            </div>
            <Button onClick={fetchRekap} disabled={loading}>
              {loading ? "Loading..." : "Tampilkan Rekap"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        </div>
      ) : !data ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <p>Pilih bulan dan klik "Tampilkan Rekap" untuk melihat data</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Total Masuk</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{data.summary.totalMasuk.toFixed(2)} Kg</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Total Keluar</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{data.summary.totalKeluar.toFixed(2)} Kg</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Total Biaya</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">Rp {data.summary.totalBiaya.toLocaleString("id-ID")}</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="jenis">
            <TabsList>
              <TabsTrigger value="jenis">Per Jenis Pakan</TabsTrigger>
              <TabsTrigger value="kandang">Per Kandang</TabsTrigger>
            </TabsList>

            <TabsContent value="jenis">
              <Card>
                <CardHeader>
                  <CardTitle>Rekap Per Jenis Pakan</CardTitle>
                </CardHeader>
                <CardContent>
                  {data.rekapPerJenis.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>Tidak ada data untuk periode ini</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Jenis Pakan</TableHead>
                          <TableHead>Stok Awal</TableHead>
                          <TableHead>Masuk</TableHead>
                          <TableHead>Keluar</TableHead>
                          <TableHead>Stok Akhir</TableHead>
                          <TableHead>Total Biaya</TableHead>
                          <TableHead>Harga Rata-rata</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.rekapPerJenis.map((item: any) => (
                          <TableRow key={item.jenisPakan.id}>
                            <TableCell>{item.jenisPakan.nama}</TableCell>
                            <TableCell>{item.stokAwal.toFixed(2)}</TableCell>
                            <TableCell>{item.masuk.toFixed(2)}</TableCell>
                            <TableCell>{item.keluar.toFixed(2)}</TableCell>
                            <TableCell>{item.stokAkhir.toFixed(2)}</TableCell>
                            <TableCell>Rp {item.totalBiaya.toLocaleString("id-ID")}</TableCell>
                            <TableCell>Rp {item.hargaRataRata.toLocaleString("id-ID")}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="kandang">
              <Card>
                <CardHeader>
                  <CardTitle>Rekap Per Kandang</CardTitle>
                </CardHeader>
                <CardContent>
                  {data.rekapPerKandang.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>Tidak ada data untuk periode ini</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Kandang</TableHead>
                          <TableHead>Total Pemakaian (Kg)</TableHead>
                          <TableHead>Total Biaya</TableHead>
                          <TableHead>Rata-rata Harian (Kg)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.rekapPerKandang.map((item: any) => (
                          <TableRow key={item.kandang.id}>
                            <TableCell>{item.kandang.nama}</TableCell>
                            <TableCell>{item.totalPemakaian.toFixed(2)}</TableCell>
                            <TableCell>Rp {item.totalBiaya.toLocaleString("id-ID")}</TableCell>
                            <TableCell>{item.rataRataHarian.toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
