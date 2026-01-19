"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  Database,
  LayoutDashboard,
  Users,
  Warehouse,
  Wheat,
  Bird,
  Egg,
  ShoppingCart,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/app/client/lib/utils";
import type { SidebarNavItem } from "@/app/client/lib/navigation";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const iconMap: Record<SidebarNavItem["icon"], LucideIcon> = {
  dashboard: LayoutDashboard,
  masterData: Database,
  kandang: Warehouse,
  jenisPakan: Wheat,
  users: Users,
  ayam: Bird,
  telur: Egg,
  pakan: ShoppingCart,
};

const activeButtonClassName =
  "data-[active=true]:bg-black data-[active=true]:text-white data-[active=true]:hover:bg-black";
const activeSubButtonClassName =
  "data-[active=true]:bg-black data-[active=true]:text-white data-[active=true]:hover:bg-black";

const hoverLabel = (title: string) => (
  <span className="pointer-events-none absolute left-full top-1/2 ml-2 hidden -translate-y-1/2 whitespace-nowrap rounded-full bg-black px-3 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition group-hover:opacity-100 group-data-[collapsible=icon]:block">
    {title}
  </span>
);

export function DashboardSidebarNav({
  items,
  className,
}: {
  items: SidebarNavItem[];
  className?: string;
}) {
  const pathname = usePathname();
  const { state, isMobile, setOpenMobile } = useSidebar();

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const isPathActive = (href: string) => {
    if (href === "/client/dashboard") {
      return pathname === href;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const isItemActive = (item: SidebarNavItem) => {
    const selfActive = item.href ? isPathActive(item.href) : false;
    const childActive =
      item.children?.some((child) => isPathActive(child.href)) ?? false;

    return selfActive || childActive;
  };

  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>(
    () => {
      const initial: Record<string, boolean> = {};

      items.forEach((item) => {
        if (item.children?.length) {
          initial[item.title] = isItemActive(item);
        }
      });

      return initial;
    }
  );

  React.useEffect(() => {
    setOpenGroups((prev) => {
      const next = { ...prev };

      items.forEach((item) => {
        if (!item.children?.length) {
          return;
        }

        if (next[item.title] === undefined) {
          next[item.title] = isItemActive(item);
        }

        if (isItemActive(item)) {
          next[item.title] = true;
        }
      });

      return next;
    });
  }, [items, pathname]);

  return (
    <SidebarMenu
      className={cn("group-data-[collapsible=icon]:items-center", className)}
    >
      {items.map((item) => {
        const Icon = iconMap[item.icon] ?? LayoutDashboard;
        const isActive = isItemActive(item);
        const hasChildren = Boolean(item.children?.length);

        if (hasChildren && state === "collapsed") {
          return (
            <SidebarMenuItem key={item.title}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    isActive={isActive}
                    className={cn(
                      "group relative group-data-[collapsible=icon]:!mx-auto group-data-[collapsible=icon]:!justify-center",
                      "group-data-[collapsible=icon]:overflow-visible",
                      activeButtonClassName
                    )}
                  >
                    <Icon className="shrink-0" />
                    {hoverLabel(item.title)}
                    <span className="sr-only">{item.title}</span>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" align="start" className="w-56">
                  <DropdownMenuLabel className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {item.title}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {item.children?.map((child) => {
                    const childActive = isPathActive(child.href);

                    return (
                      <DropdownMenuItem
                        key={child.title}
                        asChild
                        className={cn(
                          childActive &&
                            "bg-black text-white focus:bg-black focus:text-white"
                        )}
                      >
                        <Link href={child.href} onClick={handleLinkClick}>{child.title}</Link>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          );
        }

        if (hasChildren) {
          const isOpen = openGroups[item.title] ?? false;

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                isActive={isActive}
                onClick={() =>
                  setOpenGroups((prev) => ({
                    ...prev,
                    [item.title]: !isOpen,
                  }))
                }
                aria-expanded={isOpen}
                className={cn(activeButtonClassName)}
              >
                <Icon className="shrink-0" />
                <span>{item.title}</span>
                <ChevronDown
                  className={cn(
                    "ml-auto h-4 w-4 text-muted-foreground transition-transform",
                    isOpen && "rotate-180 text-foreground"
                  )}
                />
              </SidebarMenuButton>
              <SidebarMenuSub
                className={cn(
                  "overflow-hidden transition-[max-height,opacity,margin] duration-300 ease-in-out",
                  isOpen
                    ? "max-h-96 opacity-100 mt-1"
                    : "max-h-0 opacity-0 mt-0 border-transparent pointer-events-none"
                )}
              >
                {item.children?.map((child) => {
                  const childActive = isPathActive(child.href);

                  return (
                    <SidebarMenuSubItem key={child.title}>
                      <SidebarMenuSubButton
                        asChild
                        isActive={childActive}
                        className={activeSubButtonClassName}
                      >
                        <Link href={child.href} onClick={handleLinkClick}>{child.title}</Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  );
                })}
              </SidebarMenuSub>
            </SidebarMenuItem>
          );
        }

        if (!item.href) {
          return null;
        }

        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              isActive={isActive}
              className={cn(
                "group relative group-data-[collapsible=icon]:!mx-auto group-data-[collapsible=icon]:!justify-center",
                "group-data-[collapsible=icon]:overflow-visible",
                activeButtonClassName
              )}
            >
              <Link href={item.href} onClick={handleLinkClick}>
                <Icon className="shrink-0" />
                <span className="group-data-[collapsible=icon]:hidden">
                  {item.title}
                </span>
                {hoverLabel(item.title)}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
