import { z } from "zod";

const basePkpuSchema = z.object({
  nomor: z.coerce.number().int().positive(),
  tahun: z.coerce.number().int().min(1945).max(2200),
  judul: z.string().min(5),
  tanggalPenetapan: z.coerce.date(),
  statusHukum: z.enum(["induk", "revisi"]),
  kategori: z.string().min(1),
  fileUrl: z.string().min(1),
  parentId: z.string().nullable().optional(),
  isActive: z.coerce.boolean().default(true),
});

export const createPkpuSchema = basePkpuSchema.superRefine((data, ctx) => {
  if (data.statusHukum === "revisi" && !data.parentId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "PKPU revisi wajib memiliki parentId.",
      path: ["parentId"],
    });
  }

  if (data.statusHukum === "induk" && data.parentId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "PKPU induk tidak boleh memiliki parentId.",
      path: ["parentId"],
    });
  }
});

export const updatePkpuSchema = createPkpuSchema;

export type CreatePkpuInput = z.infer<typeof createPkpuSchema>;
