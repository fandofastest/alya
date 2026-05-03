import slugify from "slugify";

export function generatePkpuSlug(judul: string, nomor: number, tahun: number) {
  return slugify(`${judul}-${nomor}-${tahun}`, {
    lower: true,
    strict: true,
    trim: true,
  });
}

export function formatTanggalIndonesia(date: Date | string) {
  const parsed = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(parsed);
}

export function toObjectIdString(value: unknown): string | null {
  if (!value || typeof value !== "object") return null;
  if ("toString" in value && typeof value.toString === "function") {
    return value.toString();
  }
  return null;
}
