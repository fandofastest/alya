import { connectDb } from "@/lib/db";
import { getPublicSession } from "@/lib/auth";
import { KategoriModel } from "@/models/Kategori";
import { PkpuModel } from "@/models/Pkpu";

export async function getKategoriList() {
  await connectDb();
  return KategoriModel.find({ parentId: null }).sort({ nama: 1 }).lean();
}

export async function getLatestPkpu(limit = 8) {
  await connectDb();
  const viewer = await getPublicSession();
  return PkpuModel.find({ isActive: true, ...(viewer ? {} : { visibility: { $ne: "private" } }) })
    .populate("kategori")
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
}

export async function getPkpuBySlug(slug: string) {
  await connectDb();
  const viewer = await getPublicSession();
  return PkpuModel.findOne({ slug, isActive: true, ...(viewer ? {} : { visibility: { $ne: "private" } }) })
    .populate("kategori")
    .populate("parentId")
    .lean();
}

export async function getRevisiListByParent(parentId: string) {
  await connectDb();
  const viewer = await getPublicSession();
  return PkpuModel.find({ parentId, isActive: true, ...(viewer ? {} : { visibility: { $ne: "private" } }) })
    .sort({ tahun: -1, nomor: -1 })
    .lean();
}

export async function getPkpuByKategoriSlug(slug: string) {
  await connectDb();
  const kategori = await KategoriModel.findOne({ slug }).lean();
  if (!kategori) return { kategori: null, data: [] };

  const kategoriIds: string[] = [kategori._id.toString()];
  let frontier: string[] = [kategori._id.toString()];
  while (frontier.length > 0) {
    const children = await KategoriModel.find({ parentId: { $in: frontier } }).select("_id").lean();
    const childIds = children.map((c) => c._id.toString());
    const newIds = childIds.filter((id) => !kategoriIds.includes(id));
    kategoriIds.push(...newIds);
    frontier = newIds;
  }

  const data = await PkpuModel.find({
    kategori: kategoriIds.length > 1 ? { $in: kategoriIds } : kategori._id,
    isActive: true,
    ...((await getPublicSession()) ? {} : { visibility: { $ne: "private" } }),
  })
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
