'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Utensils, Store,  List, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import LogoutButton from "../ui/logout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface MenuItem {
  id: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  subItems: {
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    label: string;
  }[];
}

const menuItems: MenuItem[] = [
  {
    id: "dashboard",
    href: "/dashboard/home",
    icon: Home,
    label: "Dashboard",
    subItems: [],
  },
  
  {
    id: "product",
    href: "dashboard/product/all-products",
    icon: Utensils,
    label: "Product",
    subItems: [
      {
        href: "dashboard/product/all-products",
        icon: List,
        label: "All Products",
      },
      {
        href: "/dashboard/category/all",
        icon: List,
        label: "All Category",
      },
    ],
  },
  
  
  {
    id: "orders",
    href: "/dashboard/orders",
    icon: Utensils,
    label: "Orders",
    subItems: [
      {
        href: "/dashboard/order/all",
        icon: List,
        label: "All Orders",
      }
    ],
  },  
  
  {
    id: "media",
    href: "dashboard/media",
    icon: Utensils,
    label: "All Images",
    subItems: [
      {
        href: "dashboard/media",
        icon: Settings,
        label: "All Images",
      },
    ],
  },
  {
    id: "setting",
    href: "/dashboard/setting",
    icon: Store,
    label: "Settings",
    subItems: [
      {
        href: "/dashboard/setting/general",
        icon: Settings,
        label: "General Settings",
      },
      {
        href: "/dashboard/setting/design",
        icon: Settings,
        label: "Design",
      },
    ],
  },
];

export function Sidebar({
  className,
  hideOnMobile = true,
}: {
  className?: string;
  hideOnMobile?: boolean;
}) {
  const pathname = usePathname();

  const defaultOpenItem =
    (menuItems.find(item =>
      pathname.startsWith(item.href) ||
      item.subItems.some(subItem => pathname.startsWith(subItem.href))
    ))?.id || "";

  return (
    <div className={cn(
      hideOnMobile ? "hidden md:block" : "",
      "border-r bg-muted/40 w-64 h-screen",
      className
    )}>
      <div className="flex h-full flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-xl font-semibold text-primary">MenuLink</span>
          </Link>
        </div>

        <div className="flex-1 px-3 py-4 overflow-y-auto sm:items-end ">
          <Accordion
            type="single"
            collapsible
            defaultValue={defaultOpenItem}
            className="space-y-1"
          >
            {menuItems.map((item) => (
              <AccordionItem key={item.id} value={item.id} className="border-none">
                {item.subItems.length > 0 ? (
                  <>
                    <AccordionTrigger
                      className={cn(
                        "hover:no-underline p-2 rounded-md",
                        "hover:bg-accent hover:text-accent-foreground",
                        (pathname.startsWith(item.href) ||
                          item.subItems.some(subItem => pathname === subItem.href)) &&
                        "bg-accent text-accent-foreground"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pl-8 pt-1">
                      <div className="space-y-1">
                        {item.subItems.map((subItem) => (
                          <Link key={subItem.href} href={subItem.href}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className={cn(
                                "w-full justify-start gap-2",
                                pathname === subItem.href && "bg-accent text-accent-foreground"
                              )}
                            >
                              <subItem.icon className="h-4 w-4" />
                              {subItem.label}
                            </Button>
                          </Link>
                        ))}
                      </div>
                    </AccordionContent>
                  </>
                ) : (
                  <Link href={item.href}>
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
                )}
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="mt-auto p-4 border-t">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
