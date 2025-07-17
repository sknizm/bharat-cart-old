'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import Image from "next/image";
import { UploadCloud, Trash2 } from "lucide-react";

type StoreImage = {
  id: string;
  url: string;
  alt: string | null;
  type: string | null;
  createdAt: string;
  updatedAt: string;
};

interface ImageBucketProps {
  slug: string;
  onSelect: (url: string) => void;
}

export function ImageBucket({ slug, onSelect }: ImageBucketProps) {
  const [images, setImages] = useState<StoreImage[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchImages = async () => {
    try {
      const res = await fetch(`/api/store/${slug}/images`);
      if (!res.ok) throw new Error("Failed to fetch images");
      const data = await res.json();
      setImages(data);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const uploadImage = async () => {
    if (!file) return;
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`/api/store/${slug}/images`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setFile(null);
        await fetchImages();
      } else {
        console.error("Upload failed");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteImage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    try {
      const res = await fetch(`/api/store/${slug}/images`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        await fetchImages();
      } else {
        console.error("Failed to delete image");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  useEffect(() => {
    fetchImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open Image Bucket</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Image Bucket</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              accept="image/*"
            />
            <Button onClick={uploadImage} disabled={loading || !file}>
              <UploadCloud className="w-4 h-4 mr-1" />
              {loading ? "Uploading..." : "Upload"}
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-3 max-h-[400px] overflow-y-auto">
            {images.map((img) => (
              <div key={img.id} className="relative group border rounded overflow-hidden">
                <button
                  onClick={() => onSelect(img.url)}
                  className="block w-full h-[120px]"
                >
                  <Image
                    src={img.url}
                    alt={img.alt || "Image"}
                    width={200}
                    height={120}
                    className="object-cover w-full h-full"
                  />
                </button>
                <button
                  onClick={() => deleteImage(img.id)}
                  className="absolute top-1 right-1 bg-white p-1 rounded-full shadow hover:bg-red-100"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
