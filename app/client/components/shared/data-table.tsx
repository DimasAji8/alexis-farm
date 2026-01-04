import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { TableActions } from "./table-actions";
import type { ReactNode } from "react";

export type ColumnDef<T> = {
  key: string;
  header: string;
  className?: string;
  headerClassName?: string;
  render: (item: T, index: number) => ReactNode;
  skeleton?: ReactNode;
};

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  isLoading?: boolean;
  skeletonRows?: number;
  startIndex?: number;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  showActions?: boolean;
  getRowKey: (item: T) => string;
}

export function DataTable<T>({
  data,
  columns,
  isLoading,
  skeletonRows = 10,
  startIndex = 0,
  onEdit,
  onDelete,
  showActions = true,
  getRowKey,
}: DataTableProps<T>) {
  const renderEmptyRow = () => (
    <TableRow>
      <TableCell colSpan={columns.length + (showActions ? 1 : 0)} className="py-10 text-center text-slate-500 dark:text-slate-400">
        Tidak ada data
      </TableCell>
    </TableRow>
  );

  const renderSkeletonRows = () =>
    Array.from({ length: skeletonRows }).map((_, i) => (
      <TableRow key={i}>
        {columns.map((col) => (
          <TableCell key={col.key} className={col.className}>
            {col.skeleton || <Skeleton className="h-4 w-16" />}
          </TableCell>
        ))}
        {showActions && (
          <TableCell className="text-center py-3">
            <Skeleton className="h-8 w-8 rounded mx-auto" />
          </TableCell>
        )}
      </TableRow>
    ));

  const renderRows = () => {
    if (isLoading) return renderSkeletonRows();
    if (data.length === 0) return renderEmptyRow();
    return data.map((item, index) => (
      <TableRow key={getRowKey(item)}>
        {columns.map((col) => (
          <TableCell key={col.key} className={col.className}>
            {col.render(item, startIndex + index)}
          </TableCell>
        ))}
        {showActions && (
          <TableCell className="text-center py-3">
            <TableActions onEdit={onEdit ? () => onEdit(item) : undefined} onDelete={onDelete ? () => onDelete(item) : undefined} />
          </TableCell>
        )}
      </TableRow>
    ));
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-800 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-700">
            {columns.map((col) => (
              <TableHead key={col.key} className={`font-semibold text-white text-xs sm:text-sm ${col.headerClassName || ""}`}>
                {col.header}
              </TableHead>
            ))}
            {showActions && <TableHead className="font-semibold text-white w-12 text-center">Aksi</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>{renderRows()}</TableBody>
      </Table>
    </div>
  );
}
