"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import logo from '@/components/media/logo.png';
import Link from "next/link";
import { getUserIdFromSession } from "@/lib/queries/user";
import { toast } from "sonner";

const OnboardingPage = () => {
  const router = useRouter();
  const [storeName, setStoreName] = useState("");
  const [slug, setSlug] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      if (!storeName || !slug) {
        throw new Error("Store name and slug are required");
      }

      const currentUserId = await getUserIdFromSession();
      const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-');

      const response = await fetch("/api/store/create-store", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: storeName,
          slug: cleanSlug,
          userId: currentUserId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 409) {
          throw new Error("Store URL is taken. Please choose a another one.");
        }
        throw new Error(errorData.error || "Failed to create store");
      }

      toast.success("Store Created Successfully");
      router.push(`/store-list`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message || "Failed to create store");
        console.error("Store creation error:", error);
      } else {
        setErrorMessage("Failed to create store");
        console.error("Unknown error during store creation:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-4">
      <Card className="w-full max-w-md shadow-lg rounded-xl overflow-hidden border border-green-200">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <Image 
              src={logo} 
              height={80} 
              width={80}
              alt="Store logo"
              className="rounded-full border-2 border-green-200 p-1 bg-white"
            />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold text-green-800">Create Your Store</CardTitle>
            <CardDescription className="text-gray-600">
              Get started in just a few simple steps
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <label htmlFor="storeName" className="block text-sm font-medium text-gray-700">
                Store Name
              </label>
              <Input
                id="storeName"
                placeholder="My Awesome Store"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>

            <div className="space-y-3">
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                Store URL
              </label>
              <div className="flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-600 text-sm">
                  {process.env.NEXT_PUBLIC_DOMAIN || "yourdomain.com"}/
                </span>
                <Input
                  id="slug"
                  type="text"
                  placeholder="store-name"
                  value={slug}
                  onChange={(e) => {
                    const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-');
                    setSlug(value);
                  }}
                  required
                  pattern="[a-z0-9-]+"
                  title="Only lowercase letters, numbers, and hyphens are allowed"
                  className="flex-1 min-w-0 block w-full rounded-none rounded-r-md focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Only lowercase letters, numbers, and hyphens. You can add a custom domain later.
              </p>
            </div>

            <Button 
              disabled={isLoading} 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700 mt-2 h-11"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Your Store...
                </>
              ) : (
                <>
                  <span className="font-semibold">Launch My Store</span>
                </>
              )}
            </Button>

            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errorMessage}
              </div>
            )}
          </form>
        </CardContent>

        <CardFooter className="flex justify-center border-t border-green-100 pt-4">
          <p className="text-sm text-gray-600">
            Already have a store?{" "}
            <Link href="/store-list" className="font-medium text-green-600 hover:text-green-700 hover:underline">
              Store List
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OnboardingPage;