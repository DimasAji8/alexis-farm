import Image from "next/image";
import Link from "next/link";
import { UserRound } from "lucide-react";

import { auth } from "@/app/api/(features)/auth/auth";
import { DashboardSidebarNav } from "@/components/common/dashboard-sidebar-nav";
import { SignOutButton } from "@/components/features/auth/SignOutButton";
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

  const navItems = [
    { title: "Dashboard", href: "/client/dashboard", icon: "dashboard" as const },
    { title: "API Docs", href: "/client/docs", icon: "docs" as const },
  ];

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
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:w-10">
                <Image
                  src="/images/Avisa.webp"
                  alt="Avisa by Alexis Farm"
                  fill
                  className="object-contain p-1.5"
                  priority
                  sizes="96px"
                />
              </div>
              <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                <span className="text-sm font-semibold text-foreground leading-none">Avisa</span>
                <span className="text-xs text-muted-foreground leading-none mt-1">Analisis & Visualisasi Sumber Aset</span>
              </div>
            </Link>
          </div>
        </SidebarHeader>
        <SidebarContent className="px-2">
          <SidebarGroup>
            <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">Menu</SidebarGroupLabel>
            <SidebarGroupContent>
              <DashboardSidebarNav items={navItems} />
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
        <SidebarFooter className="border-t px-2 py-4">
          <div className="flex items-center gap-3 rounded-lg bg-muted/40 px-3 py-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-sm font-semibold text-amber-800">
              {initials}
            </div>
            <div className="min-w-0 group-data-[collapsible=icon]:hidden">
              <p className="truncate text-sm font-semibold text-foreground">{userName}</p>
              <p className="truncate text-xs text-muted-foreground capitalize flex items-center gap-1">
                <UserRound className="h-3.5 w-3.5" />
                {userRole}
              </p>
            </div>
          </div>
          <div className="pt-3 group-data-[collapsible=icon]:hidden">
            <SignOutButton />
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-3 border-b bg-white/70 px-4 backdrop-blur">
          <SidebarTrigger className="inline-flex" />
          <div className="flex flex-col">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-600">Alexis Farm</p>
            <p className="text-sm font-semibold text-foreground">Dashboard</p>
          </div>
        </header>
        <main className="min-h-[calc(100vh-3.5rem)] bg-gradient-to-br from-slate-50 via-white to-amber-50 p-4 md:p-6">
          <div className="mx-auto max-w-6xl space-y-6">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
