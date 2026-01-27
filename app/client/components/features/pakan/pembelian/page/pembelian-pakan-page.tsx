"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pagination } from "@/components/shared/pagination";
import { DataTable, type ColumnDef } from "@/components/shared/data-table";
import { DataStats, type StatItem } from "@/components/shared/data-stats";
import { DataFilters, type FilterConfig } from "@/components/shared/data-filters";
import { Plus } from "lucide-react";

import { useApiList } from "@/hooks/use-api";
import { useJenisPakanList } from "@/components/features/jenis-pakan/hooks/use-jenis-pakan";
import { PembelianPakanFormDialog } from "../components/form-dialog";
import { PembelianPakanSkeleton } from "../components/pembelian-pakan-skeleton";
import { usePembelianPakanList, useCreatePembelianPakan } from "../hooks/use-pembelian-pakan";
import type { PembelianPakan, CreatePembelianPakanInput } from "../types";

const ITEMS_PER_PAGE = 10;

const formatDate = (value?: string) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
};

const formatCurrency = (value: number) => `Rp ${value.toLocaleString("id-ID")}`;

export function PembelianPakanPage() {
  const { data, isLoading } = usePembelianPakanList();
  const { data: jenisPakan } = useJenisPakanList();
  const createMutation = useCreatePembelianPakan();

  const [filters, setFilters] = useState<Record<string, string | null>>({ bulan: null, jenisPakanId: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);

  // Fetch summary from backend
  const summaryUrl = `/api/pakan/pembelian?type=summary${filters.bulan ? `&bulan=${filters.bulan}` : ""}${filters.jenisPakanId ? `&jenisPakanId=${filters.jenisPakanId}` : ""}`;
  const { data: summary } = useApiList<any>(summaryUrl);

  const filterConfig: FilterConfig[] = useMemo(() => [
    { key: "bulan", label: "Bulan", type: "month" },
    { 
      key: "jenisPakanId", 
      label: "Jenis Pakan", 
      type: "select", 
      placeholder: "Semua Jenis",
      options: jenisPakan?.map(jp => ({ value: jp.id, label: jp.nama })) || []
    },
  ], [jenisPakan]);

  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.filter((item) => {
      const matchJenis = !filters.jenisPakanId || item.jenisPakanId === filters.jenisPakanId;
      
      let matchBulan = true;
      if (filters.bulan) {
        const itemDate = new Date(item.tanggalBeli);
        const [year, month] = filters.bulan.split("-");
        matchBulan = itemDate.getFullYear() === parseInt(year) && (itemDate.getMonth() + 1) === parseInt(month);
      }
      
      return matchJenis && matchBulan;
    });
  }, [data, filters]);

  const stats: StatItem[] = useMemo(() => {
    if (!summary) return [
      { label: "Total Pembelian", value: formatCurrency(0), color: "emerald" },
      { label: "Rata-rata Harga/Kg", value: formatCurrency(0), color: "blue" },
      { label: "Total Stok", value: "0 Kg", color: "purple" },
    ];
    
    return [
      { label: "Total Pembelian", value: formatCurrency(summary.totalPembelian || 0), color: "emerald" },
      { label: "Rata-rata Harga/Kg", value: formatCurrency(summary.rataRataHargaPerKg || 0), color: "blue" },
      { label: "Total Stok", value: `${(summary.totalStok || 0).toFixed(0)} Kg`, color: "purple" },
    ];
  }, [summary]);

  const columns: ColumnDef<PembelianPakan>[] = [
    { key: "no", header: "No", headerClassName: "w-12 text-center", className: "text-center text-muted-foreground", render: (_, i) => i + 1 },
    { key: "tanggal", header: "Tanggal", headerClassName: "text-center", className: "text-center", render: (item) => formatDate(item.tanggalBeli) },
    { key: "jenis", header: "Jenis Pakan", headerClassName: "text-center", className: "text-center", render: (item) => item.jenisPakan.nama },
    { key: "jumlah", header: "Jumlah", headerClassName: "hidden sm:table-cell text-center", className: "hidden sm:table-cell text-center", render: (item) => `${item.jumlahKg} Kg` },
    { key: "harga", header: "Harga/Kg", headerClassName: "hidden md:table-cell text-center", className: "hidden md:table-cell text-center", render: (item) => formatCurrency(item.hargaPerKg) },
    { key: "total", header: "Total", headerClassName: "hidden lg:table-cell text-center", className: "hidden lg:table-cell text-center", render: (item) => formatCurrency(item.totalHarga) },
    { key: "sisa", header: "Sisa", headerClassName: "text-center", className: "text-center", render: (item) => `${item.sisaStokKg} Kg` },
  ];

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleFilterChange = (f: Record<string, string | null>) => { setFilters(f); setCurrentPage(1); };
  const handleAdd = () => setFormOpen(true);

  const handleFormSubmit = (formData: CreatePembelianPakanInput) => {
    const payload = {
      ...formData,
      tanggalBeli: formData.tanggalBeli instanceof Date 
        ? formData.tanggalBeli.toISOString().split("T")[0] 
        : formData.tanggalBeli
    };
    createMutation.mutate(payload, {
      onSuccess: () => { toast.success("Pembelian pakan berhasil ditambahkan"); setFormOpen(false); },
      onError: (err) => toast.error(err.message || "Gagal menambahkan"),
    });
  };

  const showSkeleton = isLoading && !data;

  if (showSkeleton) {
    return <PembelianPakanSkeleton />;
  }

  return (
    <section className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Pembelian Pakan</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">Kelola data pembelian pakan</p>
        </div>
        <Button onClick={handleAdd} size="sm"><Plus className="h-4 w-4 mr-2" />Tambah</Button>
      </div>

      <DataStats stats={stats} columns={3} />
      <DataFilters config={filterConfig} onFilterChange={handleFilterChange} />

      <Card className="p-4 sm:p-6">
        <DataTable data={paginatedData} columns={columns} isLoading={isLoading} startIndex={(currentPage - 1) * ITEMS_PER_PAGE} getRowKey={(item) => item.id} showActions={false} />
        {filteredData.length > 0 && <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={filteredData.length} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setCurrentPage} />}
      </Card>

      <PembelianPakanFormDialog open={formOpen} onOpenChange={setFormOpen} onSubmit={handleFormSubmit} isLoading={createMutation.isPending} />
    </section>
  );
}
