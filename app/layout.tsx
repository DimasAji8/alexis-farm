import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Alexis Farm | Manajemen Peternakan Ayam",
  description: "Dashboard peternakan ayam: kandang, pakan, telur, dan laporan keuangan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased font-sans">{children}</body>
    </html>
  );
}
