"use client";

import { Footer } from "@/components/Layout/Footer";
import { Navbar } from "@/components/Layout/Navbar";
import type React from "react";
import { BottomNavbar } from "@/components/Layout/BottomNavbar";
import { useState } from "react";
import CartSlider from "@/components/Layout/CartSlider";
import WishlistSlider from "@/components/Layout/WishlistSlider";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  const handleCartClick = () => {
    setIsCartOpen(true);
    setIsWishlistOpen(false); // Close wishlist if open
  };

  const handleWishlistClick = () => {
    setIsWishlistOpen(true);
    setIsCartOpen(false); // Close cart if open
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onCartClick={handleCartClick} onWishlistClick={handleWishlistClick} />
      <main className="flex-1">{children}</main>
      <Footer />
      <BottomNavbar onCartClick={handleCartClick} onWishlistClick={handleWishlistClick} />
      <CartSlider isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <WishlistSlider
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
      />
    </div>
  );
}