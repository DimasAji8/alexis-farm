"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DataFiltersMemo, type FilterConfig } from "@/components/shared/data-filters";
import { DeleteConfirmDialog } from "@/components/shared/delete-confirm-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { styles } from "@/lib/styles";
import { useMonthFilter } from "@/hooks/use-month-filter";

import { PemasukanFormDialog } from "../components/form-dialog";
import { usePemasukanList, useCreatePemasukan, useUpdatePemasukan, useDeletePemasukan } from "../hooks/use-pemasukan";
import type { Pemasukan, CreatePemasukanInput } from "../types";

const formatDate = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
};

const formatCurrency = (value: number) => `Rp ${value.toLocaleString("id-ID")}`;

const filterConfig: FilterConfig[] = [
  { key: "bulan", label: "Bulan", type: "month" },
];

export function PemasukanPage() {
  const { bulan, setBulan } = useMonthFilter();
  const { data, isLoading, isError, error, refetch } = usePemasukanList(bulan);
  const createMutation = useCreatePemasukan();
  const updateMutation = useUpdatePemasukan();
  const deleteMutation = useDeletePemasukan();

  const [formOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState<Pemasukan | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Pemasukan | null>(null);

  const totalPemasukan = data?.reduce((sum, item) => sum + item.jumlah, 0) || 0;

  const handleFormSubmit = (formData: Omit<CreatePemasukanInput, "bukti">[]) => {
    if (selected) {
      // Edit mode - hanya 1 item
      updateMutation.mutate(
        { id: selected.id, data: formData[0] },
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
      // Batch create
      let successCount = 0;
      let errorCount = 0;

      const promises = formData.map((item) =>
        createMutation.mutateAsync(item).then(() => {
          successCount++;
        }).catch(() => {
          errorCount++;
        })
      );

      Promise.all(promises).finally(() => {
        if (successCount > 0) {
          toast.success(`${successCount} data berhasil ditambahkan`);
        }
        if (errorCount > 0) {
          toast.error(`${errorCount} data gagal ditambahkan`);
        }
        setFormOpen(false);
      });
    }
  };

  const handleDelete = (item: Pemasukan) => {
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
          <h1 className={styles.pageHeader.title}>Pemasukan</h1>
        </div>
        <Card className="p-6">
          <Skeleton className="h-8 w-32" />
        </Card>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="space-y-6">
        <div>
          <div className={styles.pageHeader.eyebrow}>Keuangan</div>
          <h1 className={styles.pageHeader.title}>Pemasukan</h1>
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
          <h1 className={styles.pageHeader.title}>Pemasukan</h1>
          <p className={styles.pageHeader.description}>Catat pemasukan seperti modal awal, pinjaman, hibah, dll.</p>
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

      <DataFiltersMemo config={filterConfig} onFilterChange={(filters) => setBulan(filters.bulan_month, filters.bulan_year)} />

      <Card className="p-4 sm:p-6">
        <div className="flex flex-col rounded-lg overflow-hidden border" style={{ height: "calc(100vh - 320px)", minHeight: "500px" }}>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-slate-900 text-white z-10 border-b">
                <tr>
                  <th className="text-center p-3 font-medium w-12">No</th>
                  <th className="text-left p-3 font-medium">Tanggal</th>
                  <th className="text-left p-3 font-medium">Kategori</th>
                  <th className="text-left p-3 font-medium">Keterangan</th>
                  <th className="text-right p-3 font-medium">Jumlah</th>
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
                ) : !data || data.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center p-4 text-muted-foreground">
                      Tidak ada data
                    </td>
                  </tr>
                ) : (
                  data.map((item, idx) => (
                    <tr key={item.id} className="border-b hover:bg-muted/50">
                      <td className="p-3 text-center text-muted-foreground">{idx + 1}</td>
                      <td className="p-3">{formatDate(item.tanggal)}</td>
                      <td className="p-3">
                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium">
                          {item.kategori}
                        </span>
                      </td>
                      <td className="p-3 text-muted-foreground">{item.keterangan}</td>
                      <td className="p-3 text-right tabular-nums font-medium text-green-600">{formatCurrency(item.jumlah)}</td>
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
          <div className="sticky bottom-0 bg-slate-900 text-white border-t">
            <div className="flex justify-between items-center p-3">
              <span className="text-sm font-medium">Total Pemasukan</span>
              <span className="text-base font-semibold tabular-nums text-green-400">{formatCurrency(totalPemasukan)}</span>
            </div>
          </div>
        </div>
      </Card>

      <PemasukanFormDialog
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
        title="Hapus Pemasukan"
        description={`Hapus data pemasukan "${itemToDelete?.kategori}"? Tindakan ini tidak dapat dibatalkan.`}
      />
    </section>
  );
}