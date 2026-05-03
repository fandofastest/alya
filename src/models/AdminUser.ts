import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const adminUserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    nama: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export type AdminUser = InferSchemaType<typeof adminUserSchema>;

export const AdminUserModel: Model<AdminUser> =
  models.AdminUser || model<AdminUser>("AdminUser", adminUserSchema);
