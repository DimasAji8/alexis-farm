export type SidebarNavIcon =
  | "dashboard"
  | "masterData"
  | "kandang"
  | "jenisPakan"
  | "users"
  | "ayam";

export type SidebarNavChild = {
  title: string;
  href: string;
};

export type SidebarNavItem = {
  title: string;
  icon: SidebarNavIcon;
  href?: string;
  children?: SidebarNavChild[];
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
    title: "Master Data",
    icon: "masterData",
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
      },
    ],
  },
];
