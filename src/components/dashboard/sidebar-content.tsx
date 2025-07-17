// components/dashboard/sidebar-content.tsx
'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Utensils, Store,  } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import LogoutButton from "../ui/logout";

interface MenuItem {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  subItems?: never; // Marking as never since we don't need subItems in this component
}

const menuItems: MenuItem[] = [
  {
    href: "/dashboard/home",
    icon: Home,
    label: "Dashboard",
  },
  {
    href: "/dashboard/menu",
    icon: Utensils,
    label: "Menu Builder",
  },
  {
    href: "/dashboard/setting",
    icon: Store,
    label: "Restaurant Settings",
  },
];

export function SidebarContent() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <h1 className="text-xl font-semibold text-primary">MenuLink</h1>
        </Link>
      </div>
      
      <div className="flex-1">
        <nav className="grid items-start gap-1">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-2",
                  pathname === item.href && "bg-accent text-accent-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>
      </div>
      
      <div className="p-4 border-t">
        <LogoutButton />
      </div>
    </div>
  );
}