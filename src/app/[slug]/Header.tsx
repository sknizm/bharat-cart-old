"use client"
import Link from 'next/link'
import React from 'react'

import Image from "next/image";
import { useStore } from './store-context'
import { Button } from '@/components/ui/button';


const Header = () => {
    const store = useStore();
  return (
     <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b p-4">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
              <Link href={`/${store.slug}`} className="flex items-center">
                {store.logo && (
                  <Image 
                    src={store.logo} 
                    alt="Logo" 
                    width={120} 
                    height={40} 
                    className="object-contain h-10 w-auto"
                    priority
                  />
                )}
                {!store.logo && (
                  <h1 className="text-xl font-bold">{store.name}</h1>
                )}
              </Link>
              <div className="flex gap-2">
                <Link href={`/${store.slug}/search`}>
                  <Button variant="ghost" size="icon">
                    <SearchIcon className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href={`/${store.slug}/cart`}>
                  <Button>
                    <ShoppingCartIcon className="h-5 w-5 mr-2" />
                    <span className="hidden sm:inline">Cart</span>
                  </Button>
                </Link>
              </div>
            </div>
          </header>
  )
}

// Simple icon components (replace with actual icons from your library)
function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function ShoppingCartIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
}
export default Header