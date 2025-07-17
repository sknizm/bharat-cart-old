export type Store = {
  id: string;
  name: string;
  slug: string;
  domain: string | null;
  logo: string | null;
  // Add any other fields you need
};

  export interface MenuItem {
    id: string;
    name: string;
    description?: string;
    price: number;
    image?: string;
    isAvailable: boolean;
  }
  
  export type LoadingState = {
    addCategory: boolean;
    deleteCategory: string;
    addMenuItem: string;
    deleteMenuItem: string;
    toggleAvailability: string;
    uploadImage: string;
  };
  