import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";

export default function MasterDataUsersPage() {
  return (
    <section className="space-y-6">
      <PageHeader
        title="Users"
        description="Kelola akses pengguna untuk modul operasional dan laporan."
        eyebrow="Master Data"
      />
      <EmptyState
        title="Belum ada pengguna"
        description="Halaman ini akan diisi dengan daftar pengguna dan pengaturan peran."
      />
    </section>
  );
}
