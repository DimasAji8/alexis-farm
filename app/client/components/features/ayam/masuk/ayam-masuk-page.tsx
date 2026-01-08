"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Pagination } from "@/components/shared/pagination";
import { DeleteConfirmDialog } from "@/components/shared/delete-confirm-dialog";
import { DataTable, type ColumnDef } from "@/components/shared/data-table";
import { DataStats, type StatItem } from "@/components/shared/data-stats";
import { DataFilters, type FilterConfig } from "@/components/shared/data-filters";
import { Plus } from "lucide-react";
import { styles } from "@/lib/styles";

import { AyamMasukFormDialog } from "./ayam-masuk-form-dialog";
import { useAyamMasukList, useCreateAyamMasuk, useUpdateAyamMasuk, useDeleteAyamMasuk } from "./hooks/use-ayam-masuk";
import { useKandangList } from "@/components/features/kandang/hooks/use-kandang";
import type { AyamMasuk } from "./ayam-masuk.types";
import type { CreateAyamMasukInput, UpdateAyamMasukInput } from "./ayam-masuk.api";

const ITEMS_PER_PAGE = 10;

const formatDate = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
};

const filterConfig: FilterConfig[] = [
  { key: "search", label: "Cari", type: "search", placeholder: "Cari kandang..." },
  { key: "kandangId", label: "Kandang", type: "select", options: [] },
];

export function AyamMasukPage() {
  const { data, isLoading, isError, error, refetch } = useAyamMasukList();
  const { data: kandangList } = useKandangList();
  const createMutation = useCreateAyamMasuk();
  const updateMutation = useUpdateAyamMasuk();
  const deleteMutation = useDeleteAyamMasuk();

  const [filters, setFilters] = useState<Record<string, string | null>>({ search: null, kandangId: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<AyamMasuk | null>(null);

  const dynamicFilterConfig = useMemo(() => {
    const config = [...filterConfig];
    const kandangFilter = config.find(f => f.key === "kandangId");
    if (kandangFilter && kandangList) {
      kandangFilter.options = kandangList.map(k => ({ value: k.id, label: `${k.kode} - ${k.nama}` }));
    }
    return config;
  }, [kandangList]);

  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.filter((item) => {
      const matchSearch = !filters.search || item.kandang.kode.toLowerCase().includes(filters.search.toLowerCase()) || item.kandang.nama.toLowerCase().includes(filters.search.toLowerCase());
      const matchKandang = !filters.kandangId || item.kandangId === filters.kandangId;
      return matchSearch && matchKandang;
    });
  }, [data, filters]);

  const stats: StatItem[] = useMemo(() => {
    const d = filteredData || [];
    const totalAyam = d.reduce((sum, item) => sum + item.jumlahAyam, 0);
    const thisMonth = d.filter(item => {
      const date = new Date(item.tanggal);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    });
    const totalBulanIni = thisMonth.reduce((sum, item) => sum + item.jumlahAyam, 0);
    return [
      { label: "Total Record", value: d.length, color: "slate" },
      { label: "Total Ayam Masuk", value: totalAyam.toLocaleString("id-ID"), color: "emerald" },
      { label: "Bulan Ini", value: totalBulanIni.toLocaleString("id-ID"), color: "blue" },
    ];
  }, [filteredData]);

  const columns: ColumnDef<AyamMasuk>[] = [
    { key: "no", header: "No", headerClassName: "w-12", className: styles.table.cellMuted, render: (_, i) => i + 1, skeleton: <Skeleton className="h-4 w-5" /> },
    { key: "tanggal", header: "Tanggal", className: styles.table.cellPrimary, render: (item) => formatDate(item.tanggal), skeleton: <Skeleton className="h-4 w-20" /> },
    { key: "kandang", header: "Kandang", className: styles.table.cellSecondary, render: (item) => `${item.kandang.kode} - ${item.kandang.nama}`, skeleton: <Skeleton className="h-4 w-32" /> },
    { key: "jumlah", header: "Jumlah", headerClassName: "text-right", className: `${styles.table.cellPrimary} text-right tabular-nums`, render: (item) => item.jumlahAyam.toLocaleString("id-ID"), skeleton: <Skeleton className="h-4 w-12 ml-auto" /> },
  ];

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleFilterChange = (f: Record<string, string | null>) => { setFilters(f); setCurrentPage(1); };
  const handleAdd = () => { setSelected(null); setFormOpen(true); };
  const handleEdit = (item: AyamMasuk) => { setSelected(item); setFormOpen(true); };
  const handleDelete = (item: AyamMasuk) => { setSelected(item); setDeleteOpen(true); };

  const handleFormSubmit = (formData: CreateAyamMasukInput | UpdateAyamMasukInput) => {
    if (selected) {
      updateMutation.mutate({ id: selected.id, data: formData }, {
        onSuccess: () => { toast.success("Data berhasil diperbarui"); setFormOpen(false); setSelected(null); },
        onError: (err) => toast.error(err.message || "Gagal memperbarui"),
      });
    } else {
      createMutation.mutate(formData as CreateAyamMasukInput, {
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

  if (isLoading && !data) {
    return (
      <section className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className={styles.pageHeader.eyebrow}>Ayam</div>
            <h1 className={styles.pageHeader.title}>Ayam Masuk</h1>
            <p className={styles.pageHeader.description}>Rekap data ayam yang masuk ke kandang.</p>
          </div>
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[1,2,3].map((i) => <Card key={i} className="p-6"><Skeleton className="h-4 w-20 mb-2" /><Skeleton className="h-8 w-12" /></Card>)}
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="space-y-6">
        <div><div className={styles.pageHeader.eyebrow}>Ayam</div><h1 className={styles.pageHeader.title}>Ayam Masuk</h1></div>
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
          <div className={styles.pageHeader.eyebrow}>Ayam</div>
          <h1 className={styles.pageHeader.title}>Ayam Masuk</h1>
          <p className={styles.pageHeader.description}>Rekap data ayam yang masuk ke kandang.</p>
        </div>
        <Button onClick={handleAdd} className={styles.button.primary}>
          <Plus className="mr-2 h-4 w-4" />Tambah Data
        </Button>
      </div>

      <DataStats stats={stats} columns={3} />
      <DataFilters config={dynamicFilterConfig} onFilterChange={handleFilterChange} />

      <Card className={styles.card.table}>
        <DataTable data={paginatedData} columns={columns} isLoading={isLoading} startIndex={(currentPage - 1) * ITEMS_PER_PAGE} onEdit={handleEdit} onDelete={handleDelete} getRowKey={(item) => item.id} />
        {filteredData.length > 0 && <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={filteredData.length} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setCurrentPage} />}
      </Card>

      <AyamMasukFormDialog open={formOpen} onOpenChange={setFormOpen} onSubmit={handleFormSubmit} isLoading={createMutation.isPending || updateMutation.isPending} ayamMasuk={selected} kandangList={kandangList} />
      <DeleteConfirmDialog open={deleteOpen} onOpenChange={setDeleteOpen} onConfirm={handleDeleteConfirm} isLoading={deleteMutation.isPending} title="Hapus Data" description={`Hapus data ayam masuk tanggal ${formatDate(selected?.tanggal)}? Jumlah ayam di kandang akan dikurangi.`} />
    </section>
  );
}
