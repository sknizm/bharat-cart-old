// app/api/store/[slug]/images/route.ts
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/queries/user';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs/promises';


export async function GET(_: Request, { params }: { params: { slug: string } }) {
  const store = await prisma.store.findUnique({
    where: { slug: params.slug },
    select: { id: true },
  });

  if (!store) return NextResponse.json({ error: 'Store not found' }, { status: 404 });

  const images = await prisma.image.findMany({
    where: { storeId: store.id },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(images);
}


const UPLOAD_DIR = path.join(process.cwd(), 'public/uploads');

async function ensureUploadDir() {
  try {
    await fs.access(UPLOAD_DIR);
  } catch {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    console.log(`Created upload directory at ${UPLOAD_DIR}`);
  }
}

export async function POST(req: Request, { params }: { params: { slug: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string | null;
    const alt = formData.get('alt') as string | null;

    if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });

    await ensureUploadDir();

    const ext = path.extname(file.name);
    const filename = `${uuidv4()}${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(UPLOAD_DIR, filename);
    await fs.writeFile(filePath, buffer);

    const imageUrl = `/uploads/${filename}`;

    const store = await prisma.store.findUnique({
      where: { slug: params.slug },
      select: { id: true },
    });

    if (!store) return NextResponse.json({ error: 'Store not found' }, { status: 404 });

    const image = await prisma.image.create({
      data: {
        storeId: store.id,
        url: imageUrl,
        type,
        alt,
      },
    });

    return NextResponse.json(image);
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'Image ID is required' }, { status: 400 });

    const image = await prisma.image.findUnique({ where: { id } });
    if (!image) return NextResponse.json({ error: 'Image not found' }, { status: 404 });

    const filePath = path.join(process.cwd(), 'public', image.url); // image.url starts with "/uploads/"

    try {
      await fs.access(filePath);
      await fs.unlink(filePath);
      console.log(`Deleted file: ${filePath}`);
    } catch {
      console.warn(`File ${filePath} not found, skipping delete`);
    }

    await prisma.image.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
  }
}