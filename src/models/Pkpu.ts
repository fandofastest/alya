import {
  Schema,
  model,
  models,
  type InferSchemaType,
  type Model,
} from "mongoose";

const pkpuSchema = new Schema(
  {
    nomor: { type: Number, required: true, min: 1 },
    tahun: { type: Number, required: true, min: 1945 },
    judul: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    tanggalPenetapan: { type: Date, required: true },
    statusHukum: { type: String, enum: ["induk", "revisi"], required: true },
    kategori: { type: Schema.Types.ObjectId, ref: "Kategori", required: true },
    fileUrl: { type: String, required: true },
    parentId: { type: Schema.Types.ObjectId, ref: "Pkpu", default: null },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

pkpuSchema.index({ judul: "text" });
pkpuSchema.index({ tahun: 1 });
pkpuSchema.index({ statusHukum: 1 });
pkpuSchema.index({ kategori: 1 });
pkpuSchema.index({ nomor: 1, tahun: 1 }, { unique: true });

export type Pkpu = InferSchemaType<typeof pkpuSchema>;

export const PkpuModel: Model<Pkpu> = models.Pkpu || model<Pkpu>("Pkpu", pkpuSchema);
