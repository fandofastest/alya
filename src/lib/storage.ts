import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";
import { google } from "googleapis";

import { env } from "@/lib/env";

const uploadDirectory = path.join(process.cwd(), "public", "uploads");

async function localStore(file: File): Promise<string> {
  await mkdir(uploadDirectory, { recursive: true });
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const filename = `${Date.now()}-${safeName}`;
  await writeFile(path.join(uploadDirectory, filename), buffer);
  return `/uploads/${filename}`;
}

async function gDriveStore(file: File): Promise<string> {
  if (!env.GDRIVE_CLIENT_ID || !env.GDRIVE_CLIENT_SECRET || !env.GDRIVE_REFRESH_TOKEN) {
    throw new Error("Kredensial OAuth2 Google Drive tidak lengkap.");
  }

  const oauth2Client = new google.auth.OAuth2(
    env.GDRIVE_CLIENT_ID,
    env.GDRIVE_CLIENT_SECRET
  );

  oauth2Client.setCredentials({
    refresh_token: env.GDRIVE_REFRESH_TOKEN,
  });

  const drive = google.drive({ version: "v3", auth: oauth2Client });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);

  const response = await drive.files.create({
    requestBody: {
      name: `${Date.now()}-${file.name}`,
      parents: env.GDRIVE_FOLDER_ID ? [env.GDRIVE_FOLDER_ID] : undefined,
    },
    media: {
      mimeType: file.type,
      body: stream,
    },
    fields: "id, webViewLink",
  });

  const fileId = response.data.id;

  if (fileId) {
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });
  }

  return response.data.webViewLink || "";
}

async function externalStore(file: File, metadata: any): Promise<string> {
  if (!env.EXTERNAL_UPLOAD_TOKEN) {
    throw new Error("External upload token tidak ditemukan.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("senderName", "Portal ALYA");
  formData.append("uploaderPhone", "081378949932");
  formData.append("docNumber", metadata.nomor || "");
  formData.append("docDate", metadata.tanggalPenetapan || new Date().toISOString());
  formData.append("title", metadata.judul || "");
  formData.append("year", String(metadata.tahun || ""));
  formData.append("sourceType", "api");
  formData.append("caption", metadata.judul || "");
  formData.append("description", metadata.judul || "");
  formData.append("category", "hukum-peraturan");

  const response = await fetch(env.EXTERNAL_UPLOAD_URL, {
    method: "POST",
    headers: {
      "x-integration-token": env.EXTERNAL_UPLOAD_TOKEN,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `External upload failed with status ${response.status}`);
  }

  const result = await response.json();
  if (!result.success || !result.data?.archive?.archiveId) {
    throw new Error("Gagal mendapatkan archive ID dari server eksternal.");
  }

  // Mengembalikan URL proxy lokal agar token tetap aman di server
  return `/api/pkpu/file/${result.data.archive.archiveId}`;
}

async function mockExternalStore(file: File): Promise<string> {
  // Placeholder for S3/Supabase driver integration.
  return localStore(file);
}

export async function storePdfFile(file: File, metadata: any = {}): Promise<string> {
  if (env.STORAGE_DRIVER === "external") {
    return externalStore(file, metadata);
  }

  if (env.STORAGE_DRIVER === "gdrive") {
    return gDriveStore(file);
  }

  if (env.STORAGE_DRIVER === "s3" || env.STORAGE_DRIVER === "supabase") {
    return mockExternalStore(file);
  }

  return localStore(file);
}
