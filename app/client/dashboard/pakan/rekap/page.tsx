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

  const { data: jenisPakan = [] } = useApiList<any>("/api/jenis-pakan");
  const { data: pembelian = [] } = useApiList<any>("/api/pakan/pembelian");
  const { data: pemakaian = [] } = useApiList<any>("/api/pakan/pemakaian");
  const { data: kandang = [] } = useApiList<any>("/api/kandang");

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

  const filteredData = useMemo(() => {
    // Jika jenis pakan belum dipilih, return empty
    if (!jenisPakanId) return [];
    
    const [year, month] = bulan.split("-").map(Number);
    
    // Filter pembelian dan pemakaian berdasarkan bulan dan jenis pakan
    const filteredPembelian = pembelian.filter((item: any) => {
      const date = new Date(item.tanggalBeli);
      const matchBulan = date.getFullYear() === year && (date.getMonth() + 1) === month;
      return matchBulan && item.jenisPakanId === jenisPakanId;
    });

    const filteredPemakaian = pemakaian.filter((item: any) => {
      const date = new Date(item.tanggalPakai);
      const matchBulan = date.getFullYear() === year && (date.getMonth() + 1) === month;
      return matchBulan && item.jenisPakanId === jenisPakanId;
    });

    // Hitung stok awal bulan
    const pembelianSebelum = pembelian.filter((item: any) => {
      const date = new Date(item.tanggalBeli);
      return date < new Date(year, month - 1, 1) && item.jenisPakanId === jenisPakanId;
    });
    
    const pemakaianSebelum = pemakaian.filter((item: any) => {
      const date = new Date(item.tanggalPakai);
      return date < new Date(year, month - 1, 1) && item.jenisPakanId === jenisPakanId;
    });

    const stokAwalBulan = pembelianSebelum.reduce((sum: number, p: any) => sum + p.jumlahKg, 0) - 
                          pemakaianSebelum.reduce((sum: number, p: any) => sum + p.jumlahKg, 0);

    // Gabungkan semua tanggal unik
    const allDates = new Set<string>();
    filteredPembelian.forEach((p: any) => allDates.add(p.tanggalBeli));
    filteredPemakaian.forEach((p: any) => allDates.add(p.tanggalPakai));

    let stokBerjalan = stokAwalBulan;

    return Array.from(allDates).sort().map(tanggal => {
      const beli = filteredPembelian.filter((p: any) => p.tanggalBeli === tanggal);
      const pakai = filteredPemakaian.filter((p: any) => p.tanggalPakai === tanggal);

      const masukKg = beli.reduce((sum: number, b: any) => sum + b.jumlahKg, 0);
      const masukRp = beli.reduce((sum: number, b: any) => sum + b.totalHarga, 0);
      const keluarKg = pakai.reduce((sum: number, p: any) => sum + p.jumlahKg, 0);
      const keluarRp = pakai.reduce((sum: number, p: any) => sum + (p.totalBiaya || 0), 0);
      
      stokBerjalan = stokBerjalan + masukKg - keluarKg;
      
      // Harga per kg dari pembelian (jika ada pembelian hari ini)
      const hargaPerKg = masukKg > 0 ? masukRp / masukKg : 0;

      return {
        tanggal,
        jenisPakan: pakai[0]?.jenisPakan?.nama || beli[0]?.jenisPakan?.nama || "-",
        hargaPerKg,
        stokAwalKg: stokAwalBulan, // Stok awal bulan (tetap)
        masukKg,
        masukRp,
        keluarKg,
        keluarRp,
        stokAkhirKg: stokBerjalan, // Stok akhir yang berubah
      };
    });
  }, [bulan, jenisPakanId, pembelian, pemakaian]);

  const { summary, stats } = useMemo(() => {
    const totalMasuk = filteredData.reduce((sum, d) => sum + d.masukKg, 0);
    const totalKeluar = filteredData.reduce((sum, d) => sum + d.keluarKg, 0);
    const totalBiaya = filteredData.reduce((sum, d) => sum + d.keluarRp, 0);
    
    // Hitung total ayam
    const totalAyam = kandang.reduce((sum: number, k: any) => sum + (k.jumlahAyam || 0), 0);
    
    // Hitung jumlah hari dalam bulan
    const [year, month] = bulan.split("-").map(Number);
    const jumlahHari = new Date(year, month, 0).getDate();
    
    // Konsumsi per bulan, hari, dan ekor
    const konsumsiPerBulan = totalKeluar;
    const konsumsiPerHari = totalKeluar / jumlahHari;
    const konsumsiPerEkor = totalAyam > 0 ? totalKeluar / totalAyam : 0;
    const konsumsiPerEkorGram = konsumsiPerEkor * 1000;
    const biayaPerKg = totalKeluar > 0 ? totalBiaya / totalKeluar : 0;
    const biayaPerEkor = totalAyam > 0 ? totalBiaya / totalAyam : 0;

    const summary = { totalMasuk, totalKeluar, totalBiaya, konsumsiPerBulan, konsumsiPerHari, konsumsiPerEkor, konsumsiPerEkorGram, biayaPerKg, biayaPerEkor };
    const stats: StatItem[] = [
      { label: "Konsumsi/Bulan", value: `${konsumsiPerBulan.toFixed(1)} Kg`, color: "blue" },
      { label: "Konsumsi/Hari", value: `${konsumsiPerHari.toFixed(1)} Kg`, color: "emerald" },
      { label: "Konsumsi/Ekor", value: `${konsumsiPerEkorGram.toFixed(0)} gram`, color: "purple" },
      { label: "Biaya/Kg", value: formatCurrency(biayaPerKg), color: "amber" },
      { label: "Total Biaya", value: formatCurrency(totalBiaya), color: "rose" },
      { label: "Biaya/Ekor", value: formatCurrency(biayaPerEkor), color: "slate" },
    ];

    return { summary, stats };
  }, [filteredData, kandang, bulan]);

  const handleFilterChange = (f: Record<string, string | null>) => {
    const month = f.bulan_month;
    const year = f.bulan_year;
    
    if (month !== null && year !== null) {
      const monthNum = String(Number(month) + 1).padStart(2, "0");
      setBulan(`${year}-${monthNum}`);
    }

    setJenisPakanId(f.jenisPakan);
  };

  return (
    <section className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Rekap Pakan</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">Detail transaksi pakan harian</p>
      </div>

      <DataStats stats={stats} columns={3} />
      <DataFilters config={filterConfig} onFilterChange={handleFilterChange} />

      <Card className="p-4 sm:p-6">
        <div className="flex flex-col rounded-lg overflow-hidden" style={{ height: '600px' }}>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-sm">
              <colgroup>
                <col style={{ width: '12%' }} />
                <col style={{ width: '15%' }} />
                <col style={{ width: '10%' }} />
                <col style={{ width: '10%' }} />
                <col style={{ width: '10%' }} />
                <col style={{ width: '10%' }} />
                <col style={{ width: '10%' }} />
                <col style={{ width: '10%' }} />
                <col style={{ width: '13%' }} />
              </colgroup>
              <thead className="sticky top-0 bg-slate-900 text-white z-10 border-b">
                <tr>
                  <th className="text-center p-2 font-medium">Tanggal</th>
                  <th className="text-center p-2 font-medium">Jenis Pakan</th>
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
                {!jenisPakanId ? (
                  <tr><td colSpan={9} className="text-center p-8 text-muted-foreground">
                    <p className="text-lg mb-2">Pilih Jenis Pakan</p>
                    <p className="text-sm">Silakan pilih jenis pakan dari filter di atas untuk melihat rekap</p>
                  </td></tr>
                ) : filteredData.length === 0 ? (
                  <tr><td colSpan={9} className="text-center p-4 text-muted-foreground">Tidak ada data untuk periode ini</td></tr>
                ) : (
                  filteredData.map((item, idx) => (
                    <tr key={item.tanggal} className="border-b hover:bg-muted/50">
                      <td className="p-2 text-center">{formatDate(item.tanggal)}</td>
                      <td className="p-2 text-center">{item.jenisPakan}</td>
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
          {filteredData.length > 0 && jenisPakanId && (
            <div className="border-t-2 bg-background">
              <table className="w-full text-sm">
                <colgroup>
                  <col style={{ width: '12%' }} />
                  <col style={{ width: '15%' }} />
                  <col style={{ width: '10%' }} />
                  <col style={{ width: '10%' }} />
                  <col style={{ width: '10%' }} />
                  <col style={{ width: '10%' }} />
                  <col style={{ width: '10%' }} />
                  <col style={{ width: '10%' }} />
                  <col style={{ width: '13%' }} />
                </colgroup>
                <tfoot className="font-bold">
                  <tr>
                    <td className="p-2 text-center">TOTAL</td>
                    <td className="p-2 text-center"></td>
                    <td className="p-2 text-center"></td>
                    <td className="p-2 text-center">{filteredData[0]?.stokAwalKg.toFixed(0) || 0}</td>
                    <td className="p-2 text-center text-emerald-600">{summary.totalMasuk.toFixed(0)}</td>
                    <td className="p-2 text-center text-emerald-600"></td>
                    <td className="p-2 text-center text-rose-600">{summary.totalKeluar.toFixed(0)}</td>
                    <td className="p-2 text-center text-rose-600">{formatCurrency(summary.totalBiaya)}</td>
                    <td className="p-2 text-center"></td>
                  </tr>
                  <tr>
                    <td className="p-2 text-center" colSpan={6}></td>
                    <td className="p-2 text-center text-xs">RATA2 /KG /BULAN</td>
                    <td className="p-2 text-center">{summary.totalKeluar > 0 ? formatCurrency(summary.biayaPerKg) : "-"}</td>
                    <td className="p-2 text-center"></td>
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
