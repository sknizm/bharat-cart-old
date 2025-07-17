"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, Link as LinkIcon, Eye, Copy, Sparkles, Globe, Smartphone, ArrowDown, PlusCircle, Utensils, ArrowLeft, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [slug, setSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestaurantSlug = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/restaurant/get-slug');
        
        if (!response.ok) {
          throw new Error('Failed to fetch restaurant data');
        }

        const data = await response.json();
        setSlug(data.slug);
      } catch (err) {
        console.error("Error fetching restaurant slug:", err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantSlug();
  }, []);

  const menuLink = slug ? `${process.env.NEXT_PUBLIC_DOMAIN}/${slug}` : '';
  
  const copyToClipboard = () => {
    if (menuLink) {
      navigator.clipboard.writeText(menuLink);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-auto">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <div className="text-red-500">{error}</div>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  if (!slug) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <div>No restaurant found</div>
        <Button onClick={() => router.push('/create-restaurant')}>
          Create Your Restaurant
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Your Menu Link</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Input
                value={menuLink}
                readOnly
                className="flex-1"
              />
              <Button 
                onClick={copyToClipboard} 
                size="icon" 
                variant="outline"
                disabled={!menuLink}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <a href={menuLink} target="_blank" rel="noopener noreferrer">
                <Button size="icon" variant="outline" disabled={!menuLink}>
                  <Eye className="h-4 w-4" />
                </Button>
              </a>
            </div>
            <div className="text-sm text-muted-foreground">
              Share this link with your customers
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Create Your Digital Menu</CardTitle>
                <CardDescription className="mt-1">
                  Add all your menus
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <Button 
                onClick={() => router.push('/dashboard/menu')} 
                className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all"
              >
                Create Menus
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Edit your Restaurant Details</CardTitle>
                <CardDescription className="mt-1">
                  Add details
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <Button 
                onClick={() => router.push('/dashboard/setting')} 
                className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all"
              >
                Edit Restaurant Details
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}