// lib/utils/images.ts
import { promises as fs } from "fs";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "components/uploads");

export async function saveImage(file: File): Promise<string> {
  const ext = path.extname(file.name);
  const filename = `${Date.now()}${ext}`;
  const buffer = await file.arrayBuffer();
  
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.writeFile(path.join(UPLOAD_DIR, filename), Buffer.from(buffer));
  
  return `/uploads/${filename}`;
}

export async function deleteImage(imageUrl: string): Promise<void> {
  const filename = path.basename(imageUrl);
  const filePath = path.join(UPLOAD_DIR, filename);
  
  try {
    await fs.access(filePath);
    await fs.unlink(filePath);
  } catch (err) {
    console.warn(`Image ${filename} not found, skipping delete`);
  }
}