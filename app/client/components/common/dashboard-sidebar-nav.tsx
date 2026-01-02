"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpenText, LayoutDashboard, type LucideIcon } from "lucide-react";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

type NavItem = {
  title: string;
  href: string;
  icon: "dashboard" | "docs";
};

const iconMap: Record<NavItem["icon"], LucideIcon> = {
  dashboard: LayoutDashboard,
  docs: BookOpenText,
};

export function DashboardSidebarNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <SidebarMenu className="group-data-[collapsible=icon]:items-center">
      {items.map((item) => {
        const Icon = iconMap[item.icon] ?? LayoutDashboard;
        const isActive =
          pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              isActive={isActive}
              className="group-data-[collapsible=icon]:!mx-auto group-data-[collapsible=icon]:!justify-center"
            >
              <Link href={item.href} className="flex items-center gap-2">
                <Icon className="shrink-0" />
                <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
