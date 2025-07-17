import { MenuItem } from "@/lib/types";
import { Loader2, Trash } from "lucide-react";
import { Button } from "./button";
import { ImageUploader } from "./image-uploader";
import { Input } from "./input";
import { TableCell, TableRow } from "./table";


export const MenuItemRow = ({
  item,
  onUpdate,
  onDelete,
  onToggleAvailability,
  onImageUpload,
  onImageDelete,
  isLoading
}: {
  item: MenuItem;
  onUpdate: (updatedItem: MenuItem) => void;
  onDelete: () => void;
  onToggleAvailability: () => void;
  onImageUpload: (file: File) => void;
  onImageDelete: () => void;
  isLoading: boolean;
}) => {
  return (
    <TableRow>
      <TableCell>
        <ImageUploader
          imageUrl={item.image}
          onUpload={onImageUpload}
          onDelete={onImageDelete}
          isLoading={isLoading}
        />
      </TableCell>
      <TableCell>
        <Input
          value={item.name}
          onChange={(e) => onUpdate({ ...item, name: e.target.value })}
          className="border-none p-0"
        />
      </TableCell>
      <TableCell className="hidden sm:table-cell">
        <Input
          value={item.description || ''}
          onChange={(e) => onUpdate({ ...item, description: e.target.value })}
          className="border-none p-0"
        />
      </TableCell>
      <TableCell>
        <Input
          type="number"
          value={item.price}
          onChange={(e) => onUpdate({ ...item, price: parseFloat(e.target.value) || 0 })}
          className="border-none p-0 w-20"
        />
      </TableCell>
      <TableCell className="hidden xs:table-cell">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleAvailability}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <input
              type="checkbox"
              checked={item.isAvailable}
              readOnly
              className="h-4 w-4"
            />
          )}
        </Button>
      </TableCell>
      <TableCell className="text-right">
        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash className="h-4 w-4 text-red-500" />
          )}
        </Button>
      </TableCell>
    </TableRow>
  );
};