import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const simpleDocumentSchema = new Schema(
  {
    type: { type: String, enum: ["sk", "berita-acara"], required: true },
    nomor: { type: String, required: true, trim: true },
    tahun: { type: Number, required: true, min: 1945 },
    judul: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    tanggalDokumen: { type: Date, required: true },
    visibility: { type: String, enum: ["public", "private"], default: "public" },
    fileUrl: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    viewCount: { type: Number, default: 0 },
    downloadCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

simpleDocumentSchema.index({ type: 1, tahun: -1, nomor: 1 });
simpleDocumentSchema.index({ judul: "text" });
simpleDocumentSchema.index({ visibility: 1, isActive: 1 });
simpleDocumentSchema.index({ type: 1, nomor: 1, tahun: 1 }, { unique: true });

export type SimpleDocument = InferSchemaType<typeof simpleDocumentSchema>;

export const SimpleDocumentModel: Model<SimpleDocument> =
  models.SimpleDocument || model<SimpleDocument>("SimpleDocument", simpleDocumentSchema);
