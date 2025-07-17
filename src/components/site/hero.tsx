import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Play } from 'lucide-react'
import mobile from '@/components/media/mobile.png'

export default function Hero() {
  return (
    <section className="w-full bg-gradient-to-b from-blue-50/50 via-white to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24 lg:py-32 flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Content */}
        <div className="max-w-2xl space-y-6 text-center lg:text-left">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
            <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              Beautiful digital menus
            </span>{' '}
            for your restaurant
          </h1>
          
          <p className="text-lg text-gray-600 max-w-lg">
            Create your stunning mobile menu with MenuLink in under 90 seconds.
            Perfect for restaurants, cafes, hotels, and more.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all"
            >
              Get Started →
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="border-blue-300 text-blue-600 hover:bg-blue-50 gap-2 hover:border-blue-400"
            >
              <Play className="h-4 w-4" />
              Watch Video
            </Button>
          </div>
          
          <div className="flex items-center justify-center lg:justify-start gap-3 text-sm text-blue-600 font-medium">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((item) => (
                <div 
                  key={item}
                  className="h-8 w-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center"
                >
                  <span className="text-xs font-bold">🍔</span>
                </div>
              ))}
            </div>
            <span>Trusted by 1500+ restaurants worldwide</span>
          </div>
        </div>
        
        {/* Image */}
        <div className="relative w-full max-w-lg aspect-square">
          <Image
            src={mobile}
            alt="MenuLink Digital Menu Preview"
            fill
            className="object-contain drop-shadow-2xl"
            priority
          />
        </div>
      </div>
    </section>
  )
}