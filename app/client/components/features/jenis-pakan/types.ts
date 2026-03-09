export type JenisPakan = {
  id: string;
  kandangId: string;
  kode: string;
  nama: string;
  satuan: string;
  keterangan?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  kandang?: {
    id: string;
    kode: string;
    nama: string;
  };
};

export type CreateJenisPakanInput = {
  kandangId: string;
  kode: string;
  nama: string;
  satuan?: string;
  keterangan?: string;
  isActive?: boolean;
};

export type UpdateJenisPakanInput = Partial<CreateJenisPakanInput>;
