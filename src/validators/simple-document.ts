import { z } from "zod";

export const simpleDocumentSchema = z.object({
  type: z.enum(["sk", "berita-acara"]),
  nomor: z.string().min(1),
  tahun: z.coerce.number().int().min(1945).max(2200),
  judul: z.string().min(5),
  tanggalDokumen: z.coerce.date(),
  visibility: z.enum(["public", "private"]).default("public"),
  fileUrl: z.string().min(1),
  isActive: z.coerce.boolean().default(true),
});

export type SimpleDocumentInput = z.infer<typeof simpleDocumentSchema>;
