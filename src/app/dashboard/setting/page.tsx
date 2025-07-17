"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function RestaurantSettingsPage() {
  const [restaurant, setRestaurant] = useState({
    name: "",
    slug: "",
    address: "",
    whatsapp: "",
    phone: "",
    instagram: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [slugStatus, setSlugStatus] = useState<{
    available?: boolean;
    message?: string;
  }>({});

  useEffect(() => {
    fetchRestaurantData();
  }, []);

  const fetchRestaurantData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/restaurant/settings');
      if (!response.ok) throw new Error('Failed to fetch restaurant data');
      const data = await response.json();
      setRestaurant(data);
    } catch (error) {
      toast.error("Failed to load restaurant data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const checkSlugAvailability = async () => {
    if (!restaurant.slug) return;
    
    try {
      const response = await fetch('/api/restaurant/validate-slug', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug: restaurant.slug })
      });

      if (!response.ok) throw new Error('Validation failed');
      
      const data = await response.json();
      setSlugStatus(data);
    } catch (error) {
      console.error("Error validating slug:", error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (restaurant.slug) {
        checkSlugAvailability();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [restaurant.slug]);

  const handleSave = async () => {
    if (slugStatus.available === false) {
      toast.error("Please choose an available URL slug");
      return;
    }

    try {
      setSaving(true);
      const response = await fetch('/api/restaurant/settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(restaurant)
      });

      if (!response.ok) throw new Error('Failed to save changes');
      
      toast.success("Changes saved successfully");
    } catch (error) {
      toast.error("Failed to save changes");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setRestaurant(prev => ({
      ...prev,
      [field]: value
    }));

    // Reset slug status when changing the slug
    if (field === 'slug') {
      setSlugStatus({});
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Restaurant Settings</h2>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save Changes
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Restaurant Name</Label>
            <Input 
              placeholder="e.g. Foodie Bites" 
              value={restaurant.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Custom Menu Link</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">menulink.in/</span>
              <Input 
                placeholder="your-restaurant-name" 
                value={restaurant.slug}
                onChange={(e) => handleChange('slug', e.target.value)}
              />
            </div>
            {slugStatus.message && (
              <p className={`text-sm ${
                slugStatus.available ? 'text-green-600' : 'text-red-600'
              }`}>
                {slugStatus.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Address</Label>
            <Input 
              placeholder="e.g. 123 Main Street, City" 
              value={restaurant.address}
              onChange={(e) => handleChange('address', e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label>WhatsApp Number</Label>
            <Input 
              placeholder="e.g. +91 9876543210" 
              value={restaurant.whatsapp}
              onChange={(e) => handleChange('whatsapp', e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Customers will contact you on this number
            </p>
          </div>

          <div className="space-y-2">
            <Label>Phone Number</Label>
            <Input 
              placeholder="e.g. +91 9876543210" 
              value={restaurant.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Instagram Handle</Label>
            <Input 
              placeholder="e.g. @yourrestaurant" 
              value={restaurant.instagram}
              onChange={(e) => handleChange('instagram', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}