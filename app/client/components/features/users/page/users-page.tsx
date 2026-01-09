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

import { UsersFormDialog } from "../components/form-dialog";
import { useUserList, useCreateUser, useDeleteUser } from "../hooks/use-users";
import type { User, CreateUserInput } from "../types";

const ITEMS_PER_PAGE = 10;

const formatDate = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
};

const formatRole = (role: string) => {
  const roles: Record<string, string> = { super_user: "Super User", manager: "Manager", staff: "Staff" };
  return roles[role] || role;
};

const filterConfig: FilterConfig[] = [
  { key: "search", label: "Cari Pengguna", type: "search", placeholder: "Cari username atau nama..." },
  { key: "role", label: "Role", type: "select", options: [
    { value: "super_user", label: "Super User" },
    { value: "manager", label: "Manager" },
    { value: "staff", label: "Staff" },
  ]},
];

export function UsersPage() {
  const { data, isLoading, isError, error, refetch } = useUserList();
  const createMutation = useCreateUser();
  const deleteMutation = useDeleteUser();

  const [filters, setFilters] = useState<Record<string, string | null>>({ search: null, role: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<User | null>(null);

  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.filter((item) => {
      const matchSearch = !filters.search || item.username.toLowerCase().includes(filters.search.toLowerCase()) || item.name.toLowerCase().includes(filters.search.toLowerCase());
      const matchRole = !filters.role || item.role === filters.role;
      return matchSearch && matchRole;
    });
  }, [data, filters]);

  const stats: StatItem[] = useMemo(() => {
    const d = data || [];
    return [
      { label: "Total Pengguna", value: d.length, color: "slate" },
      { label: "Super User", value: d.filter((k) => k.role === "super_user").length, color: "blue" },
      { label: "Manager", value: d.filter((k) => k.role === "manager").length, color: "purple" },
      { label: "Staff", value: d.filter((k) => k.role === "staff").length, color: "amber" },
    ];
  }, [data]);

  const columns: ColumnDef<User>[] = [
    { key: "no", header: "No", headerClassName: "w-12", className: styles.table.cellMuted, render: (_, i) => i + 1, skeleton: <Skeleton className="h-4 w-5" /> },
    { key: "username", header: "Username", className: styles.table.cellPrimary, render: (item) => item.username, skeleton: <Skeleton className="h-4 w-20" /> },
    { key: "name", header: "Nama", className: styles.table.cellSecondary, render: (item) => item.name, skeleton: <Skeleton className="h-4 w-24" /> },
    { key: "role", header: "Role", className: "py-3", render: (item) => <Badge variant={item.role === "super_user" ? "default" : item.role === "manager" ? "secondary" : "outline"} className="text-xs">{formatRole(item.role)}</Badge>, skeleton: <Skeleton className="h-5 w-16 rounded-full" /> },
    { key: "status", header: "Status", className: "py-3", render: (item) => <Badge variant={item.isActive ? "success" : "inactive"} className="text-xs">{item.isActive ? "Aktif" : "Tidak Aktif"}</Badge>, skeleton: <Skeleton className="h-5 w-14 rounded-full" /> },
    { key: "updated", header: "Diperbarui", headerClassName: "hidden md:table-cell", className: `${styles.table.cellTertiary} hidden md:table-cell`, render: (item) => formatDate(item.updatedAt), skeleton: <Skeleton className="h-4 w-20" /> },
  ];

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleFilterChange = (f: Record<string, string | null>) => { setFilters(f); setCurrentPage(1); };
  const handleAdd = () => { setFormOpen(true); };
  const handleDelete = (item: User) => { setSelected(item); setDeleteOpen(true); };

  const handleFormSubmit = (formData: CreateUserInput) => {
    createMutation.mutate(formData, {
      onSuccess: () => { toast.success("Pengguna berhasil ditambahkan"); setFormOpen(false); },
      onError: (err) => toast.error(err.message || "Gagal menambahkan"),
    });
  };

  const handleDeleteConfirm = () => {
    if (!selected) return;
    deleteMutation.mutate(selected.id, {
      onSuccess: () => { toast.success("Pengguna berhasil dihapus"); setDeleteOpen(false); setSelected(null); },
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
            <h1 className={styles.pageHeader.title}>Pengguna</h1>
            <p className={styles.pageHeader.description}>Kelola akses pengguna sistem.</p>
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[1,2,3,4].map((i) => <Card key={i} className="p-6"><Skeleton className="h-4 w-20 mb-2" /><Skeleton className="h-8 w-12" /></Card>)}
        </div>
        <Card className="p-6"><div className="flex gap-4"><Skeleton className="h-10 flex-1" /><Skeleton className="h-10 w-40" /></div></Card>
        <Card className={styles.card.table}><DataTable data={[]} columns={columns} isLoading getRowKey={() => ""} showActions={false} /></Card>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="space-y-6">
        <div><div className={styles.pageHeader.eyebrow}>Master Data</div><h1 className={styles.pageHeader.title}>Pengguna</h1></div>
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
          <h1 className={styles.pageHeader.title}>Pengguna</h1>
          <p className={styles.pageHeader.description}>Kelola akses pengguna sistem.</p>
        </div>
        <Button onClick={handleAdd} className={styles.button.primary}>
          <Plus className="mr-2 h-4 w-4" />Tambah Pengguna
        </Button>
      </div>

      <DataStats stats={stats} columns={4} />
      <DataFilters config={filterConfig} onFilterChange={handleFilterChange} />

      <Card className={styles.card.table}>
        <DataTable data={paginatedData} columns={columns} isLoading={isLoading} startIndex={(currentPage - 1) * ITEMS_PER_PAGE} onDelete={handleDelete} getRowKey={(item) => item.id} />
        {filteredData.length > 0 && <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={filteredData.length} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setCurrentPage} />}
      </Card>

      <UsersFormDialog open={formOpen} onOpenChange={setFormOpen} onSubmit={handleFormSubmit} isLoading={createMutation.isPending} />
      <DeleteConfirmDialog open={deleteOpen} onOpenChange={setDeleteOpen} onConfirm={handleDeleteConfirm} isLoading={deleteMutation.isPending} title="Hapus Pengguna" description={`Hapus pengguna "${selected?.name}"? Tindakan ini tidak dapat dibatalkan.`} />
    </section>
  );
}
