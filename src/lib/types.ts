export type StatusHukum = "berlaku" | "revisi" | "dicabut" | "induk";

export type KategoriRecord = {
  _id: string;
  nama: string;
  slug: string;
  deskripsi?: string;
};

export type PkpuRecord = {
  _id: string;
  nomor: number;
  tahun: number;
  judul: string;
  slug: string;
  tanggalPenetapan: string;
  statusHukum: StatusHukum;
  kategori: KategoriRecord | string;
  fileUrl: string;
  parentId?: Partial<PkpuRecord> | string | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};
