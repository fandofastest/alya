import { Types } from "mongoose";

export function buildPkpuFilters(searchParams: URLSearchParams) {
  const query = searchParams.get("q")?.trim();
  const tahun = searchParams.get("tahun");
  const statusHukum = searchParams.get("statusHukum");
  const kategori = searchParams.get("kategori");
  const isActive = searchParams.get("isActive");

  const filter: Record<string, unknown> = {};

  if (query) {
    filter.$text = { $search: query };
  }

  if (tahun && !Number.isNaN(Number(tahun))) {
    filter.tahun = Number(tahun);
  }

  if (statusHukum === "induk" || statusHukum === "revisi") {
    filter.statusHukum = statusHukum;
  }

  if (kategori && Types.ObjectId.isValid(kategori)) {
    filter.kategori = new Types.ObjectId(kategori);
  }

  if (isActive === "true") filter.isActive = true;
  if (isActive === "false") filter.isActive = false;

  return { filter, query };
}
