"use client"

import { useState } from "react"
import { Calendar, Home, Inbox, Search, Settings, Package, MessageSquare, Boxes, ChevronDown, ChevronRight, Box, ListOrdered, Package2Icon, ShoppingBag, User2 } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

interface MenuItem {
  title: string;
  url?: string;
  icon: React.ElementType;
  children?: MenuItem[];
}

// Menu items.
const items: MenuItem[] = [
  {
    title: "Product Management",
    icon: Home,
    children: [
      {
        title: "All Products",
        url: "/admin/products",
        icon: Package,
      },
      {
        title: "Q&A",
        url: "/admin/products/qna",
        icon: MessageSquare,
      },
      {
        title: "Specification Management",
        url: "/admin/products/specification",
        icon: Boxes,
      },
      {
        title: "Review Management",
        url: "/admin/products/reviews",
        icon: Boxes,
      },
    ],
  },
  {
    title: "Categoy&Brand",
    icon: Inbox,
    children: [
      {
        title: "Category",
        url: "/admin/category-brand/category",
        icon: Box
      },
      {
        title: "Brand",
        url: "/admin/category-brand/brand",
        icon: Box
      }
    ]
  },
  {
    title: "Order&Payment",
    icon: Calendar,
    children: [
      {
        title: "All Orders",
        icon: ListOrdered,
        url: "/admin/order-payment/orders"
      },
      {
        title: "All Payments",
        icon: Package2Icon,
        url: "/admin/order-payment/payments"
      }
    ]
  },
  {
    title: "Cart&Wishlist",
    icon: Search,
    children: [
      {
        title: "Cart Items",
        icon: ShoppingBag,
        url: "/admin/cart-wishlist/cart-items"
      },
      {
        title: "All Wishlist",
        icon: ShoppingBag,
        url: "/admin/cart-wishlist/wishlists"
      }
    ]
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
  {
    title: "User Management",
    icon: Settings,
    children: [{
      title: "All Users",
      icon: User2,
      url: "/admin/users"
    }]
  },
]

export function AppSidebar() {
  // State to track open/closed status for each menu with children
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({
    "Product Management": false, 
    "Categoy&Brand": false,
    "Order&Payment": false,
    "Cart&Wishlist": false,
    "User Management": false
  })

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [title]: !prev[title]
    }))
  }

  return (
    <Sidebar>
      <SidebarHeader>
        hello
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                if (item.children) {
                  return (
                    <SidebarGroup key={item.title} className="px-1 py-0">
                      <SidebarGroupLabel
                        className="flex items-center cursor-pointer p-0"
                        onClick={() => toggleMenu(item.title)}
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        <span className="text-[14px]">{item.title}</span>
                        {openMenus[item.title] ? (
                          <ChevronDown className="ml-auto h-4 w-4" />
                        ) : (
                          <ChevronRight className="ml-auto h-4 w-4" />
                        )}
                      </SidebarGroupLabel>
                      {openMenus[item.title] && (
                        <SidebarGroupContent className="pl-4 border-l-2 border-gray-200 ml-3">
                          {item.children.map((child) => (
                            <SidebarMenuItem key={child.title}>
                              <SidebarMenuButton asChild>
                                <a href={child.url} className="flex items-center">
                                  <child.icon className="mr-2 h-4 w-4" />
                                  <span>{child.title}</span>
                                </a>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          ))}
                        </SidebarGroupContent>
                      )}
                    </SidebarGroup>
                  );
                } else {
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <a href={item.url} className="flex items-center">
                          <item.icon className="mr-2 h-4 w-4" />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                }
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}