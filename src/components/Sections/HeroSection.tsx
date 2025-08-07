import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const heroSlides = [
  {
    id: 1,
    title: "STARLINK UPCOMING",
    subtitle: "Order From Our Website or Physical Store",
    description: "TAKING PRE-ORDER",
    image: "https://i.imgur.com/H2A438s.jpeg",
    cta: "Pre-Order Now",
    badge: "New Launch",
    link: "/products/0ab0c15e-e59e-4fb1-8ae2-125dc9632a0c",
  },
  {
    id: 2,
    title: "PREMIUM COLLECTION",
    subtitle: "Discover Our Latest Tech Products",
    description: "EXCLUSIVE DEALS",
    image: "https://i.imgur.com/Mjm37Wk.jpeg",
    cta: "Shop Now",
    badge: "Limited Time",
    link: "/products/52e87388-f119-4efd-a98f-d3be39bd6cbc",
  },
  {
    id: 3,
    title: "SMART DEVICES",
    subtitle: "Transform Your Digital Lifestyle",
    description: "INNOVATION AWAITS",
    image:
      "https://images.vexels.com/content/194698/preview/shop-online-slider-template-4f2c60.png",
    cta: "Explore",
    badge: "Best Seller",
    link: "/products",
  },
];

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length
    );
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section className="bg-gradient-to-br from-background to-muted/30 py-4 sm:py-4 lg:py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Main Hero Carousel - 70% */}
          <div className="lg:w-7/10 w-full h-[300px] sm:h-[60vh] md:h-[70vh] lg:h-[460px]">
            <Card className="relative h-full overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-0 p-0">
              <CardContent className="p-0 h-full">
                {/* Carousel Container */}
                <div className="relative w-full h-full">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentSlide}
                      initial={{ opacity: 0, x: 300 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -300 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      className="absolute inset-0"
                    >
                      {/* Background Image */}
                      <Link href={heroSlides[currentSlide].link}>
                        <div className="absolute inset-0">
                          <Image
                            src={
                              heroSlides[currentSlide].image ||
                              "/placeholder.svg"
                            }
                            alt={heroSlides[currentSlide].title}
                            fill
                            className="object-fill object-center"
                            priority
                          />
                        </div>
                      </Link>
                    </motion.div>
                  </AnimatePresence>

                  {/* Navigation Arrows */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 text-white border-white/20"
                    onClick={prevSlide}
                  >
                    <ChevronLeft className="h-4 sm:h-5 w-4 sm:w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 text-white border-white/20"
                    onClick={nextSlide}
                  >
                    <ChevronRight className="h-4 sm:h-5 w-4 sm:w-5" />
                  </Button>

                  {/* Carousel Dots */}
                  <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
                    {heroSlides.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentSlide
                            ? "bg-gradient-to-r from-primary to-accent scale-125 w-4 sm:w-6"
                            : "bg-white/40 hover:bg-white/60"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Sections - 30% */}
          <div className="lg:w-3/10 w-full flex flex-col gap-4 sm:gap-6 lg:h-[460px] lg:min-h-[300px]">
            {/* Career Section */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="flex-1 min-h-0"
            >
              <div className="flex items-center justify-between mb-4 rounded-2xl">
                <Link href="/products/22b1b30c-2ab5-4894-b5fd-02754ac4b27c">
                  <Image
                    src="https://i.imgur.com/A8mLhHj.png"
                    alt="image"
                    height={218}
                    width={444}
                    className="rounded-2xl"
                  />
                </Link>
              </div>
            </motion.div>

            {/* Stats Section */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 }}
              className="flex-1 min-h-0"
            >
              <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20 h-full">
                <CardContent className="p-4 sm:p-6 flex flex-col justify-between h-full">
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 text-center">
                    <div>
                      <div className="text-xl sm:text-2xl font-bold text-primary">
                        10K+
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Happy Customers
                      </div>
                    </div>
                    <div>
                      <div className="text-xl sm:text-2xl font-bold text-primary">
                        5K+
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Products
                      </div>
                    </div>
                    <div>
                      <div className="text-xl sm:text-2xl font-bold text-accent">
                        99%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Satisfaction
                      </div>
                    </div>
                    <div>
                      <div className="text-xl sm:text-2xl font-bold text-accent">
                        24/7
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Support
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
