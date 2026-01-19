"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable, type ColumnDef } from "@/components/shared/data-table";
import { DataStats, type StatItem } from "@/components/shared/data-stats";
import { DataFilters, type FilterConfig } from "@/components/shared/data-filters";
import { Pagination } from "@/components/shared/pagination";
import { useApiList } from "@/hooks/use-api";

const ITEMS_PER_PAGE = 10;

const formatDate = (value?: string) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
};

const formatCurrency = (value: number) => `Rp ${value.toLocaleString("id-ID")}`;

export default function PemakaianPakanPage() {
  const { data, loading, refetch } = useApiList<any>("/api/pakan/pemakaian");
  const { data: kandang = [] } = useApiList<any>("/api/kandang");
  const { data: jenisPakan = [] } = useApiList<any>("/api/jenis-pakan");
  
  const [filters, setFilters] = useState<Record<string, string | null>>({ bulan: null, kandangId: null, jenisPakanId: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    kandangId: "",
    jenisPakanId: "",
    tanggalPakai: new Date().toISOString().split("T")[0],
    jumlahKg: "",
    keterangan: "",
  });

  const filterConfig: FilterConfig[] = useMemo(() => [
    { key: "bulan", label: "Bulan", type: "month" },
    { 
      key: "kandangId", 
      label: "Kandang", 
      type: "select", 
      placeholder: "Semua Kandang",
      options: kandang.map((k: any) => ({ value: k.id, label: k.nama }))
    },
    { 
      key: "jenisPakanId", 
      label: "Jenis Pakan", 
      type: "select", 
      placeholder: "Semua Jenis",
      options: jenisPakan.map((jp: any) => ({ value: jp.id, label: jp.nama }))
    },
  ], [kandang, jenisPakan]);

  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.filter((item: any) => {
      const matchKandang = !filters.kandangId || item.kandangId === filters.kandangId;
      const matchJenisPakan = !filters.jenisPakanId || item.jenisPakanId === filters.jenisPakanId;
      
      let matchBulan = true;
      if (filters.bulan) {
        const itemDate = new Date(item.tanggalPakai);
        const [year, month] = filters.bulan.split("-");
        matchBulan = itemDate.getFullYear() === parseInt(year) && (itemDate.getMonth() + 1) === parseInt(month);
      }
      
      return matchKandang && matchJenisPakan && matchBulan;
    });
  }, [data, filters]);

  const stats: StatItem[] = useMemo(() => {
    const dataToCalculate = filteredData.length > 0 ? filteredData : data || [];
    
    const totalPemakaian = dataToCalculate.reduce((sum: number, item: any) => sum + item.jumlahKg, 0);
    
    // Hitung rata-rata per hari berdasarkan range tanggal di data yang difilter
    const dates = dataToCalculate.map((item: any) => new Date(item.tanggalPakai).getTime());
    const uniqueDays = new Set(dataToCalculate.map((item: any) => new Date(item.tanggalPakai).toDateString())).size;
    const rataRataPerHari = uniqueDays > 0 ? totalPemakaian / uniqueDays : 0;
    
    return [
      { label: "Total Pemakaian", value: `${totalPemakaian.toFixed(0)} Kg`, color: "emerald" },
      { label: "Rata-rata Per Hari", value: `${rataRataPerHari.toFixed(1)} Kg`, color: "blue" },
    ];
  }, [data, filteredData]);

  const columns: ColumnDef<any>[] = [
    { key: "no", header: "No", headerClassName: "w-12", className: "text-muted-foreground", render: (_, i) => i + 1 },
    { key: "tanggal", header: "Tanggal", className: "font-medium", render: (item) => formatDate(item.tanggalPakai) },
    { key: "kandang", header: "Kandang", render: (item) => item.kandang.nama },
    { key: "jenis", header: "Jenis Pakan", render: (item) => item.jenisPakan.nama },
    { key: "jumlah", header: "Jumlah", headerClassName: "text-center", className: "text-center", render: (item) => `${item.jumlahKg} Kg` },
  ];

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleFilterChange = (f: Record<string, string | null>) => { setFilters(f); setCurrentPage(1); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/pakan/pemakaian", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        jumlahKg: parseFloat(form.jumlahKg),
      }),
    });
    const json = await res.json();
    if (json.success) {
      toast.success("Pemakaian pakan berhasil ditambahkan");
      setOpen(false);
      refetch();
      setForm({
        kandangId: "",
        jenisPakanId: "",
        tanggalPakai: new Date().toISOString().split("T")[0],
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
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">Kelola data pemakaian pakan</p>
        </div>
        <Button onClick={() => setOpen(true)} size="sm"><Plus className="h-4 w-4 mr-2" />Tambah</Button>
      </div>

      <DataStats stats={stats} columns={2} />
      <DataFilters config={filterConfig} onFilterChange={handleFilterChange} />

      <Card className="p-4 sm:p-6">
        <DataTable data={paginatedData} columns={columns} isLoading={loading} startIndex={(currentPage - 1) * ITEMS_PER_PAGE} getRowKey={(item) => item.id} showActions={false} />
        {filteredData.length > 0 && <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={filteredData.length} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setCurrentPage} />}
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Tambah Pemakaian Pakan</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="kandangId">Kandang <span className="text-red-500">*</span></Label>
                <Select value={form.kandangId} onValueChange={(v) => setForm({ ...form, kandangId: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kandang" />
                  </SelectTrigger>
                  <SelectContent>
                    {kandang.map((k: any) => (
                      <SelectItem key={k.id} value={k.id}>{k.nama}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tanggalPakai">Tanggal Pakai <span className="text-red-500">*</span></Label>
                <Input id="tanggalPakai" type="date" value={form.tanggalPakai} onChange={(e) => setForm({ ...form, tanggalPakai: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="jumlahKg">Jumlah (Kg) <span className="text-red-500">*</span></Label>
                <Input id="jumlahKg" type="number" step="0.01" placeholder="Contoh: 50" value={form.jumlahKg} onChange={(e) => setForm({ ...form, jumlahKg: e.target.value })} />
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
