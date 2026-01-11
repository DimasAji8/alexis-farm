import { auth } from "@/app/api/(features)/auth/auth";
import { KandangOverview } from "@/components/common/kandang-overview";

export default async function DashboardPage() {
  const session = await auth();

  return (
    <section className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80 dark:bg-slate-900 dark:ring-slate-700">
        <p className="text-sm uppercase tracking-[0.2em] text-amber-600">Selamat datang</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">
          Hai, {session?.user?.name ?? session?.user?.username ?? "pengguna"} 👋
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Pilih kandang untuk mulai mengelola data.
        </p>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Pilih Kandang</h2>
        <KandangOverview />
      </div>
    </section>
  );
}
