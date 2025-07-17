import Link from 'next/link'

export default function EmpowerBusiness() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-blue-50/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              Transform Your Business
            </span>{' '}
            with MenuLink
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your beautiful digital menu powers your brand's ordering any way you want
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md border border-blue-100 w-full max-w-xs text-center transition-all hover:shadow-lg hover:border-blue-200">
            <div className="text-gray-500 text-sm mb-1">Your MenuLink URL</div>
            <div className="text-xl font-semibold text-gray-600">
              menulink.in/<span className="text-blue-600">yourbrand</span>
            </div>
          </div>
          
          {/* <div className="text-gray-400 font-medium hidden md:block">OR</div>
          <div className="text-gray-400 font-medium md:hidden text-sm my-2">— or connect your own domain —</div>
          
          <div className="bg-white p-6 rounded-xl shadow-md border border-blue-100 w-full max-w-xs text-center transition-all hover:shadow-lg hover:border-blue-200">
            <div className="text-gray-500 text-sm mb-1">Custom Domain</div>
            <div className="text-xl font-semibold text-blue-600">
              <span className="text-indigo-600">yourbrand</span>.com
            </div>
          </div> */}
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            {
              icon: '🍽️',
              title: 'Table Ordering',
              description: 'Customers order directly from their table with QR codes',
              color: 'bg-blue-100'
            },
            {
              icon: '🏨',
              title: 'Room Service',
              description: 'Guests order from their hotel room with ease',
              color: 'bg-indigo-100'
            },
            {
              icon: '🚀',
              title: 'Takeaway Orders',
              description: 'Boost pickup sales with advance online ordering',
              color: 'bg-blue-100'
            }
          ].map((feature, index) => (
            <div 
              key={index} 
              className={`bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all ${feature.color}`}
            >
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link 
            href="/demo" 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700"
          >
            See How It Works
          </Link>
        </div>
      </div>
    </section>
  )
}