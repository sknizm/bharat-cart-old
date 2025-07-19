export type Store = {
  id: string;
  name: string;
  slug: string;
  domain: string | null;
  logo: string | null;
  // Add any other fields you need
};

export type VariantInput = {
  name: string;
  value: string;
  sku: string;
  price: number;
  salePrice: number;
  stock: number;
};



export type Product = {
  id: string;
  name: string;
  price: number;
  salePrice: number;
  images: string[];
  categories: {
    id: string;
    name: string;
  }[];
  variants: {
    id: string;
    type: string;
    value: string;
    price: number;
    salePrice: number;
    stock: number;
  }[];
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
  