import { Clock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function MembershipInactive() {
  return (
    <div className="max-w-2xl mx-auto py-20 px-4 text-center">
      <div className="mx-auto w-24 h-24 rounded-full bg-amber-100 flex items-center justify-center mb-6">
        <Clock className="h-10 w-10 text-amber-600" />
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Membership Inactive
      </h1>
      
      <p className="text-gray-600 text-lg mb-6">
        Your restaurant's membership has expired. Renew now to continue serving your customers.
      </p>
      
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8 max-w-md mx-auto">
        <h3 className="font-medium text-amber-800 mb-3 flex items-center justify-center gap-2">
          <Zap className="h-5 w-5" />
          Premium Features Unlocked
        </h3>
        <ul className="space-y-2 text-sm text-amber-700">
          <li className="flex items-center gap-2">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Unlimited menu items
          </li>
          <li className="flex items-center gap-2">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Priority customer support
          </li>
          <li className="flex items-center gap-2">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Advanced analytics
          </li>
        </ul>
      </div>
      
      <div className="space-y-4 max-w-md mx-auto">
        <Link href="/dashboard/membership">
          <Button className="w-full py-6 text-lg gap-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700">
            Renew Membership
          </Button>
        </Link>
        
        <p className="text-gray-500 text-sm">
          Need help?{' '}
          <Link href="/support" className="text-blue-600 hover:underline">
            Contact support
          </Link>
        </p>
      </div>
    </div>
  );
}