import { auth } from "@/app/api/(features)/auth/auth";

export default async function DashboardPage() {
  const session = await auth();

  return (
    <section className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80">
        <p className="text-sm uppercase tracking-[0.2em] text-amber-600">Selamat datang</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">
          Hai, {session?.user?.name ?? session?.user?.username ?? "pengguna"} 👋
        </h1>
        <p className="mt-2 text-slate-600">
          Mulai pantau kandang, pakan, produksi telur, dan laporan keuangan dari satu tempat.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { title: "Kandang", desc: "Status kandang, populasi ayam, mortalitas." },
          { title: "Pakan", desc: "Pembelian & pemakaian pakan dengan FIFO." },
          { title: "Telur", desc: "Produksi harian, stok, dan penjualan." },
        ].map((item) => (
          <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">{item.title}</p>
            <p className="text-sm text-slate-600">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
