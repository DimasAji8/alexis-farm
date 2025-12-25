import { auth } from "@/app/api/(features)/auth/auth";

import { SignOutButton } from "@/components/features/auth/SignOutButton";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-600">Alexis Farm</p>
            <p className="text-lg font-semibold text-slate-900">Dashboard</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold">{session?.user?.name ?? session?.user?.username ?? "User"}</p>
              <p className="text-xs text-slate-500">{session?.user?.role ?? "staff"}</p>
            </div>
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
