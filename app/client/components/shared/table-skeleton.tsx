import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TableSkeletonProps {
  rows?: number;
  showPagination?: boolean;
}

export function TableSkeleton({ rows = 5, showPagination = false }: TableSkeletonProps) {
  return (
    <>
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
            {Array.from({ length: rows }).map((_, index) => (
              <TableRow key={index}>
                <TableCell className="py-3">
                  <Skeleton className="h-4 w-5" />
                </TableCell>
                <TableCell className="py-3">
                  <Skeleton className="h-4 w-12 sm:w-16" />
                </TableCell>
                <TableCell className="py-3">
                  <Skeleton className="h-4 w-16 sm:w-24" />
                </TableCell>
                <TableCell className="py-3 hidden sm:table-cell">
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell className="py-3 text-right">
                  <Skeleton className="h-4 w-10 ml-auto" />
                </TableCell>
                <TableCell className="py-3">
                  <Skeleton className="h-5 w-14 rounded-full" />
                </TableCell>
                <TableCell className="py-3 hidden md:table-cell">
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell className="py-3 text-center">
                  <Skeleton className="h-8 w-8 rounded mx-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {showPagination && (
        <div className="flex flex-col gap-3 px-4 py-4 border-t border-slate-200 bg-slate-50/50 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <Skeleton className="h-4 w-24 mx-auto sm:mx-0" />
          <div className="flex items-center justify-center gap-1">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      )}
    </>
  );
}
