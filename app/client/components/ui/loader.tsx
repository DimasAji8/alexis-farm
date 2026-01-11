"use client";

import { cn } from "@/lib/utils";

export function Loader({ className }: { className?: string }) {
  return (
    <div className={cn("fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm", className)}>
      <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-slate-800">
        <div className="loader" />
      </div>
    </div>
  );
}
