import { z } from "zod";

export const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const userLoginSchema = z.object({
  nip: z.string().trim().min(4),
  password: z.string().min(6),
  tipe: z.enum(["pegawai", "komisioner"]).default("pegawai"),
});
