import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const kategoriSchema = new Schema(
  {
    nama: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    deskripsi: { type: String, default: "" },
  },
  { timestamps: true }
);

kategoriSchema.index({ nama: 1 });

export type Kategori = InferSchemaType<typeof kategoriSchema>;

export const KategoriModel: Model<Kategori> =
  models.Kategori || model<Kategori>("Kategori", kategoriSchema);
