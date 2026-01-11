"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { HeaderDate } from "@/components/common/header-date";
import { ThemeToggle } from "@/components/common/theme-toggle";

export function DashboardHeader() {
  return (
    <header className="flex h-14 items-center justify-between border-b border-slate-200/60 bg-white/80 px-4 backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-900/80">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="inline-flex" />
        <div className="hidden sm:block h-5 w-px bg-slate-200 dark:bg-slate-700" />
        <HeaderDate />
      </div>
      <ThemeToggle />
    </header>
  );
}
