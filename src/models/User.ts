import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const userSchema = new Schema(
  {
    nip: { type: String, required: true, unique: true, trim: true },
    email: { type: String, default: "", lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    nama: { type: String, required: true, trim: true },
    isActive: { type: Boolean, default: true },
    tipe: { type: String, enum: ["pegawai", "komisioner"], default: "pegawai" },
  },
  { timestamps: true }
);

export type User = InferSchemaType<typeof userSchema>;

export const UserModel: Model<User> = models.User || model<User>("User", userSchema);
