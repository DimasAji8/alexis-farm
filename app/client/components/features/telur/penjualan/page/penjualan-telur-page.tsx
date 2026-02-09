"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageSkeleton } from "@/components/shared/page-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Pagination } from "@/components/shared/pagination";
import { DeleteConfirmDialog } from "@/components/shared/delete-confirm-dialog";
import { DataTable, type ColumnDef } from "@/components/shared/data-table";
import { DataStats, type StatItem } from "@/components/shared/data-stats";
import { DataFiltersMemo, type FilterConfig } from "@/components/shared/data-filters";
import { Plus, AlertCircle } from "lucide-react";
import { styles } from "@/lib/styles";
import { useSelectedKandang } from "@/hooks/use-selected-kandang";
import { useMonthFilter } from "@/hooks/use-month-filter";

import { PenjualanFormDialog } from "../components/form-dialog";
import { usePenjualanList, useCreatePenjualan, useUpdatePenjualan, useDeletePenjualan } from "../hooks/use-penjualan";
import type { PenjualanTelur, CreatePenjualanInput } from "../types";

const ITEMS_PER_PAGE = 10;

const formatDate = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
};

const formatCurrency = (value: number) => `Rp ${value.toLocaleString("id-ID")}`;

const filterConfig: FilterConfig[] = [
  { key: "bulan", label: "Bulan", type: "month" },
  { key: "search", label: "Cari Pembeli", type: "search", placeholder: "Nama pembeli..." },
];

