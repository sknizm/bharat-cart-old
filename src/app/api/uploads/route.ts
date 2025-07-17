// app/api/upload/route.ts
import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "@/lib/prisma";
import { getUserIdFromSession } from "@/lib/queries/user";

// Configure paths - IMPORTANT: Change this to your desired upload directory
const UPLOAD_DIR = path.join(process.cwd(), "public/uploads");
// const PUBLIC_URL = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

// Function to ensure upload directory exists
async function ensureUploadDir() {
  try {
    await fs.access(UPLOAD_DIR);
  } catch (error) {
    if(error)
    // Directory doesn't exist, create it
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    console.log(`Created upload directory at ${UPLOAD_DIR}`);
  }
}

export async function POST(req: Request) {
  try {
    // Ensure upload directory exists
    await ensureUploadDir();

    const userId = await getUserIdFromSession();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const itemId = formData.get("itemId") as string;

    if (!file || !itemId) {
      return NextResponse.json({ error: "Missing file or itemId" }, { status: 400 });
    }

    // Verify the menu item belongs to the user
    const restaurant = await prisma.restaurant.findFirst({
      where: { userId },
      include: { menuItems: { where: { id: itemId } } }
    });

    if (!restaurant?.menuItems.length) {
      return NextResponse.json({ error: "Menu item not found" }, { status: 404 });
    }

    // Delete old image if exists
    const oldItem = restaurant.menuItems[0];
    if (oldItem.image) {
      await deleteImage(oldItem.image);
    }

    // Generate unique filename
    const ext = path.extname(file.name);
    const filename = `${uuidv4()}${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    // Save file
    const filePath = path.join(UPLOAD_DIR, filename);
    await fs.writeFile(filePath, buffer);
    
    // Return relative path (from public folder)
    const imageUrl = `/uploads/${filename}`;

    // Update the menu item with new image
    await prisma.menuItem.update({
      where: { id: itemId },
      data: { image: imageUrl }
    });

    return NextResponse.json({ url: imageUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}

async function deleteImage(imageUrl: string) {
  try {
    const filename = path.basename(imageUrl);
    const filePath = path.join(UPLOAD_DIR, filename);
    
    // Check if file exists before deleting
    try {
      await fs.access(filePath);
      await fs.unlink(filePath);
      console.log(`Deleted image: ${filePath}`);
    } catch (err) {
      if(err)
      console.warn(`File ${filename} not found, skipping delete`);
    }
  } catch (error) {
    console.error("Error deleting image:", error);
    throw error;
  }
}