import { getStoreBySlug } from "@/lib/queries/store";
import { getStoreCategoriesWithProducts } from "@/lib/queries/category";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/store/product-card";
import Header from "./Header";

export default async function StoreHome({ params }: { params: { slug: string } }) {
  const store = await getStoreBySlug(params.slug);
  const categories = await getStoreCategoriesWithProducts(store?.id);

  if (!store) return <div className="p-4 text-center">Store not found</div>;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <Header/>

      {/* Banner */}
      {store.banner && (
        <div className="w-full aspect-[3/1] relative bg-gray-100">
          <Image 
            src={store.banner} 
            alt="Banner" 
            fill 
            className="object-cover" 
            priority
            sizes="100vw"
          />
        </div>
      )}

      {/* Category Sections */}
      <div className="p-4 md:p-6 space-y-8">
        {categories.map((category) => (
          <section key={category.id} className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                {category.name}
              </h2>
              {category.products.length > 4 && (
                <Link 
                  href={`/${store.slug}/category/${category}`}
                  className="text-sm text-primary hover:underline"
                >
                  View all
                </Link>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {category.products.slice(0, 5).map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  storeSlug={params.slug} 
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Footer */}
      <footer className="border-t p-4 mt-8 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} {store.name}. All rights reserved.</p>
      </footer>
    </div>
  );
}
