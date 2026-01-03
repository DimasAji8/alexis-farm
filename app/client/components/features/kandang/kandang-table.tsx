import type { Kandang } from "./kandang.types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TableActions } from "@/components/shared/table-actions";

const numberFormatter = new Intl.NumberFormat("id-ID");

const formatDate = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getStatusVariant = (status: string) => {
  switch (status) {
    case "aktif":
      return "success";
    case "maintenance":
      return "warning";
    case "tidak_aktif":
    default:
      return "inactive";
  }
};

const formatStatus = (status: string) => {
  return status?.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase()) || "-";
};

interface KandangTableProps {
  items: Kandang[];
  currentPage?: number;
  itemsPerPage?: number;
  onEdit?: (kandang: Kandang) => void;
  onDelete?: (kandang: Kandang) => void;
}

export function KandangTable({ 
  items, 
  currentPage, 
  itemsPerPage, 
  onEdit, 
  onDelete 
}: KandangTableProps) {
  const hasPagination =
    typeof currentPage === "number" &&
    Number.isFinite(currentPage) &&
    typeof itemsPerPage === "number" &&
    Number.isFinite(itemsPerPage) &&
    itemsPerPage > 0;
  const startIndex = hasPagination ? (currentPage - 1) * itemsPerPage : 0;
  const handleEdit = onEdit ?? (() => undefined);
  const handleDelete = onDelete ?? (() => undefined);

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-700 hover:bg-slate-700">
            <TableHead className="font-semibold text-white w-12 text-xs sm:text-sm">No</TableHead>
            <TableHead className="font-semibold text-white text-xs sm:text-sm min-w-[70px]">Kode</TableHead>
            <TableHead className="font-semibold text-white text-xs sm:text-sm min-w-[100px]">Nama</TableHead>
            <TableHead className="font-semibold text-white text-xs sm:text-sm min-w-[80px] hidden sm:table-cell">Lokasi</TableHead>
            <TableHead className="font-semibold text-white text-xs sm:text-sm text-right min-w-[80px]">Ayam</TableHead>
            <TableHead className="font-semibold text-white text-xs sm:text-sm min-w-[90px]">Status</TableHead>
            <TableHead className="font-semibold text-white text-xs sm:text-sm min-w-[100px] hidden md:table-cell">Diperbarui</TableHead>
            <TableHead className="font-semibold text-white w-12 text-center">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium text-slate-600 text-xs sm:text-sm py-3">
                {startIndex + index + 1}
              </TableCell>
              <TableCell className="font-medium text-slate-900 text-xs sm:text-sm py-3">
                {item.kode}
              </TableCell>
              <TableCell className="text-slate-700 text-xs sm:text-sm py-3">
                <div className="truncate max-w-[120px] sm:max-w-none">{item.nama}</div>
              </TableCell>
              <TableCell className="text-slate-600 text-xs sm:text-sm py-3 hidden sm:table-cell">
                {item.lokasi || "-"}
              </TableCell>
              <TableCell className="text-slate-700 text-right font-medium tabular-nums text-xs sm:text-sm py-3">
                {numberFormatter.format(item.jumlahAyam ?? 0)}
              </TableCell>
              <TableCell className="py-3">
                <Badge variant={getStatusVariant(item.status)} className="text-xs">
                  {formatStatus(item.status)}
                </Badge>
              </TableCell>
              <TableCell className="text-slate-600 text-xs sm:text-sm py-3 hidden md:table-cell">
                {formatDate(item.updatedAt)}
              </TableCell>
              <TableCell className="text-center py-3">
                <TableActions
                  onEdit={() => handleEdit(item)}
                  onDelete={() => handleDelete(item)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
