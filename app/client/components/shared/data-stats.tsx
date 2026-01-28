"use client";

import { Card, CardContent } from "@/components/ui/card";

export type StatItem = {
  label: string;
  value: string | number;
  color: "slate" | "emerald" | "rose" | "amber" | "blue" | "purple";
};

interface DataStatsProps {
  stats: StatItem[];
  columns?: number;
}

const colors: Record<string, { bg: string; text: string; border: string }> = {
  slate: { bg: "from-slate-50 to-slate-100/50 dark:from-slate-800 dark:to-slate-800/50", text: "text-slate-700 dark:text-slate-200", border: "border-slate-200 dark:border-slate-700" },
  emerald: { bg: "from-emerald-50 to-emerald-100/50 dark:from-emerald-900/30 dark:to-emerald-900/20", text: "text-emerald-700 dark:text-emerald-400", border: "border-emerald-200 dark:border-emerald-800" },
  rose: { bg: "from-rose-50 to-rose-100/50 dark:from-rose-900/30 dark:to-rose-900/20", text: "text-rose-700 dark:text-rose-400", border: "border-rose-200 dark:border-rose-800" },
  amber: { bg: "from-amber-50 to-amber-100/50 dark:from-amber-900/30 dark:to-amber-900/20", text: "text-amber-700 dark:text-amber-400", border: "border-amber-200 dark:border-amber-800" },
  blue: { bg: "from-blue-50 to-blue-100/50 dark:from-blue-900/30 dark:to-blue-900/20", text: "text-blue-700 dark:text-blue-400", border: "border-blue-200 dark:border-blue-800" },
  purple: { bg: "from-purple-50 to-purple-100/50 dark:from-purple-900/30 dark:to-purple-900/20", text: "text-purple-700 dark:text-purple-400", border: "border-purple-200 dark:border-purple-800" },
};

const gridCols: Record<number, string> = {
  2: "grid-cols-2 sm:grid-cols-2",
  3: "grid-cols-2 sm:grid-cols-3",
  4: "grid-cols-2 sm:grid-cols-2 lg:grid-cols-4",
  5: "grid-cols-2 sm:grid-cols-2 lg:grid-cols-5",
};

export function DataStats({ stats, columns }: DataStatsProps) {
  const cols = columns || stats.length;
  
  return (
    <div className={`grid gap-3 ${gridCols[cols] || "grid-cols-2 sm:grid-cols-3"}`}>
      {stats.map((stat, i) => {
        const c = colors[stat.color];
        return (
          <Card key={i} className={`${c.border} shadow-sm border dark:border-slate-700`}>
            <CardContent className={`p-4 sm:p-6 bg-gradient-to-br ${c.bg}`}>
              <div className="space-y-2">
                <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">{stat.label}</p>
                <p className={`text-xl sm:text-3xl font-bold ${c.text}`}>{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
