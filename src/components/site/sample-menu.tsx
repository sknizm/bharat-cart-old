import Image from "next/image"
import Link from "next/link"

const businessTypes = [
  {
    label: "Restaurants & Cafés",
    image: "/demo/restaurant.png",
    description: "Beautiful menus for dine-in and takeaway",
    bgColor: "bg-blue-50"
  },
  {
    label: "Cloud Kitchens",
    image: "/demo/kitchen.png",
    description: "Streamlined delivery-focused menus",
    bgColor: "bg-indigo-50"
  },
  {
    label: "Hotels & Resorts",
    image: "/demo/hotel.png",
    description: "In-room dining and amenity menus",
    bgColor: "bg-blue-50"
  },
  {
    label: "Bars & Pubs",
    image: "/demo/bar.png",
    description: "Interactive drink menus with photos",
    bgColor: "bg-indigo-50"
  },
]

export default function SampleMenu() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            View Our{' '}
            <span className="relative inline-block">
              <span className="relative z-10">Sample Menus</span>
              <span className="absolute bottom-1 left-0 w-full h-3 bg-blue-100 opacity-70 -z-0"></span>
            </span>
          </h2>
          <p className="text-lg text-blue-600 max-w-2xl mx-auto">
            Select what best describes your business to see relevant examples
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {businessTypes.map((business, index) => (
            <div 
              key={index}
              className={`group ${business.bgColor} p-6 rounded-xl border border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-md transition-all text-center`}
            >
              <div className="relative w-20 h-20 mx-auto mb-4">
                <Image 
                  src={business.image} 
                  alt={business.label} 
                  fill
                  className="object-contain transition-transform group-hover:scale-105"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {business.label}
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {business.description}
              </p>
              <Link 
                href="#" 
                className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors inline-flex items-center"
              >
                View Sample <span className="ml-1">→</span>
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link 
            href="/pricing" 
            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-md transition-all transform hover:-translate-y-0.5"
          >
            Create Your Custom Menu
          </Link>
          <p className="mt-4 text-gray-500 text-sm">
            Need help deciding?{' '}
            <Link href="/contact" className="text-blue-600 hover:underline">Contact our specialists</Link>
          </p>
        </div>
      </div>
    </section>
  )
}