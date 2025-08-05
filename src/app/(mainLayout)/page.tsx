"use client"

import { AboutSection } from "@/components/Sections/AboutSection"
import CategoriesSection from "@/components/Sections/CategoriesSection"
import { ContactSection } from "@/components/Sections/ContactSection"
import { FeaturedProducts } from "@/components/Sections/FeaturedProduct"
import { HeroSection } from "@/components/Sections/HeroSection"
import { NewsletterSection } from "@/components/Sections/NewsletterSection"
import { ServicesSection } from "@/components/Sections/ServicesSection"
import { StatsSection } from "@/components/Sections/StatsSection"
import { TestimonialsSection } from "@/components/Sections/TestimonialSection"



export default function HomePage() {
  return (
    <div className="overflow-hidden">
      <HeroSection />
      <CategoriesSection />
      <FeaturedProducts />
      <AboutSection />
      <ServicesSection />
      <StatsSection />
      <TestimonialsSection />
      {/* <BlogSection /> */}
      <NewsletterSection />
      <ContactSection />
    </div>
  )
}