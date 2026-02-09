"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Pagination } from "@/components/shared/pagination";
import { DeleteConfirmDialog } from "@/components/shared/delete-confirm-dialog";
import { DataTable, type ColumnDef } from "@/components/shared/data-table";
import { DataStats, type StatItem } from "@/components/shared/data-stats";
import { DataFilters, type FilterConfig } from "@/components/shared/data-filters";
import { PageSkeleton } from "@/components/shared/page-skeleton";
import { Plus } from "lucide-react";
import { styles } from "@/lib/styles";

import { KandangFormDialog } from "../components/form-dialog";
import { useKandangList, useCreateKandang, useUpdateKandang, useDeleteKandang } from "../hooks/use-kandang";
import type { Kandang, CreateKandangInput, UpdateKandangInput } from "../types";

const ITEMS_PER_PAGE = 10;

const formatDate = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
};

const getStatusVariant = (status: string) => {
  const variants: Record<string, "success" | "warning" | "inactive"> = { aktif: "success", maintenance: "warning", tidak_aktif: "inactive" };
  return variants[status] || "inactive";
};

const formatStatus = (status: string) => status?.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase()) || "-";

const filterConfig: FilterConfig[] = [
  { key: "search", label: "Cari Kandang", type: "search", placeholder: "Cari kode atau nama..." },
  { key: "status", label: "Status", type: "select", options: [
    { value: "aktif", label: "Aktif" },
    { value: "tidak_aktif", label: "Tidak Aktif" },
    { value: "maintenance", label: "Maintenance" },
  ]},
];

