"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Heart,
  User,
  ShoppingCart,
  BadgePercent,
  LayoutGrid,
  Menu,
  LogOut,
  Settings,
  Package,
  LayoutDashboard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/hooks";
import { useGetWishlistQuery } from "@/redux/api/wishlist/wishlistApi";
import { useGetCartQuery } from "@/redux/api/cart/cartApi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { logout } from "@/redux/features/auth/authSlice";
import { useGetUserProfileQuery } from "@/redux/api/user/userApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function BottomNavbar({ onCartClick, onWishlistClick }: { onCartClick: () => void; onWishlistClick: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, token } = useAppSelector((state) => state.auth);
  const { data: cartData } = useGetCartQuery({});
  const { data: wishlist } = useGetWishlistQuery({});
  const { data: userData } = useGetUserProfileQuery({});
  const dispatch = useAppDispatch();

  const navItems = [
    {
      name: "Home",
      href: "/",
      icon: LayoutGrid,
    },
    {
      name: "Wishlist",
      href: "/wishlist",
      icon: Heart,
      count: user ? wishlist?.data.length : 0,
      action: onWishlistClick,
    },
    {
      name: "Cart",
      href: "/cart",
      icon: ShoppingCart,
      count: user ? cartData?.data[0]?.items.length : 0,
      action: onCartClick,
    },
    {
      name: "Offer",
      href: "/offers",
      icon: BadgePercent,
    },
  ];

  const menuNavItems = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "Categories", href: "/categories" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const handleLogout = () => {
    dispatch(logout());
    router.push("/signin");
    toast.success("Logged out successfully!");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const isAuthenticated = user && token;

  return (
    <div className="block lg:hidden fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t">
      <div className="grid h-full max-w-lg grid-cols-5 mx-auto font-medium">
        {navItems.map((item) => {
          const isActionItem = item.name === 'Cart' || item.name === 'Wishlist';

          if (isActionItem) {
            return (
              <button
                key={item.name}
                onClick={item.action}
                className={cn(
                  "inline-flex flex-col items-center justify-center px-5 hover:bg-muted group",
                  "text-muted-foreground"
                )}
              >
                <div className="relative">
                  <item.icon className="w-5 h-5 mb-1" />
                  {item.count !== undefined && item.count > 0 && (
                    <span className="absolute -top-2 -right-3 h-4 w-4 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                      {item.count}
                    </span>
                  )}
                </div>
                <span className="text-xs">{item.name}</span>
              </button>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "inline-flex flex-col items-center justify-center px-5 hover:bg-muted group",
                {
                  "text-primary": pathname === item.href,
                  "text-muted-foreground": pathname !== item.href,
                }
              )}
            >
              <div className="relative">
                <item.icon className="w-5 h-5 mb-1" />
                {item.count !== undefined && item.count > 0 && (
                  <span className="absolute -top-2 -right-3 h-4 w-4 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                    {item.count}
                  </span>
                )}
              </div>
              <span className="text-xs">{item.name}</span>
            </Link>
          );
        })}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="inline-flex flex-col items-center justify-center px-5 hover:bg-muted group text-muted-foreground">
              <Menu className="w-5 h-5 mb-1" />
              <span className="text-xs">Menu</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 mb-2" align="end" forceMount>
            {isAuthenticated ? (
              <>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={userData?.data?.avatarUrl || "/placeholder.svg"}
                        alt={user?.name}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-xs font-semibold">
                        {getInitials(user?.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
              </>
            ) : null}
            {menuNavItems.map((item) => (
              <DropdownMenuItem key={item.name} asChild>
                <Link href={item.href} className="cursor-pointer">
                  {item.name}
                </Link>
              </DropdownMenuItem>
            ))}
            {isAuthenticated ? (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Manage Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  {user?.role === "ADMIN" ? (
                    <Link href="/admin" className="cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  ) : (
                    <Link href="/orders" className="cursor-pointer">
                      <Package className="mr-2 h-4 w-4" />
                      <span>My Orders</span>
                    </Link>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-red-600 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </>
            ) : (
              <DropdownMenuItem asChild>
                <Link href="/signin" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Login</span>
                </Link>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}