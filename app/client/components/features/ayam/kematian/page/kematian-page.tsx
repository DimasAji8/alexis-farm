"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Pagination } from "@/components/shared/pagination";
import { DeleteConfirmDialog } from "@/components/shared/delete-confirm-dialog";
import { DataTable, type ColumnDef } from "@/components/shared/data-table";
import { DataStats, type StatItem } from "@/components/shared/data-stats";
import { DataFiltersMemo as DataFilters, type FilterConfig } from "@/components/shared/data-filters";
import { Plus } from "lucide-react";
import { styles } from "@/lib/styles";
import { useSelectedKandang } from "@/hooks/use-selected-kandang";
import { useMonthFilter } from "@/hooks/use-month-filter";
import { useKandangList } from "@/components/features/kandang/hooks/use-kandang";

import { KematianFormDialog } from "../components/form-dialog";
import { useKematianList, useCreateKematian, useUpdateKematian, useDeleteKematian } from "../hooks/use-kematian";
import type { KematianAyam, CreateKematianInput } from "../types";

const ITEMS_PER_PAGE = 10;

const formatDate = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
};

const filterConfig: FilterConfig[] = [
  { key: "bulan", label: "Bulan", type: "month" },
];

export function KematianPage() {
  const { selectedKandangId } = useSelectedKandang();
  const { data: kandangList } = useKandangList();
  const [filters, setFilters] = useState<Record<string, string | null>>({});
  
  const bulanFilter = useMonthFilter(filters.bulan_month, filters.bulan_year);
  const { data, isLoading, isError, error, refetch } = useKematianList(selectedKandangId, bulanFilter);
  const createMutation = useCreateKematian();
  const updateMutation = useUpdateKematian();
  const deleteMutation = useDeleteKematian();

  const currentKandang = kandangList?.find(k => k.id === selectedKandangId);

  const [currentPage, setCurrentPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<KematianAyam | null>(null);

  const summaryParams = useMemo(() => {
    const params: Record<string, string> = { type: "summary" };
    if (selectedKandangId) params.kandangId = selectedKandangId;
    if (bulanFilter) params.bulan = bulanFilter;
    return params;
  }, [selectedKandangId, bulanFilter]);

  const summaryUrl = useMemo(() => {
    const params = new URLSearchParams(summaryParams);
    return `/api/ayam/kematian?${params.toString()}`;
  }, [summaryParams]);

  const { data: summaryData } = useQuery({
    queryKey: ["kematian-summary", summaryParams],
    queryFn: () => fetch(summaryUrl).then(res => res.json()).then(r => r.data),
    staleTime: 5 * 60 * 1000,
    enabled: !!selectedKandangId,
  });

  const filteredData = useMemo(() => {
    return data || [];
  }, [data]);

  const stats: StatItem[] = useMemo(() => {
    const s = summaryData ?? { totalKematian: 0, totalKematianBulanIni: 0, persentaseKematian: 0, rataRataPerHari: 0 };
    return [
      { label: "Total Kematian", value: (s.totalKematian ?? 0).toLocaleString("id-ID"), color: "rose" },
      { label: "Bulan Ini", value: (s.totalKematianBulanIni ?? 0).toLocaleString("id-ID"), color: "amber" },
      { label: "Ayam Hidup", value: (currentKandang?.jumlahAyam ?? 0).toLocaleString("id-ID"), color: "slate" },
    ];
  }, [summaryData, currentKandang]);

  const columns: ColumnDef<KematianAyam>[] = [
    { key: "no", header: "No", headerClassName: "w-12", className: styles.table.cellMuted, render: (_, i) => i + 1, skeleton: <Skeleton className="h-4 w-5" /> },
    { key: "tanggal", header: "Tanggal", className: styles.table.cellPrimary, render: (item) => formatDate(item.tanggal), skeleton: <Skeleton className="h-4 w-20" /> },
    { key: "jumlah", header: "Jumlah", headerClassName: "text-right", className: `${styles.table.cellPrimary} text-right tabular-nums text-red-600 dark:text-red-400`, render: (item) => item.jumlahMati.toLocaleString("id-ID"), skeleton: <Skeleton className="h-4 w-12 ml-auto" /> },
    { key: "keterangan", header: "Keterangan", headerClassName: "hidden md:table-cell", className: `${styles.table.cellTertiary} hidden md:table-cell`, render: (item) => item.keterangan || "-", skeleton: <Skeleton className="h-4 w-24" /> },
  ];

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleFilterChange = (f: Record<string, string | null>) => { setFilters(f); setCurrentPage(1); };
  const handleAdd = () => { setSelected(null); setFormOpen(true); };
  const handleEdit = (item: KematianAyam) => { setSelected(item); setFormOpen(true); };
  const handleDelete = (item: KematianAyam) => { setSelected(item); setDeleteOpen(true); };

  const handleFormSubmit = (formData: Omit<CreateKematianInput, "kandangId">) => {
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

  if (isLoading && !data) {
    return (
      <section className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className={styles.pageHeader.eyebrow}>Ayam</div>
            <h1 className={styles.pageHeader.title}>Kematian Ayam</h1>
            <p className={styles.pageHeader.description}>Rekap data kematian ayam di kandang.</p>
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
        <div><div className={styles.pageHeader.eyebrow}>Ayam</div><h1 className={styles.pageHeader.title}>Kematian Ayam</h1></div>
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
          <h1 className={styles.pageHeader.title}>Kematian Ayam</h1>
          <p className={styles.pageHeader.description}>Rekap data kematian ayam di kandang.</p>
        </div>
        <Button onClick={handleAdd} className={styles.button.primary}>
          <Plus className="mr-2 h-4 w-4" />Tambah Data
        </Button>
      </div>

      <DataStats stats={stats} columns={3} />
      <DataFilters config={filterConfig} onFilterChange={handleFilterChange} />

      <Card className="p-4 sm:p-6">
        <DataTable data={paginatedData} columns={columns} isLoading={isLoading} startIndex={(currentPage - 1) * ITEMS_PER_PAGE} onEdit={handleEdit} onDelete={handleDelete} getRowKey={(item) => item.id} />
        {filteredData.length > 0 && <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={filteredData.length} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setCurrentPage} />}
      </Card>

      <KematianFormDialog open={formOpen} onOpenChange={setFormOpen} onSubmit={handleFormSubmit} isLoading={createMutation.isPending || updateMutation.isPending} kematian={selected} />
      <DeleteConfirmDialog open={deleteOpen} onOpenChange={setDeleteOpen} onConfirm={handleDeleteConfirm} isLoading={deleteMutation.isPending} title="Hapus Data" description={`Hapus data kematian tanggal ${formatDate(selected?.tanggal)}? Jumlah ayam di kandang akan ditambahkan kembali.`} />
    </section>
  );
}
