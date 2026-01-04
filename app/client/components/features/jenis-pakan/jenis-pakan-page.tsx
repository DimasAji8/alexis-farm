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
import { Plus } from "lucide-react";
import { styles } from "@/lib/styles";

import { JenisPakanFormDialog } from "./jenis-pakan-form-dialog";
import { useJenisPakanList, useCreateJenisPakan, useUpdateJenisPakan, useDeleteJenisPakan } from "./hooks/use-jenis-pakan";
import type { JenisPakan } from "./jenis-pakan.types";
import type { CreateJenisPakanInput, UpdateJenisPakanInput } from "./jenis-pakan.api";

const ITEMS_PER_PAGE = 10;

const formatDate = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
};

const filterConfig: FilterConfig[] = [
  { key: "search", label: "Cari Jenis Pakan", type: "search", placeholder: "Cari kode atau nama..." },
  { key: "status", label: "Status", type: "select", options: [
    { value: "aktif", label: "Aktif" },
    { value: "tidak_aktif", label: "Tidak Aktif" },
  ]},
];

export function JenisPakanPage() {
  const { data, isLoading, isError, error, refetch } = useJenisPakanList();
  const createMutation = useCreateJenisPakan();
  const updateMutation = useUpdateJenisPakan();
  const deleteMutation = useDeleteJenisPakan();

  const [filters, setFilters] = useState<Record<string, string | null>>({ search: null, status: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<JenisPakan | null>(null);

  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.filter((item) => {
      const matchSearch = !filters.search || item.kode.toLowerCase().includes(filters.search.toLowerCase()) || item.nama.toLowerCase().includes(filters.search.toLowerCase());
      const matchStatus = !filters.status || (filters.status === "aktif" ? item.isActive : !item.isActive);
      return matchSearch && matchStatus;
    });
  }, [data, filters]);

  const stats: StatItem[] = useMemo(() => {
    const d = data || [];
    return [
      { label: "Total Jenis", value: d.length, color: "slate" },
      { label: "Aktif", value: d.filter((k) => k.isActive).length, color: "emerald" },
      { label: "Tidak Aktif", value: d.filter((k) => !k.isActive).length, color: "rose" },
    ];
  }, [data]);

  const columns: ColumnDef<JenisPakan>[] = [
    { key: "no", header: "No", headerClassName: "w-12", className: styles.table.cellMuted, render: (_, i) => i + 1, skeleton: <Skeleton className="h-4 w-5" /> },
    { key: "kode", header: "Kode", className: styles.table.cellPrimary, render: (item) => item.kode, skeleton: <Skeleton className="h-4 w-16" /> },
    { key: "nama", header: "Nama", className: styles.table.cellSecondary, render: (item) => item.nama, skeleton: <Skeleton className="h-4 w-24" /> },
    { key: "satuan", header: "Satuan", className: styles.table.cellTertiary, render: (item) => item.satuan, skeleton: <Skeleton className="h-4 w-12" /> },
    { key: "status", header: "Status", className: "py-3", render: (item) => <Badge variant={item.isActive ? "success" : "inactive"} className="text-xs">{item.isActive ? "Aktif" : "Tidak Aktif"}</Badge>, skeleton: <Skeleton className="h-5 w-14 rounded-full" /> },
    { key: "updated", header: "Diperbarui", headerClassName: "hidden md:table-cell", className: `${styles.table.cellTertiary} hidden md:table-cell`, render: (item) => formatDate(item.updatedAt), skeleton: <Skeleton className="h-4 w-20" /> },
  ];

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleFilterChange = (f: Record<string, string | null>) => { setFilters(f); setCurrentPage(1); };
  const handleAdd = () => { setSelected(null); setFormOpen(true); };
  const handleEdit = (item: JenisPakan) => { setSelected(item); setFormOpen(true); };
  const handleDelete = (item: JenisPakan) => { setSelected(item); setDeleteOpen(true); };

  const handleFormSubmit = (formData: CreateJenisPakanInput | UpdateJenisPakanInput) => {
    if (selected) {
      updateMutation.mutate({ id: selected.id, data: formData }, {
        onSuccess: () => { toast.success("Jenis pakan berhasil diperbarui"); setFormOpen(false); setSelected(null); },
        onError: (err) => toast.error(err.message || "Gagal memperbarui"),
      });
    } else {
      createMutation.mutate(formData as CreateJenisPakanInput, {
        onSuccess: () => { toast.success("Jenis pakan berhasil ditambahkan"); setFormOpen(false); },
        onError: (err) => toast.error(err.message || "Gagal menambahkan"),
      });
    }
  };

  const handleDeleteConfirm = () => {
    if (!selected) return;
    deleteMutation.mutate(selected.id, {
      onSuccess: () => { toast.success("Jenis pakan berhasil dihapus"); setDeleteOpen(false); setSelected(null); },
      onError: (err) => toast.error(err.message || "Gagal menghapus"),
    });
  };

  const showSkeleton = isLoading && !data;

  if (showSkeleton) {
    return (
      <section className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className={styles.pageHeader.eyebrow}>Master Data</div>
            <h1 className={styles.pageHeader.title}>Jenis Pakan</h1>
            <p className={styles.pageHeader.description}>Kelola daftar jenis pakan untuk pencatatan.</p>
          </div>
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[1,2,3].map((i) => <Card key={i} className="p-6"><Skeleton className="h-4 w-20 mb-2" /><Skeleton className="h-8 w-12" /></Card>)}
        </div>
        <Card className="p-6"><div className="flex gap-4"><Skeleton className="h-10 flex-1" /><Skeleton className="h-10 w-40" /></div></Card>
        <Card className={styles.card.table}><DataTable data={[]} columns={columns} isLoading getRowKey={() => ""} showActions={false} /></Card>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="space-y-6">
        <div><div className={styles.pageHeader.eyebrow}>Master Data</div><h1 className={styles.pageHeader.title}>Jenis Pakan</h1></div>
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
          <h1 className={styles.pageHeader.title}>Jenis Pakan</h1>
          <p className={styles.pageHeader.description}>Kelola daftar jenis pakan untuk pencatatan.</p>
        </div>
        <Button onClick={handleAdd} className={styles.button.primary}>
          <Plus className="mr-2 h-4 w-4" />Tambah Jenis Pakan
        </Button>
      </div>

      <DataStats stats={stats} columns={3} />
      <DataFilters config={filterConfig} onFilterChange={handleFilterChange} />

      <Card className={styles.card.table}>
        <DataTable data={paginatedData} columns={columns} isLoading={isLoading} startIndex={(currentPage - 1) * ITEMS_PER_PAGE} onEdit={handleEdit} onDelete={handleDelete} getRowKey={(item) => item.id} />
        {filteredData.length > 0 && <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={filteredData.length} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setCurrentPage} />}
      </Card>

      <JenisPakanFormDialog open={formOpen} onOpenChange={setFormOpen} onSubmit={handleFormSubmit} isLoading={createMutation.isPending || updateMutation.isPending} data={selected} />
      <DeleteConfirmDialog open={deleteOpen} onOpenChange={setDeleteOpen} onConfirm={handleDeleteConfirm} isLoading={deleteMutation.isPending} title="Hapus Jenis Pakan" description={`Hapus "${selected?.nama}"? Tindakan ini tidak dapat dibatalkan.`} />
    </section>
  );
}
