// lib/utils/file-upload.ts
import { promises as fs } from "fs";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public/uploads");

export async function ensureUploadDir() {
  try {
    await fs.access(UPLOAD_DIR);
  } catch (error) {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    console.log(`Created upload directory at ${UPLOAD_DIR}`);
  }
}

export async function saveImage(file: File): Promise<string> {
  await ensureUploadDir();
  
  const ext = path.extname(file.name);
  const filename = `${Date.now()}${ext}`;
  const buffer = await file.arrayBuffer();
  
  await fs.writeFile(path.join(UPLOAD_DIR, filename), Buffer.from(buffer));
  
  return `/uploads/${filename}`;
}

export async function deleteImageFile(imageUrl: string): Promise<void> {
  const filename = path.basename(imageUrl);
  const filePath = path.join(UPLOAD_DIR, filename);
  
  try {
    await fs.access(filePath);
    await fs.unlink(filePath);
  } catch (err) {
    console.warn(`Image ${filename} not found, skipping delete`);
  }
}