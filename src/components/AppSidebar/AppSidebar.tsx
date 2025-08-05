"use client"

import { useState } from "react"
import { Calendar, Home, Inbox, Search, Settings, Package, MessageSquare, Boxes, ChevronDown, ChevronRight } from "lucide-react"

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
    title: "Inbox",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
]

export function AppSidebar() {
  const [isProductManagementOpen, setIsProductManagementOpen] = useState(true)

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
                    <SidebarGroup key={item.title}>
                      <SidebarGroupLabel
                        className="flex items-center cursor-pointer p-0"
                        onClick={() => setIsProductManagementOpen(!isProductManagementOpen)}
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        <span>{item.title}</span>
                        {isProductManagementOpen ? (
                          <ChevronDown className="ml-auto h-4 w-4" />
                        ) : (
                          <ChevronRight className="ml-auto h-4 w-4" />
                        )}
                      </SidebarGroupLabel>
                      {isProductManagementOpen && (
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