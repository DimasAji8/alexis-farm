"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DataStats, type StatItem } from "@/components/shared/data-stats";
import { DataFilters, type FilterConfig } from "@/components/shared/data-filters";
import { DeleteConfirmDialog } from "@/components/shared/delete-confirm-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { styles } from "@/lib/styles";

import { PengeluaranFormDialog } from "../components/form-dialog";
import { usePengeluaranList, useCreatePengeluaran, useUpdatePengeluaran, useDeletePengeluaran } from "../hooks/use-pengeluaran";
import type { PengeluaranOperasional, CreatePengeluaranInput } from "../types";

const formatDate = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
};

const formatCurrency = (value: number) => `Rp ${value.toLocaleString("id-ID")}`;

const filterConfig: FilterConfig[] = [
  { key: "bulan", label: "Bulan", type: "month" },
];

export function PengeluaranPage() {
  const { data, isLoading, isError, error, refetch } = usePengeluaranList();
  const createMutation = useCreatePengeluaran();
  const updateMutation = useUpdatePengeluaran();
  const deleteMutation = useDeletePengeluaran();

  const [filters, setFilters] = useState<Record<string, string | null>>({});
  const [formOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState<PengeluaranOperasional | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<PengeluaranOperasional | null>(null);

  const { filteredData, stats } = useMemo(() => {
    if (!data) return { filteredData: [], stats: [] };

    const month = filters.bulan_month != null ? Number(filters.bulan_month) : null;
    const year = filters.bulan_year != null ? Number(filters.bulan_year) : null;

    const filtered = data.filter((item) => {
      if (month !== null && year !== null) {
        const date = new Date(item.tanggal);
        if (date.getMonth() !== month || date.getFullYear() !== year) return false;
      }
      return true;
    });

    const totalPengeluaran = filtered.reduce((sum, item) => sum + item.jumlah, 0);
    const byKategori = filtered.reduce((acc, item) => {
      acc[item.kategori] = (acc[item.kategori] || 0) + item.jumlah;
      return acc;
    }, {} as Record<string, number>);

    const topKategori = Object.entries(byKategori).sort((a, b) => b[1] - a[1])[0];

    const stats: StatItem[] = [
      { label: "Total Pengeluaran", value: formatCurrency(totalPengeluaran), color: "rose" },
      { label: "Jumlah Transaksi", value: filtered.length.toString(), color: "blue" },
      { label: "Kategori Terbesar", value: topKategori ? `${topKategori[0]} (${formatCurrency(topKategori[1])})` : "-", color: "amber" },
    ];

    return { filteredData: filtered, stats };
  }, [data, filters]);

  const handleFormSubmit = (formData: Omit<CreatePengeluaranInput, "bukti">) => {
    if (selected) {
      updateMutation.mutate(
        { id: selected.id, data: formData },
        {
          onSuccess: () => {
            toast.success("Data berhasil diperbarui");
            setFormOpen(false);
            setSelected(null);
          },
          onError: (err) => toast.error(err.message || "Gagal memperbarui"),
        }
      );
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => {
          toast.success("Data berhasil ditambahkan");
          setFormOpen(false);
        },
        onError: (err) => toast.error(err.message || "Gagal menambahkan"),
      });
    }
  };

  const handleDelete = (item: PengeluaranOperasional) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!itemToDelete) return;
    deleteMutation.mutate(itemToDelete.id, {
      onSuccess: () => {
        toast.success("Data berhasil dihapus");
        setDeleteDialogOpen(false);
        setItemToDelete(null);
      },
      onError: (err) => toast.error(err.message || "Gagal menghapus"),
    });
  };

  if (isLoading && !data) {
    return (
      <section className="space-y-6">
        <div>
          <div className={styles.pageHeader.eyebrow}>Keuangan</div>
          <h1 className={styles.pageHeader.title}>Pengeluaran Operasional</h1>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6">
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-8 w-16" />
            </Card>
          ))}
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="space-y-6">
        <div>
          <div className={styles.pageHeader.eyebrow}>Keuangan</div>
          <h1 className={styles.pageHeader.title}>Pengeluaran Operasional</h1>
        </div>
        <Card className="p-6 text-center">
          <p className="text-red-500 mb-4">{error instanceof Error ? error.message : "Terjadi kesalahan"}</p>
          <Button variant="outline" onClick={() => refetch()}>
            Coba lagi
          </Button>
        </Card>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className={styles.pageHeader.eyebrow}>Keuangan</div>
          <h1 className={styles.pageHeader.title}>Pengeluaran Operasional</h1>
          <p className={styles.pageHeader.description}>Catat pengeluaran operasional seperti listrik, air, gaji, dll.</p>
        </div>
        <Button
          onClick={() => {
            setSelected(null);
            setFormOpen(true);
          }}
          className={styles.button.primary}
        >
          <Plus className="mr-2 h-4 w-4" />
          Tambah Data
        </Button>
      </div>

      <DataStats stats={stats} columns={3} />
      <DataFilters config={filterConfig} onFilterChange={(f) => setFilters(f)} />

      <Card className="p-4 sm:p-6">
        <div className="flex flex-col rounded-lg overflow-hidden" style={{ height: "600px" }}>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-slate-900 text-white z-10 border-b">
                <tr>
                  <th className="text-center p-3 font-medium w-12">No</th>
                  <th className="text-left p-3 font-medium">Tanggal</th>
                  <th className="text-left p-3 font-medium">Kategori</th>
                  <th className="text-right p-3 font-medium">Jumlah</th>
                  <th className="text-left p-3 font-medium">Keterangan</th>
                  <th className="text-center p-3 font-medium w-12">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="text-center p-4 text-muted-foreground">
                      Loading...
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center p-4 text-muted-foreground">
                      Tidak ada data
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item, idx) => (
                    <tr key={item.id} className="border-b hover:bg-muted/50">
                      <td className="p-3 text-center text-muted-foreground">{idx + 1}</td>
                      <td className="p-3">{formatDate(item.tanggal)}</td>
                      <td className="p-3">
                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium">
                          {item.kategori}
                        </span>
                      </td>
                      <td className="p-3 text-right tabular-nums font-medium text-rose-600">{formatCurrency(item.jumlah)}</td>
                      <td className="p-3 text-muted-foreground">{item.keterangan}</td>
                      <td className="p-3 text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelected(item);
                                setFormOpen(true);
                              }}
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(item)} className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Hapus
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      <PengeluaranFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleFormSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
        data={selected}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteMutation.isPending}
        title="Hapus Pengeluaran"
        description={`Hapus data pengeluaran "${itemToDelete?.kategori}"? Tindakan ini tidak dapat dibatalkan.`}
      />
    </section>
  );
}