export function PenjualanTelurPage() {
  const { selectedKandangId } = useSelectedKandang();
  const [filters, setFilters] = useState<Record<string, string | null>>({});
  const bulanFilter = useMonthFilter(filters.bulan_month, filters.bulan_year);
  const { data, isLoading, isError, error, refetch } = usePenjualanList(selectedKandangId, bulanFilter);
  const createMutation = useCreatePenjualan();
  const updateMutation = useUpdatePenjualan();
  const deleteMutation = useDeletePenjualan();

  const [currentPage, setCurrentPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<PenjualanTelur | null>(null);

  const summaryParams = useMemo(() => {
    const params: Record<string, string> = { type: "summary" };
    if (selectedKandangId) params.kandangId = selectedKandangId;
    if (bulanFilter) params.bulan = bulanFilter;
    return params;
  }, [selectedKandangId, bulanFilter]);

  const summaryUrl = useMemo(() => {
    const params = new URLSearchParams(summaryParams);
    return `/api/telur/penjualan?${params.toString()}`;
  }, [summaryParams]);

  const { data: summaryData } = useQuery({
    queryKey: ["penjualan-telur-summary", summaryParams],
    queryFn: () => fetch(summaryUrl).then(res => res.json()).then(r => r.data),
    staleTime: 5 * 60 * 1000,
    enabled: !!selectedKandangId,
  });

  const stats: StatItem[] = useMemo(() => {
    const s = summaryData ?? { totalPenjualan: 0, totalBeratKg: 0, rataRataHargaPerKg: 0, totalTransaksi: 0, stokTersedia: { kg: 0, butir: 0 } };
    const stokKg = typeof s.stokTersedia === 'object' ? s.stokTersedia.kg : s.stokTersedia;
    return [
      { label: "Stok Tersedia", value: `${(stokKg ?? 0).toLocaleString("id-ID")} kg`, color: (stokKg ?? 0) > 0 ? "blue" : "rose" },
      { label: "Total Penjualan", value: formatCurrency(s.totalPenjualan ?? 0), color: "emerald" },
      { label: "Total Terjual", value: `${(s.totalBeratKg ?? 0).toLocaleString("id-ID")} kg`, color: "amber" },
      { label: "Jumlah Transaksi", value: s.totalTransaksi ?? 0, color: "slate" },
    ];
  }, [summaryData]);

  const columns: ColumnDef<PenjualanTelur>[] = [
    { key: "no", header: "No", headerClassName: "w-12", className: styles.table.cellMuted, render: (_, i) => i + 1, skeleton: <Skeleton className="h-4 w-5" /> },
    { key: "tanggal", header: "Tanggal", className: styles.table.cellPrimary, render: (item) => formatDate(item.tanggal), skeleton: <Skeleton className="h-4 w-20" /> },
    { key: "pembeli", header: "Pembeli", className: styles.table.cellSecondary, render: (item) => item.pembeli, skeleton: <Skeleton className="h-4 w-24" /> },
    { key: "beratKg", header: "Berat", headerClassName: "text-right", className: `${styles.table.cellSecondary} text-right tabular-nums`, render: (item) => `${item.beratKg.toLocaleString("id-ID")} kg`, skeleton: <Skeleton className="h-4 w-14 ml-auto" /> },
    { key: "hargaPerKg", header: "Harga/Kg", headerClassName: "text-right", className: `${styles.table.cellSecondary} text-right tabular-nums`, render: (item) => formatCurrency(item.hargaPerKg), skeleton: <Skeleton className="h-4 w-20 ml-auto" /> },
    { key: "metodeBayar", header: "Metode", className: styles.table.cellSecondary, render: (item) => item.metodeBayar ? item.metodeBayar.charAt(0).toUpperCase() + item.metodeBayar.slice(1) : "-", skeleton: <Skeleton className="h-4 w-16" /> },
    { key: "totalHarga", header: "Total", headerClassName: "text-right", className: `${styles.table.cellPrimary} text-right tabular-nums font-medium text-emerald-600 dark:text-emerald-400`, render: (item) => formatCurrency(item.totalHarga), skeleton: <Skeleton className="h-4 w-24 ml-auto" /> },
  ];

  const filteredData = useMemo(() => data || [], [data]);

  const totalPages = Math.ceil((filteredData?.length || 0) / ITEMS_PER_PAGE);
  const paginatedData = filteredData?.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE) || [];

  const handleAdd = () => { setSelected(null); setFormOpen(true); };
  const handleEdit = (item: PenjualanTelur) => { setSelected(item); setFormOpen(true); };
  const handleDelete = (item: PenjualanTelur) => { setSelected(item); setDeleteOpen(true); };

  const handleFormSubmit = (formData: Omit<CreatePenjualanInput, "kandangId">) => {
    const dataWithKandang = { ...formData, kandangId: selectedKandangId! };
    if (selected) {
      updateMutation.mutate({ id: selected.id, data: dataWithKandang }, {
        onSuccess: () => { toast.success("Transaksi berhasil diperbarui"); setFormOpen(false); setSelected(null); },
        onError: (err) => toast.error(err.message || "Gagal memperbarui"),
      });
    } else {
      createMutation.mutate(dataWithKandang, {
        onSuccess: () => { toast.success("Penjualan berhasil dicatat"); setFormOpen(false); },
        onError: (err) => toast.error(err.message || "Gagal mencatat penjualan"),
      });
    }
  };

  const handleDeleteConfirm = () => {
    if (!selected) return;
    deleteMutation.mutate(selected.id, {
      onSuccess: () => { toast.success("Transaksi dihapus, stok dikembalikan"); setDeleteOpen(false); setSelected(null); },
      onError: (err) => toast.error(err.message || "Gagal menghapus"),
    });
  };

  if (!selectedKandangId || (isLoading && !data)) {
    return <PageSkeleton eyebrow="Telur" title="Penjualan Telur" description="Catat transaksi penjualan telur." statsCount={4} statsColumns={4} tableColumns={7} />;
  }

  if (isError) {
    return (
      <section className="space-y-6">
        <div><div className={styles.pageHeader.eyebrow}>Telur</div><h1 className={styles.pageHeader.title}>Penjualan Telur</h1></div>
        <Card className="p-6 text-center">
          <p className="text-red-500 mb-4">{error instanceof Error ? error.message : "Terjadi kesalahan"}</p>
          <Button variant="outline" onClick={() => refetch()}>Coba lagi</Button>
        </Card>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className={styles.pageHeader.eyebrow}>Telur</div>
          <h1 className={styles.pageHeader.title}>Penjualan Telur</h1>
          <p className={styles.pageHeader.description}>Catat transaksi penjualan telur.</p>
        </div>
        <Button onClick={handleAdd} className={styles.button.primary} disabled={(summaryData?.stokTersedia ?? 0) <= 0}>
          <Plus className="mr-2 h-4 w-4" />Tambah Penjualan
        </Button>
      </div>

      {(summaryData?.stokTersedia ?? 0) <= 0 && (
        <Card className="p-4 border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            <p className="text-sm text-amber-800 dark:text-amber-200">
              Stok telur habis. Input produksi terlebih dahulu di <a href="/client/dashboard/telur/produktivitas" className="underline font-medium">Produktivitas</a>.
            </p>
          </div>
        </Card>
      )}

      <DataStats stats={stats} columns={4} />
      <DataFiltersMemo config={filterConfig} onFilterChange={setFilters} />

      <Card className="p-4 sm:p-6">
        <DataTable data={paginatedData} columns={columns} isLoading={isLoading} startIndex={(currentPage - 1) * ITEMS_PER_PAGE} onEdit={handleEdit} onDelete={handleDelete} getRowKey={(item) => item.id} />
        {(filteredData?.length || 0) > 0 && <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={filteredData?.length || 0} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setCurrentPage} />}
      </Card>

      <PenjualanFormDialog open={formOpen} onOpenChange={setFormOpen} onSubmit={handleFormSubmit} isLoading={createMutation.isPending || updateMutation.isPending} penjualan={selected} stokTersedia={summaryData?.stokTersedia ?? 0} />
      <DeleteConfirmDialog open={deleteOpen} onOpenChange={setDeleteOpen} onConfirm={handleDeleteConfirm} isLoading={deleteMutation.isPending} title="Hapus Transaksi" description={`Hapus transaksi ini? Stok ${selected?.beratKg} kg akan dikembalikan.`} />
    </section>
  );
}
