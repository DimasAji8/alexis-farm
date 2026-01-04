import Image from "next/image";
import Link from "next/link";

import { auth } from "@/app/api/(features)/auth/auth";
import { DashboardSidebarNav } from "@/components/common/dashboard-sidebar-nav";
import { UserMenu } from "@/components/common/user-menu";
import { HeaderDate } from "@/components/common/header-date";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { dashboardNavItems } from "@/app/client/lib/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const userName = session?.user?.name ?? session?.user?.username ?? "User";
  const userRole = session?.user?.role ?? "staff";

  const initials =
    userName
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "AF";

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader className="border-b px-2">
          <div className="flex items-center gap-3 px-2 py-4 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center">
            <Link
              href="/client/dashboard"
              className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:w-full"
            >
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:w-10">
                <Image
                  src="/images/Avisa.webp"
                  alt="Avisa by Alexis Farm"
                  fill
                  className="object-contain p-1"
                  priority
                  sizes="96px"
                />
              </div>
              <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                <span className="text-base font-bold text-foreground leading-tight">Avisa</span>
                <span className="text-sm text-muted-foreground leading-tight">Analisis & Visualisasi Sumber Aset</span>
              </div>
            </Link>
          </div>
        </SidebarHeader>
        <SidebarContent className="px-2 group-data-[collapsible=icon]:px-0">
          <SidebarGroup>
            <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">Menu</SidebarGroupLabel>
            <SidebarGroupContent>
              <DashboardSidebarNav items={dashboardNavItems} />
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
        <SidebarFooter className="border-t px-2 py-4">
          <UserMenu
            userName={userName}
            userRole={userRole}
            initials={initials}
          />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center justify-between border-b border-slate-200/60 bg-white/80 px-4 backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-900/80">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="inline-flex" />
            <div className="hidden sm:block h-5 w-px bg-slate-200 dark:bg-slate-700" />
            <span className="hidden sm:block text-sm font-medium text-slate-700 dark:text-slate-300">Alexis Farm</span>
          </div>
          <HeaderDate />
          <ThemeToggle />
        </header>
        <main className="min-h-[calc(100vh-3.5rem)] bg-gradient-to-br from-slate-50 via-white to-amber-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 p-4 md:p-6">
          <div className="w-full space-y-6">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
