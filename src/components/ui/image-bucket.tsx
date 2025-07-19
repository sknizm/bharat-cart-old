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
import { UploadCloud, Trash2, Loader2, Image as ImageIcon, } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

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
  const [uploading, setUploading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [open, setOpen] = useState(false);

  const fetchImages = async () => {
    try {
      setFetching(true);
      const res = await fetch(`/api/store/${slug}/images`);
      if (!res.ok) throw new Error("Failed to fetch images");
      const data = await res.json();
      setImages(data);
    } catch (error) {
      console.error("Error fetching images:", error);
      toast.error("Failed to fetch images");
    } finally {
      setFetching(false);
    }
  };

  const uploadImage = async () => {
    if (!file) return;
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`/api/store/${slug}/images`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setFile(null);
        await fetchImages();
        
      toast.success("Image uploaded successfully");
     
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (id: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/store/${slug}/images`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        await fetchImages();
      toast.success("Image deleted successfully");
      
      } else {
        throw new Error("Failed to delete image");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image");
      
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 2 * 1024 * 1024) { // 5MB limit
        
      toast.error("Please select an image smaller than 5MB");
     
        return;
      }
      setFile(selectedFile);
    }
  };

  useEffect(() => {
    if (open) {
      fetchImages();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <ImageIcon className="w-4 h-4" />
          Select Image
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-[calc(100%-2rem)] sm:w-full h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Image Bucket
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="relative w-full">
              <Input
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                className="cursor-pointer"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
            <Button
              onClick={uploadImage}
              disabled={uploading || !file}
              className="w-full sm:w-auto"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4 mr-2" />
                  Upload
                </>
              )}
            </Button>
          </div>

          {file && (
            <div className="p-3 border rounded-lg bg-muted/50 flex items-center gap-3">
              <div className="relative w-16 h-16 rounded-md overflow-hidden">
                <Image
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setFile(null)}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}

          <ScrollArea className="flex-1 border rounded-lg">
            {fetching ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-3">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-square w-full rounded-lg" />
                ))}
              </div>
            ) : images.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground p-6">
                <ImageIcon className="w-12 h-12" strokeWidth={1} />
                <p className="text-center">No images found</p>
                <p className="text-sm text-center">
                  Upload your first image to get started
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-3">
                {images.map((img) => (
                  <div
                    key={img.id}
                    className="relative group aspect-square rounded-lg overflow-hidden border hover:shadow-md transition-shadow"
                  >
                    <button
                      onClick={() => {
                        onSelect(img.url);
                        setOpen(false);
                      }}
                      className="block w-full h-full"
                    >
                      <Image
                        src={img.url}
                        alt={img.alt || "Image"}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    </button>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteImage(img.id);
                          }}
                          disabled={loading}
                          className="absolute top-2 right-2 bg-background/80 p-1.5 rounded-full shadow hover:bg-destructive hover:text-white transition-colors"
                        >
                          {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>Delete image</TooltipContent>
                    </Tooltip>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}