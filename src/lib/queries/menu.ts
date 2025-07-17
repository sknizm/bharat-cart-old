import { Category, MenuItem } from "../types";

export const fetchMenuData = async (): Promise<Category[]> => {
  const response = await fetch('/api/menu');
  if (!response.ok) throw new Error('Failed to fetch menu');
  return response.json();
};

export const addCategory = async (name: string): Promise<Category> => {
  const response = await fetch('/api/menu/categories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
  });
  if (!response.ok) throw new Error('Failed to add category');
  return response.json();
};

export const deleteCategory = async (id: string): Promise<void> => {
  const response = await fetch(`/api/menu/categories/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Failed to delete category');
};

export const addMenuItem = async (data: Omit<MenuItem, 'id'>): Promise<MenuItem> => {
  const response = await fetch('/api/menu/items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to add menu item');
  return response.json();
};

export const deleteMenuItem = async (id: string): Promise<void> => {
  const response = await fetch(`/api/menu/items/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Failed to delete menu item');
};

export const toggleAvailability = async (id: string, isAvailable: boolean): Promise<void> => {
  const response = await fetch(`/api/menu/items/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isAvailable })
  });
  if (!response.ok) throw new Error('Failed to update availability');
};

export const uploadImage = async (itemId: string, file: File): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("itemId", itemId);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  });
  if (!response.ok) throw new Error('Upload failed');
  return response.json();
};

export const deleteImage = async (itemId: string, imageUrl: string): Promise<void> => {
  const response = await fetch('/api/upload', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ itemId, imageUrl })
  });
  if (!response.ok) throw new Error('Delete failed');
};