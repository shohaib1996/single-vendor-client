"use client";

import { useState, useEffect } from "react";
import {
  Package,
  ChevronDown,
  ChevronRight,
  ListOrdered,
  CreditCard,
  ShoppingBag,
  User2,
  Filter,
  LayoutDashboard,
  LogOut,
  Tags,
  Heart,
  ShoppingCart,
  Users,
  HelpCircle,
  Star,
  Wrench,
  Boxes,
} from "lucide-react";

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
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "@/components/ModeToggle/ModeToggle";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/hooks";
import { logout } from "@/redux/features/auth/authSlice";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface MenuItem {
  title: string;
  url?: string;
  icon: React.ElementType;
  children?: MenuItem[];
}

// Menu items with appropriate icons
const items: MenuItem[] = [
  {
    title: "Admin Dashboard",
    icon: LayoutDashboard,
    url: "/admin",
  },
  {
    title: "Product Management",
    icon: Package,
    children: [
      {
        title: "All Products",
        url: "/admin/products",
        icon: Package,
      },
      {
        title: "Q&A",
        url: "/admin/products/qna",
        icon: HelpCircle,
      },
      {
        title: "Specification Management",
        url: "/admin/products/specification",
        icon: Wrench,
      },
      {
        title: "Review Management",
        url: "/admin/products/reviews",
        icon: Star,
      },
    ],
  },
  {
    title: "Category & Brand",
    icon: Tags,
    children: [
      {
        title: "Category",
        url: "/admin/category-brand/category",
        icon: Boxes,
      },
      {
        title: "Brand",
        url: "/admin/category-brand/brand",
        icon: Tags,
      },
    ],
  },
  {
    title: "Filter Options",
    icon: Filter,
    children: [
      {
        title: "All Filter",
        icon: Filter,
        url: "/admin/filters",
      },
    ],
  },
  {
    title: "Order & Payment",
    icon: ShoppingCart,
    children: [
      {
        title: "All Orders",
        icon: ListOrdered,
        url: "/admin/order-payment/orders",
      },
      {
        title: "All Payments",
        icon: CreditCard,
        url: "/admin/order-payment/payments",
      },
    ],
  },
  {
    title: "Cart & Wishlist",
    icon: ShoppingBag,
    children: [
      {
        title: "Cart Items",
        icon: ShoppingCart,
        url: "/admin/cart-wishlist/cart-items",
      },
      {
        title: "All Wishlist",
        icon: Heart,
        url: "/admin/cart-wishlist/wishlists",
      },
    ],
  },
  {
    title: "User Management",
    icon: Users,
    children: [
      {
        title: "All Users",
        icon: User2,
        url: "/admin/users",
      },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  // State to track open/closed status for each menu with children
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});

  // Mock user data - replace with actual user data from your auth system
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();

  // Initialize menu state and keep menus open based on current route
  useEffect(() => {
    const initialOpenMenus: { [key: string]: boolean } = {};

    items.forEach((item) => {
      if (item.children) {
        // Check if current path matches any child route
        const isActive = item.children.some(
          (child) => child.url && pathname.startsWith(child.url)
        );
        initialOpenMenus[item.title] = isActive;
      }
    });

    setOpenMenus(initialOpenMenus);
  }, [pathname]);

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push("/signin");
    toast.success("Logged out successfully!");
  };

  const isActiveRoute = (url?: string) => {
    if (!url) return false;
    return pathname === url || pathname.startsWith(url + "/");
  };

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b p-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md">
              <span className="text-primary-foreground font-bold text-lg">
                E
              </span>
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              EcoShop
            </span>
          </Link>
          <div>
            <ModeToggle />
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Application
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-2">
            <SidebarMenu className="space-y-1">
              {items.map((item) => {
                if (item.children) {
                  const isOpen = openMenus[item.title];
                  const hasActiveChild = item.children.some((child) =>
                    isActiveRoute(child.url)
                  );

                  return (
                    <div key={item.title} className="space-y-1">
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          onClick={() => toggleMenu(item.title)}
                          className={`w-full justify-between transition-all duration-200 ${
                            hasActiveChild ? "" : ""
                          }`}
                        >
                          <div className="flex items-center">
                            <item.icon className="mr-3 h-4 w-4" />
                            <span className="text-sm font-medium">
                              {item.title}
                            </span>
                          </div>
                          <div
                            className={`transition-transform duration-200 ${
                              isOpen ? "rotate-90" : ""
                            }`}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </div>
                        </SidebarMenuButton>
                      </SidebarMenuItem>

                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="ml-4 border-l border-gray-400 pl-4 space-y-1">
                          {item.children.map((child) => (
                            <SidebarMenuItem key={child.title}>
                              <SidebarMenuButton
                                asChild
                                className={`hover:bg-accent/50 transition-all duration-200 ${
                                  isActiveRoute(child.url)
                                    ? " "
                                    : ""
                                }`}
                              >
                                <Link
                                  href={child.url || "#"}
                                  className="flex items-center"
                                >
                                  <child.icon className="mr-3 h-4 w-4" />
                                  <span className="text-sm">{child.title}</span>
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={`transition-all duration-200 ${
                          isActiveRoute(item.url) ? " " : ""
                        }`}
                      >
                        <Link
                          href={item.url || "#"}
                          className="flex items-center"
                        >
                          <item.icon className="mr-3 h-4 w-4" />
                          <span className="text-sm font-medium">
                            {item.title}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                }
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-0">
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center space-x-3 w-full justify-start p-2 h-auto hover:bg-accent/50 transition-colors duration-200"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={user?.avatarUrl || "/placeholder.svg"}
                    alt={user?.name}
                  />
                  <AvatarFallback className=" text-primary-foreground text-xs">
                    {user?.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start text-left min-w-0 flex-1">
                  <span className="text-sm font-medium truncate max-w-full">
                    {user?.name}
                  </span>
                  <span className="text-xs text-muted-foreground truncate max-w-full">
                    {user?.email}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex items-center">
                  <User2 className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              {/* <DropdownMenuItem asChild>
                <Link href="/settings" className="flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem> */}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
