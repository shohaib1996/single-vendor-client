
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ShoppingCart, Heart, User, Search, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { ModeToggle } from "../ModeToggle/ModeToggle"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "Categories", href: "/categories" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Search query:", searchQuery)
    // Handle search functionality
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-300",
        isScrolled ? "bg-primary/90 backdrop-blur-md shadow-lg" : "bg-secondary",
      )}
    >
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex h-14 sm:h-16 items-center justify-between gap-2 sm:gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <div className="h-7 sm:h-8 w-7 sm:w-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md">
              <span className="text-primary-foreground font-bold text-base sm:text-lg">E</span>
            </div>
            <span className="font-bold text-lg sm:text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              EcoShop
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-4 xl:space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-xs sm:text-sm font-medium transition-colors hover:text-primary relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="flex-1 max-w-xs sm:max-w-sm md:max-w-md mx-2 sm:mx-4 hidden sm:block">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 h-3 sm:h-4 w-3 sm:w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 sm:pl-10 pr-3 sm:pr-4 h-8 sm:h-10 text-xs sm:text-sm bg-muted/50 border-muted-foreground/20 focus:border-primary focus:ring-primary/20"
              />
            </form>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Mobile Search */}
            <Button variant="ghost" size="icon" className="sm:hidden p-1 sm:p-2">
              <Search className="h-4 sm:h-5 w-4 sm:w-5" />
            </Button>

            {/* Wishlist */}
            <Button variant="ghost" size="icon" className="relative group p-1 sm:p-2">
              <Heart className="h-4 sm:h-5 w-4 sm:w-5 transition-colors group-hover:text-primary" />
              <span className="absolute -top-1 -right-1 h-3 sm:h-4 w-3 sm:w-4 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground text-[0.6rem] sm:text-xs flex items-center justify-center shadow-md">
                2
              </span>
            </Button>

            {/* Cart */}
            <Button variant="ghost" size="icon" className="relative group p-1 sm:p-2">
              <ShoppingCart className="h-4 sm:h-5 w-4 sm:w-5 transition-colors group-hover:text-primary" />
              <span className="absolute -top-1 -right-1 h-3 sm:h-4 w-3 sm:w-4 rounded-full bg-gradient-to-r from-accent to-accent/80 text-accent-foreground text-[0.6rem] sm:text-xs flex items-center justify-center shadow-md">
                3
              </span>
            </Button>

            {/* User Account */}
            <Button variant="ghost" size="icon" className="group p-1 sm:p-2">
              <User className="h-4 sm:h-5 w-4 sm:w-5 transition-colors group-hover:text-primary" />
            </Button>

            {/* Theme Toggle */}
            <ModeToggle />

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden p-1 sm:p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-4 sm:h-5 w-4 sm:w-5" /> : <Menu className="h-4 sm:h-5 w-4 sm:w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t py-3 sm:py-4 animate-in slide-in-from-top-2">
            {/* Mobile Search */}
            <div className="mb-3 sm:mb-4 sm:hidden">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 h-8 text-xs bg-muted/50 border-muted-foreground/20"
                />
              </form>
            </div>

            <nav className="flex flex-col space-y-3 sm:space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-xs sm:text-sm font-medium transition-colors hover:text-primary px-2 py-1"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
