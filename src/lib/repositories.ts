import { connectDb } from "@/lib/db";
import { KategoriModel } from "@/models/Kategori";
import { PkpuModel } from "@/models/Pkpu";

export async function getKategoriList() {
  await connectDb();
  return KategoriModel.find().sort({ nama: 1 }).lean();
}

export async function getLatestPkpu(limit = 8) {
  await connectDb();
  return PkpuModel.find({ isActive: true })
    .populate("kategori")
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
}

export async function getPkpuBySlug(slug: string) {
  await connectDb();
  return PkpuModel.findOne({ slug, isActive: true }).populate("kategori").populate("parentId").lean();
}

export async function getRevisiListByParent(parentId: string) {
  await connectDb();
  return PkpuModel.find({ parentId, isActive: true }).sort({ tahun: -1, nomor: -1 }).lean();
}

export async function getPkpuByKategoriSlug(slug: string) {
  await connectDb();
  const kategori = await KategoriModel.findOne({ slug }).lean();
  if (!kategori) return { kategori: null, data: [] };
  const data = await PkpuModel.find({ kategori: kategori._id, isActive: true })
    .sort({ tahun: -1, nomor: -1 })
    .lean();
  return { kategori, data };
}

export async function getAdminDashboardStats() {
  await connectDb();
  const [totalPkpu, totalBerlaku, totalRevisi, totalDicabut, totalKategori, lastUpdated] = await Promise.all([
    PkpuModel.countDocuments({}),
    PkpuModel.countDocuments({ statusHukum: { $in: ["berlaku", "induk"] } }),
    PkpuModel.countDocuments({ statusHukum: "revisi" }),
    PkpuModel.countDocuments({ statusHukum: "dicabut" }),
    KategoriModel.countDocuments({}),
    PkpuModel.findOne({}).sort({ updatedAt: -1 }).select("updatedAt").lean(),
  ]);

  return {
    totalPkpu,
    totalBerlaku,
    totalRevisi,
    totalDicabut,
    totalKategori,
    lastUpdatedAt: lastUpdated?.updatedAt ?? null,
  };
}

export async function incrementPkpuView(id: string) {
  await connectDb();
  return PkpuModel.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });
}

export async function incrementPkpuDownload(id: string) {
  await connectDb();
  return PkpuModel.findByIdAndUpdate(id, { $inc: { downloadCount: 1 } });
}
