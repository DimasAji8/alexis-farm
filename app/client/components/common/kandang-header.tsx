"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Building2, Users } from "lucide-react";
import { cn } from "@/app/client/lib/utils";

type Kandang = {
  id: string;
  kode: string;
  nama: string;
  lokasi?: string | null;
  jumlahAyam: number;
};

type Props = {
  kandang: Kandang;
};

const navItems = [
  { label: "Overview", href: "" },
  { label: "Ayam Masuk", href: "/ayam/masuk" },
  { label: "Kematian", href: "/ayam/kematian" },
  { label: "Produktivitas", href: "/telur/produktivitas" },
  { label: "Stok Telur", href: "/telur/stok" },
  { label: "Penjualan", href: "/telur/penjualan" },
];

export function KandangHeader({ kandang }: Props) {
  const pathname = usePathname();
  const basePath = `/client/dashboard/kandang/${kandang.id}`;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Link href="/client/dashboard">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Button>
        </Link>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80 dark:bg-slate-900 dark:ring-slate-700">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {kandang.kode}
              </p>
              <h1 className="text-2xl font-semibold">{kandang.nama}</h1>
              {kandang.lokasi && (
                <p className="text-sm text-muted-foreground">{kandang.lokasi}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full">
            <Users className="h-4 w-4" />
            <span>{kandang.jumlahAyam.toLocaleString("id-ID")} ekor</span>
          </div>
        </div>

        <nav className="flex gap-1 mt-6 overflow-x-auto pb-1">
          {navItems.map((item) => {
            const href = `${basePath}${item.href}`;
            const isActive = pathname === href || (item.href !== "" && pathname.startsWith(href));
            return (
              <Link key={item.href} href={href}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "whitespace-nowrap",
                    isActive && "bg-primary/10 text-primary hover:bg-primary/20"
                  )}
                >
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
