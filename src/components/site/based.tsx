import Image from "next/image"

const features = [
  {
    title: "QR Code Ordering",
    description: "Ditch paper menus. Customers scan to access your beautiful digital menu instantly.",
    image: "/demo/qr.png",
    iconColor: "text-blue-500"
  },
  {
    title: "Direct Online Orders",
    description: "Avoid high commissions. Use your own delivery staff and keep customer data.",
    image: "/demo/delivery.png",
    iconColor: "text-indigo-500"
  },
  {
    title: "Advance Pickups",
    description: "Increase takeaway sales with scheduled ordering and payment.",
    image: "/demo/takeaway.png",
    iconColor: "text-blue-500"
  }
]

export default function WebBasedFeatures() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              100% Web-Based Solution
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            No app downloads required - works perfectly on any smartphone
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <div
              key={i}
              className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all text-center"
            >
              <div className={`mx-auto mb-6 ${feature.iconColor}`}>
                <Image
                  src={feature.image}
                  alt={feature.title}
                  width={80}
                  height={80}
                  className="mx-auto"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-blue-50 rounded-xl p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Plus many more powerful features:</h3>
          <div className="flex flex-wrap justify-center gap-4 max-w-2xl mx-auto">
            {['Real-time Updates', 'Menu Analytics', 'Multi-language Support', 'Dietary Filters', 'Photo Galleries', 'Promotions Engine'].map((item, i) => (
              <span key={i} className="bg-white px-4 py-2 rounded-full text-sm font-medium shadow-sm border border-gray-200">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}