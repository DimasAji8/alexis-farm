"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/shared/pagination";
import { DataTable, type ColumnDef } from "@/components/shared/data-table";
import { DataStats, type StatItem } from "@/components/shared/data-stats";
import { DataFiltersMemo, type FilterConfig } from "@/components/shared/data-filters";
import { PageSkeleton } from "@/components/shared/page-skeleton";
import { Plus } from "lucide-react";
import { styles } from "@/lib/styles";
import { useSelectedKandang } from "@/hooks/use-selected-kandang";
import { useMonthFilter } from "@/hooks/use-month-filter";
import { useKandangList } from "@/components/features/kandang/hooks/use-kandang";

import { ProduktivitasFormDialog } from "../components/form-dialog";
import { useProduktivitasList, useCreateProduktivitas, useUpdateProduktivitas } from "../hooks/use-produktivitas";
import type { ProduktivitasTelur, CreateProduktivitasInput } from "../types";

const ITEMS_PER_PAGE = 10;

const formatDate = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
};

const filterConfig: FilterConfig[] = [
  { key: "bulan", label: "Bulan", type: "month" },
];

export function ProduktivitasPage() {
  const { selectedKandangId } = useSelectedKandang();
  const { data: kandangList } = useKandangList();
  const [filters, setFilters] = useState<Record<string, string | null>>({});
  const bulanFilter = useMonthFilter(filters.bulan_month, filters.bulan_year);
  const { data, isLoading, isError, error, refetch } = useProduktivitasList(selectedKandangId, bulanFilter);
  const createMutation = useCreateProduktivitas();
  const updateMutation = useUpdateProduktivitas();

  const [currentPage, setCurrentPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState<ProduktivitasTelur | null>(null);

  const summaryParams = useMemo(() => {
    const params: Record<string, string> = { type: "summary" };
    if (selectedKandangId) params.kandangId = selectedKandangId;
    if (bulanFilter) params.bulan = bulanFilter;
    return params;
  }, [selectedKandangId, bulanFilter]);

  const summaryUrl = useMemo(() => {
    const params = new URLSearchParams(summaryParams);
    return `/api/telur/produksi?${params.toString()}`;
  }, [summaryParams]);

  const { data: summary } = useQuery({
    queryKey: ["produktivitas-telur-summary", summaryParams],
    queryFn: () => fetch(summaryUrl).then(res => res.json()).then(r => r.data),
    staleTime: 5 * 60 * 1000,
    enabled: !!selectedKandangId,
  });

  const currentKandang = kandangList?.find(k => k.id === selectedKandangId);

  const stats: StatItem[] = useMemo(() => {
    if (!summary) return [
      { label: "Telur Bagus", value: "0 butir", color: "emerald" },
      { label: "Telur Rusak", value: "0 butir", color: "rose" },
      { label: "% Bagus", value: "0%", color: "blue" },
      { label: "Total Berat", value: "0 kg", color: "amber" },
      { label: "Total Ayam", value: (currentKandang?.jumlahAyam ?? 0).toLocaleString("id-ID"), color: "slate" },
    ];
    
    return [
      { label: "Telur Bagus", value: (summary.totalBagus || 0).toLocaleString("id-ID") + " butir", color: "emerald" },
      { label: "Telur Rusak", value: (summary.totalTidakBagus || 0).toLocaleString("id-ID") + " butir", color: "rose" },
      { label: "% Bagus", value: summary.persentaseHenDay.toFixed(1) + "%", color: "blue" },
      { label: "Total Berat", value: (summary.totalKg || 0).toLocaleString("id-ID", { maximumFractionDigits: 2 }) + " kg", color: "amber" },
      { label: "Total Ayam", value: (currentKandang?.jumlahAyam ?? 0).toLocaleString("id-ID"), color: "slate" },
    ];
  }, [summary, currentKandang]);

  const columns: ColumnDef<ProduktivitasTelur>[] = [
    { key: "no", header: "No", headerClassName: "w-12", className: styles.table.cellMuted, render: (_, i) => i + 1, skeleton: <Skeleton className="h-4 w-5" /> },
    { key: "tanggal", header: "Tanggal", className: styles.table.cellPrimary, render: (item) => formatDate(item.tanggal), skeleton: <Skeleton className="h-4 w-20" /> },
    { key: "bagus", header: "Bagus (butir)", headerClassName: "text-center", className: `${styles.table.cellPrimary} text-center tabular-nums text-emerald-600 dark:text-emerald-400`, render: (item) => item.jumlahBagusButir.toLocaleString("id-ID"), skeleton: <Skeleton className="h-4 w-12 mx-auto" /> },
    { key: "tidakBagus", header: "Rusak (butir)", headerClassName: "text-center hidden sm:table-cell", className: `${styles.table.cellSecondary} text-center tabular-nums hidden sm:table-cell text-rose-600 dark:text-rose-400`, render: (item) => item.jumlahTidakBagusButir.toLocaleString("id-ID"), skeleton: <Skeleton className="h-4 w-12 mx-auto" /> },
    { key: "persen", header: "% Bagus", headerClassName: "text-center hidden sm:table-cell", className: `${styles.table.cellSecondary} text-center tabular-nums hidden sm:table-cell`, render: (item) => { const jumlahAyam = currentKandang?.jumlahAyam ?? 0; return jumlahAyam > 0 ? ((item.totalButir / jumlahAyam) * 100).toFixed(1) + "%" : "-"; }, skeleton: <Skeleton className="h-4 w-12 mx-auto" /> },
    { key: "totalKg", header: "Berat (kg)", headerClassName: "text-center", className: `${styles.table.cellSecondary} text-center tabular-nums`, render: (item) => item.totalKg.toLocaleString("id-ID", { maximumFractionDigits: 2 }), skeleton: <Skeleton className="h-4 w-12 mx-auto" /> },
  ];

  const totalPages = Math.ceil((data?.length || 0) / ITEMS_PER_PAGE);
  const paginatedData = data?.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE) || [];

  const handleFormSubmit = (formData: Omit<CreateProduktivitasInput, "kandangId">) => {
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

  if (isLoading && !data) {
    return <PageSkeleton eyebrow="Telur" title="Produktivitas Telur" description="Catat dan kelola produktivitas telur harian." statsCount={5} statsColumns={5} tableColumns={6} />;
  }

  if (isError) {
    return (
      <section className="space-y-6">
        <div><div className={styles.pageHeader.eyebrow}>Telur</div><h1 className={styles.pageHeader.title}>Produktivitas Telur</h1></div>
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
          <h1 className={styles.pageHeader.title}>Produktivitas Telur</h1>
          <p className={styles.pageHeader.description}>Catat dan kelola produktivitas telur harian.</p>
        </div>
        <Button onClick={() => { setSelected(null); setFormOpen(true); }} className={styles.button.primary}>
          <Plus className="mr-2 h-4 w-4" />Tambah Data
        </Button>
      </div>

      <DataStats stats={stats} columns={5} />
      <DataFiltersMemo config={filterConfig} onFilterChange={setFilters} />

      <Card className="p-4 sm:p-6">
        <DataTable data={paginatedData} columns={columns} isLoading={isLoading} startIndex={(currentPage - 1) * ITEMS_PER_PAGE} onEdit={item => { setSelected(item); setFormOpen(true); }} getRowKey={(item) => item.id} showActions />
        {(data?.length || 0) > 0 && <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={data?.length || 0} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setCurrentPage} />}
      </Card>

      <ProduktivitasFormDialog open={formOpen} onOpenChange={setFormOpen} onSubmit={handleFormSubmit} isLoading={createMutation.isPending || updateMutation.isPending} data={selected} />
    </section>
  );
}
