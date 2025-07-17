'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react'

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  const faqs = [
    {
      question: "How long does it take to set up my digital menu?",
      answer: "Most restaurants can set up their MenuLink in under 90 seconds. Our intuitive editor makes it easy to add your menu items, prices, and images. If you need help, our team can have you set up in minutes."
    },
    {
      question: "Do customers need to download an app?",
      answer: "No! MenuLink is 100% web-based. Customers simply scan your QR code or visit your menu link in their mobile browser - no app download required."
    },
    {
      question: "Can I use my own domain name?",
      answer: "Yes! You can use your existing domain (like menu.yourrestaurant.com) or we provide a free MenuLink subdomain. Setting up a custom domain takes just a few minutes."
    },
    {
      question: "How do I update my menu?",
      answer: "You can update your menu anytime in real-time through our dashboard. Changes appear immediately - no waiting or extra costs like with printed menus."
    },
    {
      question: "What payment methods do you support?",
      answer: "MenuLink integrates with all major payment processors including Stripe, PayPal, and Square. You can also accept cash payments for in-person orders."
    }
  ]

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-blue-50/50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Asked Questions</span>
          </h2>
          <p className="text-lg text-gray-600">
            Everything you need to know about MenuLink
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center p-6 text-left bg-white hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
                {activeIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-blue-600" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </button>
              {activeIndex === index && (
                <div className="p-6 bg-gray-50 text-gray-700">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 bg-blue-50 rounded-full px-6 py-3">
            <HelpCircle className="h-5 w-5 text-blue-600" />
            <span className="text-blue-600 font-medium">Still have questions?</span>
            <a href="#" className="text-blue-600 font-semibold hover:underline">Contact our team</a>
          </div>
        </div>
      </div>
    </section>
  )
}