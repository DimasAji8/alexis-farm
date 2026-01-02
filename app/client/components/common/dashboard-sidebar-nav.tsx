"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Warehouse, Wheat, type LucideIcon } from "lucide-react";

import { cn } from "@/app/client/lib/utils";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

type NavItem = {
  title: string;
  href: string;
  icon: "dashboard" | "kandang" | "jenisPakan" | "users";
};

const iconMap: Record<NavItem["icon"], LucideIcon> = {
  dashboard: LayoutDashboard,
  kandang: Warehouse,
  jenisPakan: Wheat,
  users: Users,
};

export function DashboardSidebarNav({
  items,
  className,
  children,
}: {
  items: NavItem[];
  className?: string;
  children?: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <SidebarMenu className={cn("group-data-[collapsible=icon]:items-center", className)}>
      {items.map((item) => {
        const Icon = iconMap[item.icon] ?? LayoutDashboard;
        const isActive =
          pathname === item.href ||
          (item.href !== "/client/dashboard" &&
            pathname.startsWith(`${item.href}/`));

        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              isActive={isActive}
              className={cn(
                "data-[active=true]:bg-black data-[active=true]:text-white data-[active=true]:hover:bg-black",
                "group-data-[collapsible=icon]:!mx-auto group-data-[collapsible=icon]:!justify-center"
              )}
            >
              <Link href={item.href} className="flex items-center gap-2">
                <Icon className="shrink-0" />
                <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
      {children}
    </SidebarMenu>
  );
}
