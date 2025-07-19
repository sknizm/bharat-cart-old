'use client';

import { ImageBucket } from "@/components/ui/image-bucket";
import { useStore } from "../../store-context";


export default function Page() {
    const store = useStore();

  const handleImageSelect = (url: string) => {
    alert(`Selected image URL: ${url}` );
    // You can also do something like setSelectedImage(url) here
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Manage Store Images</h1>
      <ImageBucket slug={store.slug} onSelect={handleImageSelect} />
    </div>
  );
}
