'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Lock, ChevronDown, User } from 'lucide-react'
import { useState } from 'react'
import Image from 'next/image'
import logo from '@/components/media/logo.png' 

export default function Header({ isLoggedIn = false }) {
  const [isResourcesOpen, setIsResourcesOpen] = useState(false)

  return (
    <header className="w-full px-4 sm:px-6 py-3 bg-white/95 backdrop-blur-md border-b border-blue-50 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo and Navigation */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            {/* <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              MenuLink
            </span> */}
            <Image src={logo} width={120} alt={''}/>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#" className="text-gray-700 hover:text-blue-600 transition-colors text-sm font-medium hover:bg-blue-50 px-3 py-2 rounded-lg">
              Home
            </Link>
            <Link href="#" className="text-gray-700 hover:text-blue-600 transition-colors text-sm font-medium hover:bg-blue-50 px-3 py-2 rounded-lg">
              Pricing
            </Link>
            <Link href="#" className="text-gray-700 hover:text-blue-600 transition-colors text-sm font-medium hover:bg-blue-50 px-3 py-2 rounded-lg">
              Sample Menu
            </Link>
            
            <div className="relative">
              <button 
                onClick={() => setIsResourcesOpen(!isResourcesOpen)}
                className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition-colors text-sm font-medium hover:bg-blue-50 px-3 py-2 rounded-lg"
              >
                Resources
                <ChevronDown className={`h-4 w-4 transition-transform ${isResourcesOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isResourcesOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-xl py-2 border border-blue-100 z-10">
                  <Link href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                    Blog
                  </Link>
                  <Link href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                    Guides
                  </Link>
                  <Link href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                    Case Studies
                  </Link>
                </div>
              )}
            </div>
            
            <Link href="#" className="text-gray-700 hover:text-blue-600 transition-colors text-sm font-medium hover:bg-blue-50 px-3 py-2 rounded-lg">
              Contact
            </Link>
          </nav>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <Link 
              href="/dashboard" 
              className="flex items-center gap-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-4 py-2 rounded-lg shadow-sm transition-all"
            >
              <User className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          ) : (
            <>
              <Link 
                href="/signin" 
                className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <Lock className="h-4 w-4" />
                <span>Sign In</span>
              </Link>
              
              <Button 
                asChild
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all"
              >
                <Link href="/signup">
                  <span>Get Started</span>
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}