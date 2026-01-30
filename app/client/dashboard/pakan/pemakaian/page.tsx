"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { Plus, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable, type ColumnDef } from "@/components/shared/data-table";
import { DataStats, type StatItem } from "@/components/shared/data-stats";
import { useApiList } from "@/hooks/use-api";
import { useSelectedKandang } from "@/hooks/use-selected-kandang";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

const formatCurrency = (value: number) => `Rp ${value.toLocaleString("id-ID")}`;

export default function PemakaianPakanPage() {
  const queryClient = useQueryClient();
  const { selectedKandangId } = useSelectedKandang();
  const { data: jenisPakan = [] } = useApiList<any>("/api/jenis-pakan?active=true");
  const { data: pembelian = [] } = useApiList<any>("/api/pakan/pembelian");
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    jenisPakanId: "",
    jumlahKg: "",
    keterangan: "",
  });

  // Fetch daily summary from backend
  const selectedDateStr = format(selectedDate, "yyyy-MM-dd");
  const summaryUrl = selectedKandangId 
    ? `/api/pakan/pemakaian?type=daily-summary&kandangId=${selectedKandangId}&tanggal=${selectedDateStr}`
    : "";
  const { data: summary, loading, refetch } = useApiList<any>(summaryUrl);

  const stokInfo = useMemo(() => {
    if (!form.jenisPakanId) return null;
    const batches = pembelian.filter((p: any) => p.jenisPakanId === form.jenisPakanId && p.sisaStokKg > 0);
    const totalStok = batches.reduce((sum: number, b: any) => sum + b.sisaStokKg, 0);
    return { totalStok, batches };
  }, [form.jenisPakanId, pembelian]);

  const hargaPreview = useMemo(() => {
    if (!form.jenisPakanId || !form.jumlahKg || !stokInfo) return null;
    const jumlah = parseFloat(form.jumlahKg);
    if (isNaN(jumlah) || jumlah <= 0) return null;
    
    let sisa = jumlah;
    let totalBiaya = 0;
    const sortedBatches = [...stokInfo.batches].sort((a, b) => new Date(a.tanggalBeli).getTime() - new Date(b.tanggalBeli).getTime());
    
    for (const batch of sortedBatches) {
      if (sisa <= 0) break;
      const ambil = Math.min(sisa, batch.sisaStokKg);
      totalBiaya += ambil * batch.hargaPerKg;
      sisa -= ambil;
    }
    
    return sisa > 0 ? null : totalBiaya / jumlah;
  }, [form.jenisPakanId, form.jumlahKg, stokInfo]);

  const stats: StatItem[] = useMemo(() => {
    if (!summary || Array.isArray(summary) || !(summary as any).totalStok) return [
      { label: "Total Stok Tersedia", value: "0 Kg", color: "blue" },
      { label: "Pemakaian Hari Ini", value: "0 Kg", color: "emerald", highlight: true },
      { label: "Total Biaya Hari Ini", value: formatCurrency(0), color: "amber" },
    ];

    const s = summary as any;
    return [
      { label: "Total Stok Tersedia", value: `${(s.totalStok || 0).toFixed(1)} Kg`, color: "blue" },
      { label: "Pemakaian Hari Ini", value: `${(s.totalPemakaian || 0).toFixed(1)} Kg`, color: "emerald", highlight: true },
      { label: "Total Biaya Hari Ini", value: formatCurrency(s.totalBiaya || 0), color: "amber" },
    ];
  }, [summary]);

  const columns: ColumnDef<any>[] = [
    { 
      key: "jenisPakan", 
      header: "Jenis Pakan",
      className: "font-medium",
      render: (item) => item.nama
    },
    { 
      key: "kode", 
      header: "Kode",
      className: "font-medium text-muted-foreground",
      render: (item) => item.kode
    },
    { 
      key: "pemakaianHariIni", 
      header: "Pemakaian Hari Ini", 
      headerClassName: "text-right", 
      className: "text-right font-semibold", 
      render: (item) => (
        <span className={item.pemakaianHariIni > 0 ? "text-emerald-600 bg-emerald-50 px-2 py-1 rounded" : "text-muted-foreground"}>
          {item.pemakaianHariIni.toFixed(1)} Kg
        </span>
      )
    },
    { 
      key: "stokTersedia", 
      header: "Stok Tersedia", 
      headerClassName: "text-right", 
      className: "text-right font-medium", 
      render: (item) => (
        <span className="text-blue-600">{item.stokTersedia.toFixed(1)} Kg</span>
      )
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedKandangId) {
      toast.error("Pilih kandang terlebih dahulu");
      return;
    }
    const res = await fetch("/api/pakan/pemakaian", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kandangId: selectedKandangId,
        tanggalPakai: format(selectedDate, "yyyy-MM-dd"),
        ...form,
        jumlahKg: parseFloat(form.jumlahKg),
      }),
    });
    const json = await res.json();
    if (json.success) {
      toast.success("Pemakaian pakan berhasil ditambahkan");
      setOpen(false);
      refetch();
      // Invalidate dashboard cache
      queryClient.invalidateQueries({ queryKey: ["pakan-dashboard"] });
      setForm({
        jenisPakanId: "",
        jumlahKg: "",
        keterangan: "",
      });
    } else {
      toast.error(json.message || "Gagal menyimpan data");
    }
  };

  return (
    <section className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Pemakaian Pakan</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">Monitor pemakaian pakan harian</p>
        </div>
        <Button onClick={() => setOpen(true)} size="sm"><Plus className="h-4 w-4 mr-2" />Tambah Pemakaian</Button>
      </div>

      <DataStats stats={stats} columns={3} />

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Data Pemakaian</h2>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className={cn("justify-start text-left font-normal", !selectedDate && "text-muted-foreground")}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "PPP", { locale: id }) : <span>Pilih tanggal</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar mode="single" selected={selectedDate} onSelect={(date) => date && setSelectedDate(date)} initialFocus />
          </PopoverContent>
        </Popover>
      </div>

      <Card className="p-4 sm:p-6">
        <DataTable 
          data={(summary as any)?.perJenisPakan || []} 
          columns={columns} 
          isLoading={loading} 
          getRowKey={(item) => item.id} 
          showActions={false} 
        />
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Tambah Pemakaian Pakan</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="jenisPakanId">Jenis Pakan <span className="text-red-500">*</span></Label>
                <Select value={form.jenisPakanId} onValueChange={(v) => setForm({ ...form, jenisPakanId: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis pakan" />
                  </SelectTrigger>
                  <SelectContent>
                    {jenisPakan.map((jp: any) => (
                      <SelectItem key={jp.id} value={jp.id}>{jp.nama}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {stokInfo && (
                  <p className="text-xs text-muted-foreground">
                    Stok tersedia: <span className="font-medium">{stokInfo.totalStok.toFixed(1)} Kg</span>
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="jumlahKg">Jumlah (Kg) <span className="text-red-500">*</span></Label>
                <Input id="jumlahKg" type="number" step="0.01" placeholder="Contoh: 50" value={form.jumlahKg} onChange={(e) => setForm({ ...form, jumlahKg: e.target.value })} />
                {hargaPreview && (
                  <p className="text-xs text-muted-foreground">
                    Estimasi harga rata-rata: <span className="font-medium">{formatCurrency(hargaPreview)}/Kg</span>
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="keterangan">Keterangan</Label>
                <Input id="keterangan" placeholder="Keterangan (opsional)" value={form.keterangan} onChange={(e) => setForm({ ...form, keterangan: e.target.value })} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Batal</Button>
              <Button type="submit">Simpan</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
