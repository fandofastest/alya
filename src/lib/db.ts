import mongoose from "mongoose";

import { env } from "@/lib/env";

declare global {
  var mongooseConn:
    | {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
      }
    | undefined;
}

const cached = global.mongooseConn ?? { conn: null, promise: null };

export async function connectDb() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(env.MONGODB_URI, {
      dbName: "alyadb",
      maxPoolSize: 10,
    });
  }

  cached.conn = await cached.promise;
  global.mongooseConn = cached;
  return cached.conn;
}
