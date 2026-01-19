import Image from "next/image";
import Link from "next/link";

import { auth } from "@/app/api/(features)/auth/auth";
import { DashboardSidebarNav } from "@/components/common/dashboard-sidebar-nav";
import { UserMenu } from "@/components/common/user-menu";
import { DashboardHeader } from "@/components/common/dashboard-header";
import { KandangSwitcher } from "@/components/common/kandang-switcher";
import { KandangLoader } from "@/components/common/kandang-loader";
import { KandangAutoSelect } from "@/components/common/kandang-auto-select";
import { KandangProvider } from "@/hooks/use-selected-kandang";
import { dashboardNavItems, filterNavByRole } from "@/app/client/lib/navigation";
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
} from "@/components/ui/sidebar";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const userName = session?.user?.name ?? session?.user?.username ?? "User";
  const userRole = session?.user?.role ?? "staff";
  
  const filteredNavItems = filterNavByRole(dashboardNavItems, userRole);

  const initials =
    userName
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "AF";

  return (
    <KandangProvider>
      <KandangAutoSelect />
      <KandangLoader />
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
            <div className="px-2 py-3 group-data-[collapsible=icon]:px-0">
              <KandangSwitcher />
            </div>
            <SidebarGroup>
              <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">Menu</SidebarGroupLabel>
              <SidebarGroupContent>
                <DashboardSidebarNav items={filteredNavItems} />
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
          <DashboardHeader />
          <main className="min-h-[calc(100vh-3.5rem)] bg-gradient-to-br from-slate-50 via-white to-amber-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 p-4 md:p-6">
            <div className="w-full space-y-6">{children}</div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </KandangProvider>
  );
}
