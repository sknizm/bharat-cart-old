'use client';

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { UploadCloud, Trash2 } from "lucide-react";
import { useStore } from "../../store-context";

type StoreImage = {
  id: string;
  url: string;
  alt: string | null;
};

export default function ImageManagerPage() {
  const store  = useStore();
  const slug = store.slug;

  const [images, setImages] = useState<StoreImage[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchImages = async () => {
    const res = await fetch(`/api/store/${slug}/images`);
    const data = await res.json();
    setImages(data);
  };

  const uploadImage = async () => {
    if (!file) return;
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
    }

    setLoading(false);
  };

  const deleteImage = async (id: string) => {
    const res = await fetch(`/api/store/${slug}/images`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      await fetchImages();
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Store Image Bucket</h1>

      <div className="flex items-center gap-3 mb-6">
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <Button onClick={uploadImage} disabled={!file || loading}>
          <UploadCloud className="w-4 h-4 mr-1" />
          {loading ? "Uploading..." : "Upload"}
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {images.map((img) => (
          <div key={img.id} className="relative border rounded overflow-hidden group">
            <Image
              src={img.url}
              alt={img.alt || "Image"}
              width={300}
              height={200}
              className="object-cover w-full h-40"
            />
            <button
              onClick={() => deleteImage(img.id)}
              className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-red-100"
              title="Delete"
            >
              <Trash2 className="text-red-500 w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
