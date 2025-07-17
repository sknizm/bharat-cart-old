import { ImageIcon, Loader2, Trash } from "lucide-react";
import { useRef } from "react";
import { Button } from "./button";

export const ImageUploader = ({
  imageUrl,
  onUpload,
  onDelete,
  isLoading
}: {
  imageUrl?: string;
  onUpload: (file: File) => void;
  onDelete: () => void;
  isLoading: boolean;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      onUpload(e.target.files[0]);
      e.target.value = '';
    }
  };

  return (
    <div className="relative">
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <Button
        variant="ghost"
        size="icon"
        onClick={() => fileInputRef.current?.click()}
        disabled={isLoading}
        className="h-10 w-10 p-0"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : imageUrl ? (
          <>
            <img 
              src={imageUrl} 
              alt="Menu item"
              className="h-10 w-10 rounded-md object-cover"
            />
            <button
              type="button"
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash className="h-3 w-3" />
            </button>
          </>
        ) : (
          <ImageIcon className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};