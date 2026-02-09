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
  noWrapper?: boolean;
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
  noWrapper = false,
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
      <TableRow key={`skeleton-${i}`}>
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
    if (!data || data.length === 0) return renderEmptyRow();
    
    if (noWrapper) {
      return data.map((item, index) => (
        <tr key={getRowKey(item)} className="hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border-b border-slate-200 dark:border-slate-700">
          {columns.map((col) => (
            <td key={col.key} className={`px-4 py-3 align-middle ${col.className || ""}`}>
              {col.render(item, startIndex + index)}
            </td>
          ))}
          {showActions && (
            <td className="px-4 py-3 text-center">
              <TableActions onEdit={onEdit ? () => onEdit(item) : undefined} onDelete={onDelete ? () => onDelete(item) : undefined} />
            </td>
          )}
        </tr>
      ));
    }
    
    return data.map((item, index) => (
      <TableRow key={getRowKey(item)} className="hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border-b border-slate-200 dark:border-slate-700">
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

  if (noWrapper) {
    return (
      <table className="w-full caption-bottom text-sm">
        <thead className="sticky top-0 z-10 bg-slate-900 dark:bg-slate-700">
          <tr className="bg-slate-900 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-700 border-b-2 border-slate-600">
            {columns.map((col) => (
              <th key={col.key} className={`h-10 px-4 text-left align-middle font-medium text-white text-xs sm:text-sm ${col.headerClassName || ""}`}>
                {col.header}
              </th>
            ))}
            {showActions && <th className="h-10 px-4 font-medium text-white w-12 text-center">Aksi</th>}
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:border-0">{renderRows()}</tbody>
      </table>
    );
  }

  return (
    <div className="rounded-lg overflow-hidden bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
      <div className="overflow-auto" style={{ maxHeight: '600px' }}>
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-slate-900 dark:bg-slate-700">
            <TableRow className="hover:bg-slate-900 dark:hover:bg-slate-700 border-b-2 border-slate-600">
              {columns.map((col) => (
                <TableHead key={col.key} className={`font-medium text-white text-xs sm:text-sm ${col.headerClassName || ""}`}>
                  {col.header}
                </TableHead>
              ))}
              {showActions && <TableHead className="font-medium text-white w-12 text-center">Aksi</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>{renderRows()}</TableBody>
        </Table>
      </div>
    </div>
  );
}
