import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";

export default function MasterDataJenisPakanPage() {
  return (
    <section className="space-y-6">
      <PageHeader
        title="Jenis Pakan"
        description="Kelola daftar jenis pakan untuk pencatatan pembelian dan pemakaian."
        eyebrow="Master Data"
      />
      <EmptyState
        title="Belum ada jenis pakan"
        description="Halaman ini akan diisi dengan tabel data dan form pengelolaan."
      />
    </section>
  );
}
