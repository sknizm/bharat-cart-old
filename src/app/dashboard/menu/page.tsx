"use client"
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Loader2, Trash } from "lucide-react";
import { Category, LoadingState, MenuItem } from "@/lib/types";
import { addCategory, addMenuItem, deleteCategory, deleteImage, deleteMenuItem, fetchMenuData, toggleAvailability, uploadImage } from "@/lib/queries/menu";
import { MenuItemRow } from "@/components/ui/menu-item-row";
import { ImageUploader } from "@/components/ui/image-uploader";


export default function MenuBuilderPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newItemData, setNewItemData] = useState<Record<string, Partial<MenuItem>>>({});
  const [actionLoading, setActionLoading] = useState<LoadingState>({
    addCategory: false,
    deleteCategory: "",
    addMenuItem: "",
    deleteMenuItem: "",
    toggleAvailability: "",
    uploadImage: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchMenuData();
      setCategories(data);
    } catch (error) {
      toast.error("Failed to load menu data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    
    try {
      setActionLoading(prev => ({ ...prev, addCategory: true }));
      const newCategory = await addCategory(newCategoryName);
      setCategories([...categories, { ...newCategory, menuItems: [] }]);
      setNewCategoryName("");
      toast.success("Category added successfully");
    } catch (error) {
      toast.error("Failed to add category");
      console.error(error);
    } finally {
      setActionLoading(prev => ({ ...prev, addCategory: false }));
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      setActionLoading(prev => ({ ...prev, deleteCategory: categoryId }));
      await deleteCategory(categoryId);
      setCategories(categories.filter(cat => cat.id !== categoryId));
      toast.success("Category deleted successfully");
    } catch (error) {
      toast.error("Failed to delete category");
      console.error(error);
    } finally {
      setActionLoading(prev => ({ ...prev, deleteCategory: "" }));
    }
  };

  const handleAddMenuItem = async (categoryId: string) => {
    const itemData = newItemData[categoryId];
    if (!itemData?.name || !itemData.price) return;

    try {
      setActionLoading(prev => ({ ...prev, addMenuItem: categoryId }));
      const newItem = await addMenuItem({
        ...itemData,
        categoryId,
        price: parseFloat(itemData.price as unknown as string),
        isAvailable: itemData.isAvailable !== false
      } as Omit<MenuItem, 'id'>);
      
      setCategories(categories.map(cat => 
        cat.id === categoryId 
          ? { ...cat, menuItems: [...cat.menuItems, newItem] } 
          : cat
      ));
      setNewItemData({ ...newItemData, [categoryId]: {} });
      toast.success("Menu item added successfully");
    } catch (error) {
      toast.error("Failed to add menu item");
      console.error(error);
    } finally {
      setActionLoading(prev => ({ ...prev, addMenuItem: "" }));
    }
  };

  const handleDeleteMenuItem = async (itemId: string) => {
    try {
      setActionLoading(prev => ({ ...prev, deleteMenuItem: itemId }));
      await deleteMenuItem(itemId);
      setCategories(categories.map(cat => ({
        ...cat,
        menuItems: cat.menuItems.filter(item => item.id !== itemId)
      })));
      toast.success("Menu item deleted successfully");
    } catch (error) {
      toast.error("Failed to delete menu item");
      console.error(error);
    } finally {
      setActionLoading(prev => ({ ...prev, deleteMenuItem: "" }));
    }
  };

  const handleToggleAvailability = async (itemId: string, currentStatus: boolean) => {
    try {
      setActionLoading(prev => ({ ...prev, toggleAvailability: itemId }));
      await toggleAvailability(itemId, !currentStatus);
      setCategories(categories.map(cat => ({
        ...cat,
        menuItems: cat.menuItems.map(item => 
          item.id === itemId ? { ...item, isAvailable: !currentStatus } : item
        )
      })));
      toast.success("Availability updated successfully");
    } catch (error) {
      toast.error("Failed to update availability");
      console.error(error);
    } finally {
      setActionLoading(prev => ({ ...prev, toggleAvailability: "" }));
    }
  };

  const handleImageUpload = async (itemId: string, file: File | null) => {
    if (!file) return;
    
    try {
      setActionLoading(prev => ({ ...prev, uploadImage: itemId }));
      
      const formData = new FormData();
      formData.append("file", file);
      formData.append("itemId", itemId);
  
      const response = await fetch('/api/uploads', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) throw new Error('Upload failed');
      
      const { url } = await response.json();
      
      setCategories(categories.map(cat => ({
        ...cat,
        menuItems: cat.menuItems.map(item => 
          item.id === itemId ? { ...item, image: url } : item
        )
      })));
      
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Upload error details:", error);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setActionLoading(prev => ({ ...prev, uploadImage: "" }));
    }
  };

  const handleImageDelete = async (itemId: string) => {
    try {
      setActionLoading(prev => ({ ...prev, uploadImage: itemId }));
      const item = categories
        .flatMap(cat => cat.menuItems)
        .find(item => item.id === itemId);
      
      if (item?.image) {
        await deleteImage(itemId, item.image);
        setCategories(categories.map(cat => ({
          ...cat,
          menuItems: cat.menuItems.map(i => 
            i.id === itemId ? { ...i, image: undefined } : i
          )
        })));
        toast.success("Image removed successfully");
      }
    } catch (error) {
      toast.error("Failed to remove image");
      console.error(error);
    } finally {
      setActionLoading(prev => ({ ...prev, uploadImage: "" }));
    }
  };

  const updateNewItemData = (categoryId: string, field: string, value: any) => {
    setNewItemData({
      ...newItemData,
      [categoryId]: {
        ...newItemData[categoryId],
        [field]: value
      }
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold">Menu Builder</h2>
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <Input
            placeholder="New category name"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            className="w-full md:w-48"
          />
          <Button 
            onClick={handleAddCategory}
            disabled={actionLoading.addCategory}
            className="w-full md:w-auto"
          >
            {actionLoading.addCategory ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Plus className="mr-2 h-4 w-4" />
            )}
            Add Category
          </Button>
        </div>
      </div>

      <div className="space-y-8">
        {categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No categories yet. Add your first category to get started.</p>
          </div>
        ) : (
          categories.map((category) => (
            <div key={category.id} className="border rounded-lg overflow-hidden">
              <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{category.name}</h3>
                  {category.description && (
                    <p className="text-sm text-gray-600">{category.description}</p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteCategory(category.id)}
                  className="text-red-500 hover:text-red-700"
                  disabled={actionLoading.deleteCategory === category.id}
                >
                  {actionLoading.deleteCategory === category.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <div className="overflow-x-auto">
                <Table className="min-w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Image</TableHead>
                      <TableHead>Item Name</TableHead>
                      <TableHead className="hidden sm:table-cell">Description</TableHead>
                      <TableHead>Price (₹)</TableHead>
                      <TableHead className="hidden xs:table-cell">Available</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {category.menuItems.map((item) => (
                      <MenuItemRow
                        key={item.id}
                        item={item}
                        onUpdate={(updatedItem) => {
                          setCategories(categories.map(cat => ({
                            ...cat,
                            menuItems: cat.menuItems.map(i => 
                              i.id === item.id ? updatedItem : i
                            )
                          })));
                        }}
                        onDelete={() => handleDeleteMenuItem(item.id)}
                        onToggleAvailability={() => handleToggleAvailability(item.id, item.isAvailable)}
                        onImageUpload={(file) => handleImageUpload(item.id, file)}
                        onImageDelete={() => handleImageDelete(item.id)}
                        isLoading={actionLoading.uploadImage === item.id || 
                                  actionLoading.deleteMenuItem === item.id ||
                                  actionLoading.toggleAvailability === item.id}
                      />
                    ))}
                    <TableRow>
                      <TableCell>
                        <ImageUploader
                          imageUrl={undefined}
                          onUpload={() => {}}
                          onDelete={() => {}}
                          isLoading={false}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          placeholder="Item name"
                          value={newItemData[category.id]?.name || ""}
                          onChange={(e) => updateNewItemData(category.id, 'name', e.target.value)}
                          className="border-none p-0"
                        />
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Input
                          placeholder="Description"
                          value={newItemData[category.id]?.description || ""}
                          onChange={(e) => updateNewItemData(category.id, 'description', e.target.value)}
                          className="border-none p-0"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          placeholder="Price"
                          value={newItemData[category.id]?.price || ""}
                          onChange={(e) => updateNewItemData(category.id, 'price', e.target.value)}
                          className="border-none p-0 w-20"
                        />
                      </TableCell>
                      <TableCell className="hidden xs:table-cell">
                        <input
                          type="checkbox"
                          checked={newItemData[category.id]?.isAvailable !== false}
                          onChange={(e) => updateNewItemData(category.id, 'isAvailable', e.target.checked)}
                          className="h-4 w-4"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          onClick={() => handleAddMenuItem(category.id)}
                          disabled={actionLoading.addMenuItem === category.id}
                          size="icon"
                        >
                          {actionLoading.addMenuItem === category.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Plus className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}