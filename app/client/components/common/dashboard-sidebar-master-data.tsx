"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Database } from "lucide-react";

import { cn } from "@/app/client/lib/utils";
import {
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

type MasterDataItem = {
  title: string;
  href: string;
};

export function MasterDataMenu({ items }: { items: MasterDataItem[] }) {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isActive = items.some(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`)
  );
  const [open, setOpen] = React.useState(isActive);

  React.useEffect(() => {
    if (isActive) {
      setOpen(true);
    }
  }, [isActive]);

  if (state === "collapsed") {
    return (
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              isActive={isActive}
              className={cn(
                "group relative group-data-[collapsible=icon]:!mx-auto group-data-[collapsible=icon]:!justify-center",
                "group-data-[collapsible=icon]:overflow-visible data-[active=true]:bg-black data-[active=true]:text-white"
              )}
            >
              <Database className="shrink-0" />
              <span className="pointer-events-none absolute left-full top-1/2 ml-2 hidden -translate-y-1/2 whitespace-nowrap rounded-full bg-black px-3 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition group-hover:opacity-100 group-data-[collapsible=icon]:block">
                Master Data
              </span>
              <span className="sr-only">Master Data</span>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="start" className="w-56">
            <DropdownMenuLabel className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Master Data
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {items.map((item) => {
              const itemActive =
                pathname === item.href ||
                pathname.startsWith(`${item.href}/`);

              return (
                <DropdownMenuItem
                  key={item.title}
                  asChild
                  className={cn(
                    itemActive && "bg-black text-white focus:bg-black focus:text-white"
                  )}
                >
                  <Link href={item.href}>{item.title}</Link>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={isActive}
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className={cn(
          "data-[active=true]:bg-black data-[active=true]:text-white data-[active=true]:hover:bg-black"
        )}
      >
        <Database className="shrink-0" />
        <span>Master Data</span>
        <ChevronDown
          className={cn(
            "ml-auto h-4 w-4 text-muted-foreground transition-transform",
            open && "rotate-180 text-foreground"
          )}
        />
      </SidebarMenuButton>
      <SidebarMenuSub
        className={cn(
          "overflow-hidden transition-[max-height,opacity,margin] duration-300 ease-in-out",
          open ? "max-h-96 opacity-100 mt-1" : "max-h-0 opacity-0 mt-0"
        )}
      >
        <div className={cn(open ? "py-0.5" : "py-0", "overflow-hidden")}>
          {items.map((item) => {
            const itemActive =
              pathname === item.href ||
              pathname.startsWith(`${item.href}/`);

            return (
              <SidebarMenuSubItem key={item.title}>
                <SidebarMenuSubButton
                  asChild
                  isActive={itemActive}
                  className="data-[active=true]:bg-black data-[active=true]:text-white data-[active=true]:hover:bg-black"
                >
                  <Link href={item.href}>{item.title}</Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            );
          })}
        </div>
      </SidebarMenuSub>
    </SidebarMenuItem>
  );
}
