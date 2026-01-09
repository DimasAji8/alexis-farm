export type JenisPakan = {
  id: string;
  kode: string;
  nama: string;
  satuan: string;
  keterangan?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateJenisPakanInput = {
  kode: string;
  nama: string;
  satuan?: string;
  keterangan?: string;
  isActive?: boolean;
};

export type UpdateJenisPakanInput = Partial<CreateJenisPakanInput>;
