'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Plus, ExternalLink, LayoutDashboard, Link as LinkIcon } from 'lucide-react'
import { Store } from '@/lib/types'


export default function StoreListPage() {
  const [stores, setStores] = useState<Store[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await fetch('/api/store/get-all')
        if (!res.ok) return router.push('/onboarding')

        const data = await res.json()
        if (!data.stores || data.stores.length === 0) {
          router.push('/onboarding')
        } else {
          setStores(data.stores)
        }
      } catch (error) {
        console.error('Failed to fetch stores:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStores()
  }, [router])

  if (isLoading) {
    return (
      <div className="p-6 max-w-3xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-10 w-[120px]" />
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-[180px]" />
                <Skeleton className="h-4 w-[220px]" />
              </CardHeader>
              <CardContent className="flex gap-3 pb-6">
                <Skeleton className="h-10 w-[120px]" />
                <Skeleton className="h-10 w-[150px]" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!stores) return <div className="p-6">No stores found</div>

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Your Stores</h1>
          <p className="text-sm text-muted-foreground">
            Manage your stores and access their dashboards
          </p>
        </div>
        <Button 
          onClick={() => router.push('/onboarding')}
          className="w-full md:w-auto"
          variant="default"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Store
        </Button>
      </div>

      <div className="grid gap-4">
        {stores.map((store) => {
          const domain = store.domain || `${process.env.NEXT_PUBLIC_DOMAIN}/${store.slug}`
          const dashboardUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/${store.slug}/dashboard`
          
          return (
            <Card key={store.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{store.name}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <LinkIcon className="h-4 w-4" />
                  {domain}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => window.open(`https://${domain}`, '_blank')}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Visit Store
                  </Button>
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => router.push(`https://${dashboardUrl}`)}
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}