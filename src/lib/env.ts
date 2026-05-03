type EnvKey = "MONGODB_URI" | "JWT_SECRET";

function getRequiredEnv(key: EnvKey): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function getRequiredRawEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

const isProduction = process.env.NODE_ENV === "production";

export const env = {
  get MONGODB_URI() {
    return getRequiredEnv("MONGODB_URI");
  },
  get JWT_SECRET() {
    return getRequiredEnv("JWT_SECRET");
  },
  get ADMIN_EMAIL() {
    return isProduction
      ? getRequiredRawEnv("ADMIN_EMAIL")
      : (process.env.ADMIN_EMAIL ?? "admin@kpu.go.id");
  },
  get ADMIN_PASSWORD() {
    return isProduction
      ? getRequiredRawEnv("ADMIN_PASSWORD")
      : (process.env.ADMIN_PASSWORD ?? "admin123!");
  },
  get STORAGE_DRIVER() {
    return process.env.STORAGE_DRIVER ?? "local";
  },
  get GDRIVE_CLIENT_ID() {
    return process.env.GDRIVE_CLIENT_ID;
  },
  get GDRIVE_CLIENT_SECRET() {
    return process.env.GDRIVE_CLIENT_SECRET;
  },
  get GDRIVE_REFRESH_TOKEN() {
    return process.env.GDRIVE_REFRESH_TOKEN;
  },
  get GDRIVE_FOLDER_ID() {
    return process.env.GDRIVE_FOLDER_ID;
  },
  get EXTERNAL_UPLOAD_URL() {
    return process.env.EXTERNAL_UPLOAD_URL ?? "https://serverkpu.fando.id/api/integrations/uploads";
  },
  get EXTERNAL_UPLOAD_TOKEN() {
    return process.env.EXTERNAL_UPLOAD_TOKEN;
  },
  get APP_URL() {
    return process.env.APP_URL ?? "http://localhost:3000";
  },
};
