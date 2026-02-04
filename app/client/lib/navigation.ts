export type SidebarNavIcon =
  | "dashboard"
  | "masterData"
  | "kandang"
  | "jenisPakan"
  | "users"
  | "ayam"
  | "telur"
  | "pakan"
  | "keuangan";

export type UserRole = "super_user" | "manager" | "staff";

export type SidebarNavChild = {
  title: string;
  href: string;
  roles?: UserRole[];
};

export type SidebarNavItem = {
  title: string;
  icon: SidebarNavIcon;
  href?: string;
  children?: SidebarNavChild[];
  roles?: UserRole[];
};

export const dashboardNavItems: SidebarNavItem[] = [
  {
    title: "Dashboard",
    href: "/client/dashboard",
    icon: "dashboard",
  },
  {
    title: "Ayam",
    icon: "ayam",
    children: [
      {
        title: "Ayam Masuk",
        href: "/client/dashboard/ayam/masuk",
      },
      {
        title: "Kematian",
        href: "/client/dashboard/ayam/kematian",
      },
    ],
  },
  {
    title: "Telur",
    icon: "telur",
    children: [
      {
        title: "Produktivitas",
        href: "/client/dashboard/telur/produktivitas",
      },
      {
        title: "Penjualan",
        href: "/client/dashboard/telur/penjualan",
        roles: ["super_user", "manager"], // Staff tidak bisa akses penjualan
      },
      {
        title: "Stok Telur",
        href: "/client/dashboard/telur/stok",
      },
      {
        title: "Rekap Telur",
        href: "/client/dashboard/telur/rekap",
        roles: ["super_user", "manager"],
      },
    ],
  },
  {
    title: "Pakan",
    icon: "pakan",
    children: [
      {
        title: "Dashboard",
        href: "/client/dashboard/pakan/dashboard",
        roles: ["super_user", "manager"],
      },
      {
        title: "Pembelian Pakan",
        href: "/client/dashboard/pakan/pembelian",
      },
      {
        title: "Pemakaian Pakan",
        href: "/client/dashboard/pakan/pemakaian",
      },
      {
        title: "Rekap Pakan",
        href: "/client/dashboard/pakan/rekap",
        roles: ["super_user", "manager"], // Hanya owner & manager bisa lihat rekap
      },
    ],
  },
  {
    title: "Keuangan",
    icon: "keuangan",
    roles: ["super_user", "manager"],
    children: [
      {
        title: "Laporan Keuangan",
        href: "/client/dashboard/keuangan/laporan",
      },
      {
        title: "Pemasukan",
        href: "/client/dashboard/keuangan/pemasukan",
      },
      {
        title: "Pengeluaran",
        href: "/client/dashboard/keuangan/pengeluaran",
      },
    ],
  },
  {
    title: "Master Data",
    icon: "masterData",
    roles: ["super_user", "manager"], // Hanya owner & manager bisa akses master data
    children: [
      {
        title: "Kandang",
        href: "/client/dashboard/master-data/kandang",
      },
      {
        title: "Jenis Pakan",
        href: "/client/dashboard/master-data/jenis-pakan",
      },
      {
        title: "Pengguna",
        href: "/client/dashboard/master-data/users",
        roles: ["super_user"], // Hanya owner
      },
    ],
  },
];

export function filterNavByRole(items: SidebarNavItem[], userRole: string): SidebarNavItem[] {
  return items
    .filter(item => !item.roles || item.roles.includes(userRole as UserRole))
    .map(item => {
      if (item.children) {
        const filteredChildren = item.children.filter(
          child => !child.roles || child.roles.includes(userRole as UserRole)
        );
        return { ...item, children: filteredChildren };
      }
      return item;
    })
    .filter(item => !item.children || item.children.length > 0);
}
