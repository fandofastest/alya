import { mkdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";

import mongoose from "mongoose";
import slugify from "slugify";

import { KategoriModel } from "../src/models/Kategori";
import { PkpuModel } from "../src/models/Pkpu";

const SAMPLE_PDF_BASE64 =
  "JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PCAvVHlwZSAvQ2F0YWxvZyAvUGFnZXMgMiAwIFIgPj4KZW5kb2JqCjIgMCBvYmoKPDwgL1R5cGUgL1BhZ2VzIC9Db3VudCAxIC9LaWRzIFszIDAgUl0gPj4KZW5kb2JqCjMgMCBvYmoKPDwgL1R5cGUgL1BhZ2UgL1BhcmVudCAyIDAgUiAvTWVkaWFCb3ggWzAgMCA1OTUgODQyXSAvUmVzb3VyY2VzIDw8IC9Gb250IDw8IC9GMSA0IDAgUiA+PiA+PiAvQ29udGVudHMgNSAwIFIgPj4KZW5kb2JqCjQgMCBvYmoKPDwgL1R5cGUgL0ZvbnQgL1N1YnR5cGUgL1R5cGUxIC9CYXNlRm9udCAvSGVsdmV0aWNhID4+CmVuZG9iago1IDAgb2JqCjw8IC9MZW5ndGggNjEgPj4Kc3RyZWFtCkJUIAovRjEgMjQgVGYKNzIgNzIwIFRkCihQb3J0YWwgUmVndWxhc2kgUEtQVSkgVGoKRVQKZW5kc3RyZWFtCmVuZG9iagp4cmVmCjAgNgowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTUgMDAwMDAgbiAKMDAwMDAwMDA2NSAwMDAwMCBuIAowMDAwMDAwMTIwIDAwMDAwIG4gCjAwMDAwMDAyNzAgMDAwMDAgbiAKMDAwMDAwMDM0MCAwMDAwMCBuIAp0cmFpbGVyCjw8IC9TaXplIDYgL1Jvb3QgMSAwIFIgPj4Kc3RhcnR4cmVmCjQzNAolJUVPRgo=";

async function ensureSamplePdf(): Promise<string> {
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });
  const filename = "seed-sample.pdf";
  const absolutePath = path.join(uploadsDir, filename);
  try {
    const info = await stat(absolutePath);
    if (info.size > 0) return `/uploads/${filename}`;
  } catch {
  }

  const buffer = Buffer.from(SAMPLE_PDF_BASE64, "base64");
  await writeFile(absolutePath, buffer);
  return `/uploads/${filename}`;
}

async function main() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error("MONGODB_URI belum di-set.");
  }

  await mongoose.connect(mongoUri, {
    dbName: process.env.MONGODB_DBNAME,
    maxPoolSize: 10,
  });

  const pdfUrl = await ensureSamplePdf();

  const kategoriSeed = [
    {
      nama: "Pemilihan Umum",
      slug: slugify("Pemilihan Umum", { lower: true, strict: true, trim: true }),
      deskripsi: "Regulasi terkait tahapan dan penyelenggaraan pemilihan umum.",
    },
    {
      nama: "Teknis Penyelenggaraan",
      slug: slugify("Teknis Penyelenggaraan", { lower: true, strict: true, trim: true }),
      deskripsi: "Ketentuan teknis pelaksanaan penyelenggaraan pemilu/pemilihan.",
    },
    {
      nama: "Administrasi",
      slug: slugify("Administrasi", { lower: true, strict: true, trim: true }),
      deskripsi: "Ketentuan administrasi dan tata kelola internal penyelenggara.",
    },
  ];

  for (const item of kategoriSeed) {
    await KategoriModel.updateOne({ slug: item.slug }, { $set: item }, { upsert: true });
  }

  const kategoriList = await KategoriModel.find().lean();
  const kategoriMap = new Map(kategoriList.map((k) => [k.slug, k._id]));
  const kategoriPemilu = kategoriMap.get(slugify("Pemilihan Umum", { lower: true, strict: true, trim: true }));

  if (!kategoriPemilu) {
    throw new Error("Seed kategori gagal dibuat.");
  }

  const indukPayload = {
    nomor: 1,
    tahun: 2024,
    judul: "Peraturan Komisi Pemilihan Umum tentang Contoh PKPU Induk",
    slug: slugify("Peraturan Komisi Pemilihan Umum tentang Contoh PKPU Induk-1-2024", {
      lower: true,
      strict: true,
      trim: true,
    }),
    tanggalPenetapan: new Date("2024-01-15T00:00:00.000Z"),
    statusHukum: "induk" as const,
    kategori: kategoriPemilu,
    fileUrl: pdfUrl,
    parentId: null,
    isActive: true,
  };

  await PkpuModel.updateOne(
    { nomor: indukPayload.nomor, tahun: indukPayload.tahun },
    { $set: indukPayload },
    { upsert: true }
  );

  const induk = await PkpuModel.findOne({ nomor: indukPayload.nomor, tahun: indukPayload.tahun });
  if (!induk) throw new Error("Seed PKPU induk gagal dibuat.");

  const revisiPayload = {
    nomor: 2,
    tahun: 2024,
    judul: "Perubahan atas PKPU No 1 Tahun 2024 (Contoh PKPU Revisi)",
    slug: slugify("Perubahan atas PKPU No 1 Tahun 2024 (Contoh PKPU Revisi)-2-2024", {
      lower: true,
      strict: true,
      trim: true,
    }),
    tanggalPenetapan: new Date("2024-03-05T00:00:00.000Z"),
    statusHukum: "revisi" as const,
    kategori: kategoriPemilu,
    fileUrl: pdfUrl,
    parentId: induk._id,
    isActive: true,
  };

  await PkpuModel.updateOne(
    { nomor: revisiPayload.nomor, tahun: revisiPayload.tahun },
    { $set: revisiPayload },
    { upsert: true }
  );

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
