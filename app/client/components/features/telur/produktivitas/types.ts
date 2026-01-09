export type ProduktivitasTelur = {
  id: string;
  kandangId: string;
  tanggal: string;
  jumlahBagusButir: number;
  jumlahTidakBagusButir: number;
  totalButir: number;
  totalKg: number;
  keterangan?: string | null;
  createdAt: string;
  updatedAt: string;
  kandang: {
    id: string;
    kode: string;
    nama: string;
    jumlahAyam: number;
  };
};

export type CreateProduktivitasInput = {
  kandangId: string;
  tanggal: string;
  jumlahBagusButir: number;
  jumlahTidakBagusButir?: number;
  totalKg?: number;
  keterangan?: string;
};

export type UpdateProduktivitasInput = Partial<CreateProduktivitasInput>;
