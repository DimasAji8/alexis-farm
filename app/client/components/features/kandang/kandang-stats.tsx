"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { Kandang } from "./kandang.types";

interface KandangStatsProps {
  data: Kandang[];
}

export function KandangStats({ data }: KandangStatsProps) {
  const stats = {
    total: data.length,
    aktif: data.filter((k) => k.status === "aktif").length,
    tidakAktif: data.filter((k) => k.status === "tidak_aktif").length,
    maintenance: data.filter((k) => k.status === "maintenance").length,
    totalAyam: data.reduce((sum, k) => sum + (k.jumlahAyam || 0), 0),
  };

  const statCards = [
    {
      label: "Total Kandang",
      value: stats.total,
      bgGradient: "bg-gradient-to-br from-slate-50 to-slate-100/50",
      textColor: "text-slate-700",
      iconBg: "bg-slate-100",
      iconColor: "text-slate-600",
      borderColor: "border-slate-200",
    },
    {
      label: "Kandang Aktif",
      value: stats.aktif,
      bgGradient: "bg-gradient-to-br from-emerald-50 to-emerald-100/50",
      textColor: "text-emerald-700",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      borderColor: "border-emerald-200",
    },
    {
      label: "Tidak Aktif",
      value: stats.tidakAktif,
      bgGradient: "bg-gradient-to-br from-rose-50 to-rose-100/50",
      textColor: "text-rose-700",
      iconBg: "bg-rose-100",
      iconColor: "text-rose-600",
      borderColor: "border-rose-200",
    },
    {
      label: "Maintenance",
      value: stats.maintenance,
      bgGradient: "bg-gradient-to-br from-amber-50 to-amber-100/50",
      textColor: "text-amber-700",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      borderColor: "border-amber-200",
    },
    {
      label: "Total Ayam",
      value: stats.totalAyam.toLocaleString("id-ID"),
      bgGradient: "bg-gradient-to-br from-blue-50 to-blue-100/50",
      textColor: "text-blue-700",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      borderColor: "border-blue-200",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {statCards.map((stat, index) => (
        <Card key={index} className={`${stat.borderColor} shadow-sm hover:shadow-md transition-shadow ${index === 4 ? 'col-span-2 sm:col-span-1' : ''}`}>
          <CardContent className={`p-4 sm:p-6 ${stat.bgGradient}`}>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs sm:text-sm font-medium text-slate-600 truncate pr-2">{stat.label}</p>
                <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg ${stat.iconBg} flex items-center justify-center shrink-0`}>
                  <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${stat.iconColor.replace('text-', 'bg-')}`} />
                </div>
              </div>
              <p className={`text-xl sm:text-3xl font-bold ${stat.textColor}`}>
                {stat.value}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
