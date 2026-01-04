"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { Card } from "@/components/ui/card";
import { Pagination } from "@/components/shared/pagination";
import { TableSkeleton } from "@/components/shared/table-skeleton";
import { DeleteConfirmDialog } from "@/components/shared/delete-confirm-dialog";
import { Plus } from "lucide-react";

import { KandangTable } from "./kandang-table";
import { KandangFilters } from "./kandang-filters";
import { KandangStats } from "./kandang-stats";
import { KandangFormDialog } from "./kandang-form-dialog";
import { useKandangList, useCreateKandang, useUpdateKandang, useDeleteKandang } from "./hooks/use-kandang";
import type { Kandang } from "./kandang.types";
import type { CreateKandangInput, UpdateKandangInput } from "./kandang.api";

const ITEMS_PER_PAGE = 10;

export function KandangPage() {
  const { data, isLoading, isPending, isError, error, refetch } = useKandangList();
  const createMutation = useCreateKandang();
  const updateMutation = useUpdateKandang();
  const deleteMutation = useDeleteKandang();

  const [filters, setFilters] = useState({ search: "", status: null as string | null });
  const [currentPage, setCurrentPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedKandang, setSelectedKandang] = useState<Kandang | null>(null);

  // Gunakan isPending untuk menampilkan skeleton saat data belum ada
  const showSkeleton = isPending || isLoading || data === undefined;

  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.filter((kandang) => {
      const matchesSearch = !filters.search ||
        kandang.kode.toLowerCase().includes(filters.search.toLowerCase()) ||
        kandang.nama.toLowerCase().includes(filters.search.toLowerCase());
      const matchesStatus = !filters.status || kandang.status === filters.status;
      return matchesSearch && matchesStatus;
    });
  }, [data, filters]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleAdd = () => {
    setSelectedKandang(null);
    setFormOpen(true);
  };

  const handleEdit = (kandang: Kandang) => {
    setSelectedKandang(kandang);
    setFormOpen(true);
  };

  const handleDelete = (kandang: Kandang) => {
    setSelectedKandang(kandang);
    setDeleteOpen(true);
  };

  const handleFormSubmit = (formData: CreateKandangInput | UpdateKandangInput) => {
    if (selectedKandang) {
      updateMutation.mutate(
        { id: selectedKandang.id, data: formData },
        {
          onSuccess: () => {
            toast.success("Kandang berhasil diperbarui");
            setFormOpen(false);
            setSelectedKandang(null);
          },
          onError: (err) => toast.error(err.message || "Gagal memperbarui kandang"),
        }
      );
    } else {
      createMutation.mutate(formData as CreateKandangInput, {
        onSuccess: () => {
          toast.success("Kandang berhasil ditambahkan");
          setFormOpen(false);
        },
        onError: (err) => toast.error(err.message || "Gagal menambahkan kandang"),
      });
    }
  };

  const handleDeleteConfirm = () => {
    if (!selectedKandang) return;
    deleteMutation.mutate(selectedKandang.id, {
      onSuccess: () => {
        toast.success("Kandang berhasil dihapus");
        setDeleteOpen(false);
        setSelectedKandang(null);
      },
      onError: (err) => toast.error(err.message || "Gagal menghapus kandang"),
    });
  };

  const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan saat memuat data.";

  const renderAddButton = () => (
    <Button onClick={handleAdd} className="bg-black text-white hover:bg-black/90 shadow-sm">
      <Plus className="mr-2 h-4 w-4" />
      Tambah Kandang
    </Button>
  );

  if (showSkeleton) {
    return (
      <section className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm text-slate-500 mb-1">Master Data</div>
            <h1 className="text-3xl font-bold text-slate-900">Kandang</h1>
            <p className="text-slate-600 mt-1">Kelola data kandang, kapasitas, dan status operasional.</p>
          </div>
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="border-slate-200">
              <div className="p-6 space-y-3">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-16" />
              </div>
            </Card>
          ))}
        </div>
        <Card className="border-slate-200">
          <div className="p-6 flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2 sm:w-48">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </Card>
        <Card className="border-0 bg-white shadow-sm overflow-hidden">
          <TableSkeleton rows={10} showPagination />
        </Card>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm text-slate-500 mb-1">Master Data</div>
            <h1 className="text-3xl font-bold text-slate-900">Kandang</h1>
            <p className="text-slate-600 mt-1">Kelola data kandang, kapasitas, dan status operasional.</p>
          </div>
        </div>
        <EmptyState
          title="Gagal memuat kandang"
          description={errorMessage}
          action={<Button variant="outline" onClick={() => refetch()}>Coba lagi</Button>}
        />
      </section>
    );
  }

  if (!data || data.length === 0) {
    return (
      <section className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm text-slate-500 mb-1">Master Data</div>
            <h1 className="text-3xl font-bold text-slate-900">Kandang</h1>
            <p className="text-slate-600 mt-1">Kelola data kandang, kapasitas, dan status operasional.</p>
          </div>
          {renderAddButton()}
        </div>
        <EmptyState
          title="Belum ada kandang"
          description="Tambahkan kandang pertama untuk mulai mengelola operasional."
          action={renderAddButton()}
        />
        <KandangFormDialog
          open={formOpen}
          onOpenChange={setFormOpen}
          onSubmit={handleFormSubmit}
          isLoading={createMutation.isPending}
          kandang={selectedKandang}
        />
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-sm text-slate-500 mb-1">Master Data</div>
          <h1 className="text-3xl font-bold text-slate-900">Kandang</h1>
          <p className="text-slate-600 mt-1">Kelola data kandang, kapasitas, dan status operasional.</p>
        </div>
        {renderAddButton()}
      </div>

      <KandangStats data={data} />
      <KandangFilters onFilterChange={handleFilterChange} />

      {filteredData.length > 0 ? (
        <Card className="border-0 bg-white shadow-sm overflow-hidden">
          <KandangTable
            items={paginatedData}
            currentPage={currentPage}
            itemsPerPage={ITEMS_PER_PAGE}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredData.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        </Card>
      ) : (
        <EmptyState
          title="Tidak ada kandang ditemukan"
          description="Coba ubah filter atau kata kunci pencarian Anda."
        />
      )}

      <KandangFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleFormSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
        kandang={selectedKandang}
      />

      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteMutation.isPending}
        title="Hapus Kandang"
        description={`Apakah Anda yakin ingin menghapus kandang "${selectedKandang?.nama}"? Tindakan ini tidak dapat dibatalkan.`}
      />
    </section>
  );
}
