"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useKandangList } from "@/components/features/kandang/hooks/use-kandang";
import { Building2, ChevronRight, Users } from "lucide-react";

export function KandangOverview() {
  const { data: kandangList, isLoading } = useKandangList();

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6">
            <Skeleton className="h-6 w-24 mb-2" />
            <Skeleton className="h-4 w-32" />
          </Card>
        ))}
      </div>
    );
  }

  if (!kandangList || kandangList.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Building2 className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
        <h3 className="font-medium text-lg mb-2">Belum Ada Kandang</h3>
        <p className="text-muted-foreground text-sm mb-4">
          Tambahkan kandang terlebih dahulu di menu Master Data.
        </p>
        <Link
          href="/client/dashboard/master-data/kandang"
          className="text-primary underline text-sm"
        >
          Tambah Kandang
        </Link>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {kandangList.map((kandang) => (
        <Link key={kandang.id} href={`/client/dashboard/kandang/${kandang.id}`}>
          <Card className="p-6 hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {kandang.kode}
                </p>
                <h3 className="text-lg font-semibold mt-1">{kandang.nama}</h3>
                {kandang.lokasi && (
                  <p className="text-sm text-muted-foreground mt-1">{kandang.lokasi}</p>
                )}
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{kandang.jumlahAyam.toLocaleString("id-ID")} ekor</span>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
