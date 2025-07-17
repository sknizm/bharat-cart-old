import Link from 'next/link'

export default function CTA() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to transform your restaurant's menu?</h2>
        <p className="text-xl text-blue-100 mb-8">Join thousands of restaurants serving beautiful digital menus with MenuLink.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/signup" 
            className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:bg-gray-100 transition-all transform hover:-translate-y-1"
          >
            Get Started - Free 14-Day Trial
          </Link>
          <Link 
            href="/demo" 
            className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-all"
          >
            Book a Demo
          </Link>
        </div>
      </div>
    </section>
  )
}