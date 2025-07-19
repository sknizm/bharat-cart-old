'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ImageBucket } from '@/components/ui/image-bucket';
import { useStore } from '@/app/[slug]/store-context';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

type Category = {
  id: string;
  name: string;
};

type VariantOption = {
  id?: string;
  value: string;
  sku: string;
  price: string;
  salePrice: string;
  stock: string;
};

type VariantGroup = {
  id?: string;
  name: string;
  options: VariantOption[];
};

type OpenSections = {
  basicInfo: boolean;
  pricing: boolean;
  media: boolean;
  categories: boolean;
  variants: boolean;
};

type ProductData = {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice: number;
  images: string[];
  categories: Category[];
  variants: {
    id: string;
    type: string;
    value: string;
    sku: string;
    price: number;
    salePrice: number;
    stock: number;
  }[];
};

export default function ProductFormPage() {
  const router = useRouter();
  const params = useParams();
  const store = useStore();
  const slug = store.slug;
  const productId = params?.id as string | undefined;
  const isEditing = !!productId;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [variants, setVariants] = useState<VariantGroup[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [openSections, setOpenSections] = useState<OpenSections>({
    basicInfo: true,
    pricing: true,
    media: true,
    categories: true,
    variants: true,
  });
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsFetching(true);
        
        // Fetch categories
        const categoriesRes = await fetch(`/api/store/${slug}/categories`);
        if (!categoriesRes.ok) throw new Error('Failed to fetch categories');
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData);

        // If editing, fetch product data
        if (isEditing) {
          const productRes = await fetch(`/api/store/${slug}/products/${productId}`);
          if (!productRes.ok) throw new Error('Failed to fetch product');
          const productData: ProductData = await productRes.json();

          setName(productData.name);
          setDescription(productData.description || '');
          setPrice(productData.price.toString());
          setSalePrice(productData.salePrice.toString());
          setImages(productData.images || []);
          setSelectedCategories(productData.categories.map(c => c.id));

          // Transform variants data into groups
          const variantGroups: Record<string, VariantOption[]> = {};
          productData.variants.forEach(variant => {
            if (!variantGroups[variant.type]) {
              variantGroups[variant.type] = [];
            }
            variantGroups[variant.type].push({
              id: variant.id,
              value: variant.value,
              sku: variant.sku,
              price: variant.price.toString(),
              salePrice: variant.salePrice.toString(),
              stock: variant.stock.toString(),
            });
          });

          const transformedVariants = Object.entries(variantGroups).map(([name, options]) => ({
            name,
            options,
          }));

          setVariants(transformedVariants);
        }
      } catch (error) {
        toast.error(`Failed to load ${isEditing ? 'product data' : 'categories'}`);
        console.error(error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchData();
  }, [slug, productId, isEditing]);

  const handleAddImage = (url: string) => {
    setImages(prev => [...prev, url]);
  };

  const handleRemoveImage = (url: string) => {
    setImages(prev => prev.filter(i => i !== url));
  };

  const toggleCategory = (id: string) => {
    setSelectedCategories(prev =>
      prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
    );
  };

  const addVariantGroup = () => {
    setVariants(prev => [...prev, { name: '', options: [{ value: '', sku: '', price: '', salePrice: '', stock: '' }] }]);
  };

  const removeVariantGroup = (index: number) => {
    setVariants(prev => prev.filter((_, i) => i !== index));
  };

  const updateVariantGroupName = (index: number, name: string) => {
    const updated = [...variants];
    updated[index].name = name;
    setVariants(updated);
  };

  const addVariantOption = (groupIndex: number) => {
    const updated = [...variants];
    updated[groupIndex].options.push({
      value: '',
      sku: '',
      price: '',
      salePrice: '',
      stock: '',
    });
    setVariants(updated);
  };

  const updateVariantOption = (
    groupIndex: number,
    optionIndex: number,
    field: keyof VariantOption,
    value: string
  ) => {
    const updated = [...variants];
    updated[groupIndex].options[optionIndex][field] = value;
    setVariants(updated);
  };

  const removeVariantOption = (groupIndex: number, optionIndex: number) => {
    const updated = [...variants];
    updated[groupIndex].options = updated[groupIndex].options.filter((_, i) => i !== optionIndex);
    setVariants(updated);
  };

  const toggleSection = (section: keyof OpenSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error('Category name cannot be empty');
      return;
    }

    try {
      setIsCreatingCategory(true);
      const response = await fetch(`/api/store/${slug}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategoryName.trim() }),
      });

      if (!response.ok) throw new Error('Failed to create category');

      const data = await response.json();
      setCategories(prev => [...prev, data]);
      setSelectedCategories(prev => [...prev, data.id]);
      setNewCategoryName('');
      toast.success('Category created successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to create category');
    } finally {
      setIsCreatingCategory(false);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const variantObjects = variants.flatMap(group =>
        group.options.map(option => ({
          id: option.id, // Include ID for updates
          name: group.name,
          value: option.value,
          sku: option.sku,
          price: parseFloat(option.price) || 0,
          salePrice: parseFloat(option.salePrice) || 0,
          stock: parseInt(option.stock) || 0,
        }))
      );

      const body = {
        name,
        description,
        price: parseFloat(price) || 0,
        salePrice: parseFloat(salePrice) || 0,
        images,
        categoryIds: selectedCategories,
        variants: variantObjects,
      };

      const url = `/api/store/${slug}/products${isEditing ? `/${productId}` : ''}`;
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${isEditing ? 'update' : 'create'} product`);
      }

      const data = await response.json();
      toast.success(`Product ${isEditing ? 'updated' : 'created'} successfully`);
      router.push(`/${slug}/products/${isEditing ? productId : data.id}`);
    } catch (error) {
      console.error(error);
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} product`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching && isEditing) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6 flex justify-center items-center h-64">
        <p>Loading product data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      <h1 className="text-2xl font-bold">{isEditing ? 'Edit' : 'Create'} Product</h1>

      <Card>
        <Collapsible open={openSections.basicInfo} onOpenChange={() => toggleSection('basicInfo')}>
          <CardHeader className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Basic Information</CardTitle>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-9 p-0">
                  {openSections.basicInfo ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                  <span className="sr-only">Toggle</span>
                </Button>
              </CollapsibleTrigger>
            </div>
          </CardHeader>
          <CollapsibleContent>
            <CardContent className="p-4 md:p-6 pt-0 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Enter product description"
                  rows={4}
                />
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      <Card>
        <Collapsible open={openSections.pricing} onOpenChange={() => toggleSection('pricing')}>
          <CardHeader className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Pricing</CardTitle>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-9 p-0">
                  {openSections.pricing ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                  <span className="sr-only">Toggle</span>
                </Button>
              </CollapsibleTrigger>
            </div>
          </CardHeader>
          <CollapsibleContent>
            <CardContent className="p-4 md:p-6 pt-0 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salePrice">Sale Price</Label>
                  <Input
                    id="salePrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={salePrice}
                    onChange={e => setSalePrice(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      <Card>
        <Collapsible open={openSections.media} onOpenChange={() => toggleSection('media')}>
          <CardHeader className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Media</CardTitle>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-9 p-0">
                  {openSections.media ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                  <span className="sr-only">Toggle</span>
                </Button>
              </CollapsibleTrigger>
            </div>
          </CardHeader>
          <CollapsibleContent>
            <CardContent className="p-4 md:p-6 pt-0 space-y-4">
              <div className="space-y-2">
                <Label>Product Images</Label>
                {images.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {images.map((url, i) => (
                      <div key={i} className="relative group aspect-square">
                        <Image
                          src={url}
                          alt="Product image"
                          className="w-full h-full object-cover rounded-lg"
                          width={150}
                          height={150}
                        />
                        <button
                          onClick={() => handleRemoveImage(url)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <p className="text-sm text-muted-foreground">
                      No images uploaded yet
                    </p>
                  </div>
                )}
                <div className="pt-2">
                  <ImageBucket slug={slug} onSelect={handleAddImage} />
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      <Card>
        <Collapsible open={openSections.categories} onOpenChange={() => toggleSection('categories')}>
          <CardHeader className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Categories</CardTitle>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-9 p-0">
                  {openSections.categories ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                  <span className="sr-only">Toggle</span>
                </Button>
              </CollapsibleTrigger>
            </div>
          </CardHeader>
          <CollapsibleContent>
            <CardContent className="p-4 md:p-6 pt-0 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Select Categories</Label>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Category
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Category</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="categoryName">Category Name</Label>
                          <Input
                            id="categoryName"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            placeholder="Enter category name"
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <DialogTrigger asChild>
                            <Button variant="outline">Cancel</Button>
                          </DialogTrigger>
                          <Button
                            onClick={handleCreateCategory}
                            disabled={isCreatingCategory || !newCategoryName.trim()}
                          >
                            {isCreatingCategory ? 'Creating...' : 'Create Category'}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                {categories.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                      <Badge
                        key={cat.id}
                        variant={selectedCategories.includes(cat.id) ? 'default' : 'outline'}
                        className="cursor-pointer hover:bg-primary/80 transition-colors"
                        onClick={() => toggleCategory(cat.id)}
                      >
                        {cat.name}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No categories available. Create some first.
                  </p>
                )}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      <Card>
        <Collapsible open={openSections.variants} onOpenChange={() => toggleSection('variants')}>
          <CardHeader className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Variants</CardTitle>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-9 p-0">
                  {openSections.variants ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                  <span className="sr-only">Toggle</span>
                </Button>
              </CollapsibleTrigger>
            </div>
          </CardHeader>
          <CollapsibleContent>
            <CardContent className="p-4 md:p-6 pt-0 space-y-4">
              <div className="space-y-4">
                {variants.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      No variants added yet
                    </p>
                  </div>
                )}

                {variants.map((group, groupIndex) => (
                  <div key={groupIndex} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <Input
                        className="flex-1"
                        placeholder="Variant Type (e.g., Size, Color)"
                        value={group.name}
                        onChange={e => updateVariantGroupName(groupIndex, e.target.value)}
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeVariantGroup(groupIndex)}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {group.options.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className="grid grid-cols-1 sm:grid-cols-6 gap-2 items-end"
                        >
                          <div className="sm:col-span-1">
                            <Input
                              placeholder="Value"
                              value={option.value}
                              onChange={e =>
                                updateVariantOption(groupIndex, optionIndex, 'value', e.target.value)
                              }
                            />
                          </div>
                          <div className="sm:col-span-1">
                            <Input
                              placeholder="SKU"
                              value={option.sku}
                              onChange={e =>
                                updateVariantOption(groupIndex, optionIndex, 'sku', e.target.value)
                              }
                            />
                          </div>
                          <div className="sm:col-span-1">
                            <Input
                              placeholder="Price"
                              type="number"
                              min="0"
                              step="0.01"
                              value={option.price}
                              onChange={e =>
                                updateVariantOption(groupIndex, optionIndex, 'price', e.target.value)
                              }
                            />
                          </div>
                          <div className="sm:col-span-1">
                            <Input
                              placeholder="Sale Price"
                              type="number"
                              min="0"
                              step="0.01"
                              value={option.salePrice}
                              onChange={e =>
                                updateVariantOption(
                                  groupIndex,
                                  optionIndex,
                                  'salePrice',
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div className="sm:col-span-1">
                            <Input
                              placeholder="Stock"
                              type="number"
                              min="0"
                              value={option.stock}
                              onChange={e =>
                                updateVariantOption(groupIndex, optionIndex, 'stock', e.target.value)
                              }
                            />
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeVariantOption(groupIndex, optionIndex)}
                          >
                            <Trash className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addVariantOption(groupIndex)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Option
                    </Button>
                  </div>
                ))}

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={addVariantGroup}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Variant Group
                </Button>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update' : 'Create')} Product
        </Button>
      </div>
    </div>
  );
}