export function KandangPage() {
  const { data, isLoading, isError, error, refetch } = useKandangList();
  const createMutation = useCreateKandang();
  const updateMutation = useUpdateKandang();
  const deleteMutation = useDeleteKandang();

  const [filters, setFilters] = useState<Record<string, string | null>>({ search: null, status: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<Kandang | null>(null);

  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.filter((item) => {
      const matchSearch = !filters.search || item.kode.toLowerCase().includes(filters.search.toLowerCase()) || item.nama.toLowerCase().includes(filters.search.toLowerCase());
      const matchStatus = !filters.status || item.status === filters.status;
      return matchSearch && matchStatus;
    });
  }, [data, filters]);

  const stats: StatItem[] = useMemo(() => {
    const d = data || [];
    return [
      { label: "Total Kandang", value: d.length, color: "slate" },
      { label: "Kandang Aktif", value: d.filter((k) => k.status === "aktif").length, color: "emerald" },
      { label: "Tidak Aktif", value: d.filter((k) => k.status === "tidak_aktif").length, color: "rose" },
      { label: "Maintenance", value: d.filter((k) => k.status === "maintenance").length, color: "amber" },
      { label: "Total Ayam", value: d.reduce((sum, k) => sum + (k.jumlahAyam || 0), 0).toLocaleString("id-ID"), color: "blue" },
    ];
  }, [data]);

  const columns: ColumnDef<Kandang>[] = [
    { key: "no", header: "No", headerClassName: "w-12", className: styles.table.cellMuted, render: (_, i) => i + 1, skeleton: <Skeleton className="h-4 w-5" /> },
    { key: "kode", header: "Kode", className: styles.table.cellPrimary, render: (item) => item.kode, skeleton: <Skeleton className="h-4 w-16" /> },
    { key: "nama", header: "Nama", className: styles.table.cellSecondary, render: (item) => item.nama, skeleton: <Skeleton className="h-4 w-24" /> },
    { key: "lokasi", header: "Lokasi", headerClassName: "hidden sm:table-cell", className: `${styles.table.cellTertiary} hidden sm:table-cell`, render: (item) => item.lokasi || "-", skeleton: <Skeleton className="h-4 w-16" /> },
    { key: "ayam", header: "Ayam", headerClassName: "text-right", className: `${styles.table.cellSecondary} text-right tabular-nums`, render: (item) => (item.jumlahAyam ?? 0).toLocaleString("id-ID"), skeleton: <Skeleton className="h-4 w-10 ml-auto" /> },
    { key: "status", header: "Status", className: "py-3", render: (item) => <Badge variant={getStatusVariant(item.status)} className="text-xs">{formatStatus(item.status)}</Badge>, skeleton: <Skeleton className="h-5 w-14 rounded-full" /> },
    { key: "updated", header: "Diperbarui", headerClassName: "hidden md:table-cell", className: `${styles.table.cellTertiary} hidden md:table-cell`, render: (item) => formatDate(item.updatedAt), skeleton: <Skeleton className="h-4 w-20" /> },
  ];

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleFilterChange = (f: Record<string, string | null>) => { setFilters(f); setCurrentPage(1); };
  const handleAdd = () => { setSelected(null); setFormOpen(true); };
  const handleEdit = (item: Kandang) => { setSelected(item); setFormOpen(true); };
  const handleDelete = (item: Kandang) => { setSelected(item); setDeleteOpen(true); };

  const handleFormSubmit = (formData: CreateKandangInput | UpdateKandangInput) => {
    if (selected) {
      updateMutation.mutate({ id: selected.id, data: formData }, {
        onSuccess: () => { toast.success("Kandang berhasil diperbarui"); setFormOpen(false); setSelected(null); },
        onError: (err) => toast.error(err.message || "Gagal memperbarui"),
      });
    } else {
      createMutation.mutate(formData as CreateKandangInput, {
        onSuccess: () => { toast.success("Kandang berhasil ditambahkan"); setFormOpen(false); },
        onError: (err) => toast.error(err.message || "Gagal menambahkan"),
      });
    }
  };

  const handleDeleteConfirm = () => {
    if (!selected) return;
    deleteMutation.mutate(selected.id, {
      onSuccess: () => { toast.success("Kandang berhasil dihapus"); setDeleteOpen(false); setSelected(null); },
      onError: (err) => toast.error(err.message || "Gagal menghapus"),
    });
  };

  const showSkeleton = isLoading && !data;

  if (showSkeleton) {
    return (
      <PageSkeleton
        eyebrow="Master Data"
        title="Kandang"
        description="Kelola data kandang, kapasitas, dan status operasional."
        statsCount={0}
        tableColumns={5}
        showFilter={false}
      />
    );
  }

  if (isError) {
    return (
      <section className="space-y-6">
        <div><div className={styles.pageHeader.eyebrow}>Master Data</div><h1 className={styles.pageHeader.title}>Kandang</h1></div>
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
          <div className={styles.pageHeader.eyebrow}>Master Data</div>
          <h1 className={styles.pageHeader.title}>Kandang</h1>
          <p className={styles.pageHeader.description}>Kelola data kandang, kapasitas, dan status operasional.</p>
        </div>
        <Button onClick={handleAdd} className={styles.button.primary}>
          <Plus className="mr-2 h-4 w-4" />Tambah Kandang
        </Button>
      </div>

      <DataStats stats={stats} columns={5} />
      <DataFilters config={filterConfig} onFilterChange={handleFilterChange} />

      <Card className={styles.card.table}>
        <DataTable data={paginatedData} columns={columns} isLoading={isLoading} startIndex={(currentPage - 1) * ITEMS_PER_PAGE} onEdit={handleEdit} onDelete={handleDelete} getRowKey={(item) => item.id} />
        {filteredData.length > 0 && <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={filteredData.length} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setCurrentPage} />}
      </Card>

      <KandangFormDialog open={formOpen} onOpenChange={setFormOpen} onSubmit={handleFormSubmit} isLoading={createMutation.isPending || updateMutation.isPending} kandang={selected} />
      <DeleteConfirmDialog open={deleteOpen} onOpenChange={setDeleteOpen} onConfirm={handleDeleteConfirm} isLoading={deleteMutation.isPending} title="Hapus Kandang" description={`Hapus "${selected?.nama}"? Tindakan ini tidak dapat dibatalkan.`} />
    </section>
  );
}
