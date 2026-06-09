export type StatusHukum = "berlaku" | "revisi" | "dicabut" | "induk";

export type KategoriRecord = {
  _id: string;
  nama: string;
  slug: string;
  deskripsi?: string;
  parentId?: string | null;
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
  visibility?: "public" | "private";
  fileUrl: string;
  parentId?: Partial<PkpuRecord> | string | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};
