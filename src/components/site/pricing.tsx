'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
interface PricingProps {
  isWhatsApp: boolean
}
export  function Pricing() {
  const [activeTab, setActiveTab] = useState<'monthly' | 'yearly'>('monthly')

  const plans = [
    {
      name: "Starter",
      monthlyPrice: "$29",
      yearlyPrice: "$24",
      description: "Perfect for small restaurants and cafes",
      features: [
        "1 Location",
        "Basic Menu Customization",
        "QR Code Ordering",
        "Email Support",
        "Up to 50 monthly orders"
      ],
      cta: "Start Free Trial"
    },
    {
      name: "Professional",
      monthlyPrice: "$79",
      yearlyPrice: "$63",
      description: "For growing restaurants with multiple locations",
      features: [
        "Up to 3 Locations",
        "Advanced Customization",
        "QR + Direct Link Ordering",
        "Priority Support",
        "Up to 500 monthly orders",
        "Basic Analytics"
      ],
      cta: "Start Free Trial",
      popular: true
    },
    {
      name: "Enterprise",
      monthlyPrice: "$199",
      yearlyPrice: "$159",
      description: "For hotels, chains & high-volume restaurants",
      features: [
        "Unlimited Locations",
        "White-label Branding",
        "All Ordering Methods",
        "24/7 Support",
        "Unlimited Orders",
        "Advanced Analytics",
        "API Access"
      ],
      cta: "Contact Sales"
    }
  ]

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Simple, <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Transparent Pricing</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            No hidden fees. Cancel anytime. Start with a 14-day free trial.
          </p>
          
          <div className="mt-6 inline-flex bg-blue-50 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('monthly')}
              className={`px-6 py-2 rounded-md text-sm font-medium ${activeTab === 'monthly' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setActiveTab('yearly')}
              className={`px-6 py-2 rounded-md text-sm font-medium ${activeTab === 'yearly' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'}`}
            >
              Yearly (Save 20%)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`relative p-8 rounded-xl border ${plan.popular ? 'border-blue-300 shadow-lg' : 'border-gray-200 shadow-sm'} hover:shadow-md transition-all`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                  MOST POPULAR
                </div>
              )}
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{plan.name}</h3>
              <p className="text-gray-600 mb-4">{plan.description}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">
                  {activeTab === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                </span>
                <span className="text-gray-600"> / month</span>
                {activeTab === 'yearly' && (
                  <span className="block text-sm text-gray-500">billed annually</span>
                )}
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-3 px-6 rounded-lg font-medium ${plan.popular ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'} transition-all`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Need custom solutions?</p>
          <button className="text-blue-600 font-medium hover:underline">
            Contact our sales team →
          </button>
        </div>
      </div>
    </section>
  )
}




export default function Pricing2({ isWhatsApp }: PricingProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'monthly' | 'yearly'>('monthly')

  const handleCtaClick = (planName: string) => {
    if (isWhatsApp) {
      const message = `Hi, I want to get the ${planName} plan. Please assist me.`
      const whatsappUrl = `https://wa.me/918455838503?text=${encodeURIComponent(message)}`
      window.open(whatsappUrl, '_blank')
    } else {
      router.push('/signup')
    }
  }

  const plans = [
    {
      name: "Monthly Plan",
      price: "₹49",
      description: "Transition from the traditional paper menus to QR code enabled beautiful mobile menu.",
      features: [
        "Unlimited menu items & photos",
        "Get Orders on WhatsApp",
        "Instagram account integration",
        "Free QR code",
        "Full access to all features",
      ],
      cta: "Get Started"
    },
    {
      name: "Yearly Plan",
      price: "₹490",
      originalPrice: "₹588",
      description: "Best value for long-term users",
      features: [
        "Everything in the Monthly Plan",
        "2 months free compared to monthly",
        "Priority support",
        "Annual billing",
        "Save 17%"
      ],
      cta: "Get Started",
      popular: true
    }
  ]

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Simple, <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">Transparent Pricing</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            No hidden fees. Free trial . Start right away.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`relative p-8 rounded-xl border ${plan.popular ? 'border-blue-300 shadow-lg' : 'border-gray-200 shadow-sm'} hover:shadow-md transition-all`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                  BEST VALUE
                </div>
              )}
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{plan.name}</h3>
              <p className="text-gray-600 mb-4">{plan.description}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">
                  {plan.price}
                </span>
                {plan.originalPrice && (
                  <>
                    <span className="ml-2 text-lg text-gray-500 line-through">{plan.originalPrice}</span>
                    <span className="ml-2 text-sm bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Save 17%</span>
                  </>
                )}
                <span className="block text-sm text-gray-500 mt-1">
                  {plan.name.includes('Yearly') ? 'per year' : 'per month'}
                </span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleCtaClick(plan.name)}
                className={`w-full py-3 px-6 rounded-lg font-medium ${plan.popular ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-indigo-700' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'} transition-all`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Not sure which plan is right for you?</p>
          <button 
            onClick={() => isWhatsApp 
              ? window.open(`https://wa.me/918455838503?text=${encodeURIComponent("Hi, I need help choosing a plan")}`, '_blank')
              : router.push('/contact')
            }
            className="text-blue-600 font-medium hover:underline"
          >
            Contact our team →
          </button>
        </div>
      </div>
    </section>
  )
}