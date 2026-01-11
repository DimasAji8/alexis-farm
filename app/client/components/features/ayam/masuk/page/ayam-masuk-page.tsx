"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/shared/pagination";
import { DeleteConfirmDialog } from "@/components/shared/delete-confirm-dialog";
import { DataTable, type ColumnDef } from "@/components/shared/data-table";
import { DataStats, type StatItem } from "@/components/shared/data-stats";
import { DataFilters, type FilterConfig } from "@/components/shared/data-filters";
import { PageSkeleton } from "@/components/shared/page-skeleton";
import { Plus } from "lucide-react";
import { styles } from "@/lib/styles";
import { useSelectedKandang } from "@/hooks/use-selected-kandang";
import { useKandangList } from "@/components/features/kandang/hooks/use-kandang";

import { AyamMasukFormDialog } from "../components/form-dialog";
import { useAyamMasukList, useCreateAyamMasuk, useUpdateAyamMasuk, useDeleteAyamMasuk } from "../hooks/use-ayam-masuk";
import type { AyamMasuk, CreateAyamMasukInput } from "../types";

const ITEMS_PER_PAGE = 10;

const formatDate = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
};

const filterConfig: FilterConfig[] = [
  { key: "bulan", label: "Bulan", type: "month" },
];

export function AyamMasukPage() {
  const { selectedKandangId } = useSelectedKandang();
  const { data: kandangList } = useKandangList();
  const { data, isLoading, isError, error, refetch } = useAyamMasukList(selectedKandangId);
  const createMutation = useCreateAyamMasuk();
  const updateMutation = useUpdateAyamMasuk();
  const deleteMutation = useDeleteAyamMasuk();

  const currentKandang = kandangList?.find(k => k.id === selectedKandangId);

  const [filters, setFilters] = useState<Record<string, string | null>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<AyamMasuk | null>(null);

  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.filter(item => {
      const month = filters.bulan_month != null ? Number(filters.bulan_month) : null;
      const year = filters.bulan_year != null ? Number(filters.bulan_year) : null;
      if (month !== null && year !== null) {
        const date = new Date(item.tanggal);
        if (date.getMonth() !== month || date.getFullYear() !== year) return false;
      }
      return true;
    });
  }, [data, filters]);

  const stats: StatItem[] = useMemo(() => {
    if (!data) return [];
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    
    const last6MonthsTotal = data.filter(item => new Date(item.tanggal) >= sixMonthsAgo)
      .reduce((sum, item) => sum + item.jumlahAyam, 0);
    
    const thisMonthTotal = data.filter(item => {
      const d = new Date(item.tanggal);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).reduce((sum, item) => sum + item.jumlahAyam, 0);
    
    return [
      { label: "6 Bulan Terakhir", value: last6MonthsTotal.toLocaleString("id-ID"), color: "emerald" },
      { label: "Bulan Ini", value: thisMonthTotal.toLocaleString("id-ID"), color: "blue" },
      { label: "Ayam Hidup", value: (currentKandang?.jumlahAyam ?? 0).toLocaleString("id-ID"), color: "slate" },
    ];
  }, [data, currentKandang]);

  const columns: ColumnDef<AyamMasuk>[] = [
    { key: "no", header: "No", headerClassName: "w-12", className: styles.table.cellMuted, render: (_, i) => i + 1, skeleton: <Skeleton className="h-4 w-5" /> },
    { key: "tanggal", header: "Tanggal", className: styles.table.cellPrimary, render: item => formatDate(item.tanggal), skeleton: <Skeleton className="h-4 w-20" /> },
    { key: "jumlah", header: "Jumlah", headerClassName: "text-right", className: `${styles.table.cellPrimary} text-right tabular-nums text-emerald-600`, render: item => item.jumlahAyam.toLocaleString("id-ID"), skeleton: <Skeleton className="h-4 w-12 ml-auto" /> },
  ];

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleFormSubmit = (formData: Omit<CreateAyamMasukInput, "kandangId">) => {
    const dataWithKandang = { ...formData, kandangId: selectedKandangId! };
    if (selected) {
      updateMutation.mutate({ id: selected.id, data: dataWithKandang }, {
        onSuccess: () => { toast.success("Data berhasil diperbarui"); setFormOpen(false); setSelected(null); },
        onError: (err) => toast.error(err.message || "Gagal memperbarui"),
      });
    } else {
      createMutation.mutate(dataWithKandang, {
        onSuccess: () => { toast.success("Data berhasil ditambahkan"); setFormOpen(false); },
        onError: (err) => toast.error(err.message || "Gagal menambahkan"),
      });
    }
  };

  const handleDeleteConfirm = () => {
    if (!selected) return;
    deleteMutation.mutate(selected.id, {
      onSuccess: () => { toast.success("Data berhasil dihapus"); setDeleteOpen(false); setSelected(null); },
      onError: (err) => toast.error(err.message || "Gagal menghapus"),
    });
  };

  if (isLoading && !data) return <PageSkeleton eyebrow="Ayam" title="Ayam Masuk" description="Rekap data ayam masuk ke kandang." statsCount={3} statsColumns={3} tableColumns={3} />;

  if (isError) {
    return (
      <section className="space-y-6">
        <div><div className={styles.pageHeader.eyebrow}>Ayam</div><h1 className={styles.pageHeader.title}>Ayam Masuk</h1></div>
        <Card className="p-6 text-center"><p className="text-red-500 mb-4">{error instanceof Error ? error.message : "Terjadi kesalahan"}</p><Button variant="outline" onClick={() => refetch()}>Coba lagi</Button></Card>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className={styles.pageHeader.eyebrow}>Ayam</div>
          <h1 className={styles.pageHeader.title}>Ayam Masuk</h1>
          <p className={styles.pageHeader.description}>Rekap data ayam masuk ke kandang.</p>
        </div>
        <Button onClick={() => { setSelected(null); setFormOpen(true); }} className={styles.button.primary}><Plus className="mr-2 h-4 w-4" />Tambah Data</Button>
      </div>

      <DataStats stats={stats} columns={3} />
      <DataFilters config={filterConfig} onFilterChange={f => { setFilters(f); setCurrentPage(1); }} />

      <Card className={styles.card.table}>
        <DataTable data={paginatedData} columns={columns} isLoading={isLoading} startIndex={(currentPage - 1) * ITEMS_PER_PAGE} onEdit={item => { setSelected(item); setFormOpen(true); }} onDelete={item => { setSelected(item); setDeleteOpen(true); }} getRowKey={item => item.id} />
        {filteredData.length > 0 && <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={filteredData.length} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setCurrentPage} />}
      </Card>

      <AyamMasukFormDialog open={formOpen} onOpenChange={setFormOpen} onSubmit={handleFormSubmit} isLoading={createMutation.isPending || updateMutation.isPending} data={selected} />
      <DeleteConfirmDialog open={deleteOpen} onOpenChange={setDeleteOpen} onConfirm={handleDeleteConfirm} isLoading={deleteMutation.isPending} title="Hapus Data" description={`Hapus data ayam masuk tanggal ${formatDate(selected?.tanggal)}? Jumlah ayam di kandang akan dikurangi.`} />
    </section>
  );
}
