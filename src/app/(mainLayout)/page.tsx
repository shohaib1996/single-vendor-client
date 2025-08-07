"use client"

import { ScrollToTop } from "@/components/common/ScrollToTop"
import { AboutSection } from "@/components/Sections/AboutSection"
import CategoriesSection from "@/components/Sections/CategoriesSection"
import CategoryFlex from "@/components/Sections/CategoryFlex"
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
      <CategoryFlex/>
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
      <ScrollToTop/>
    </div>
  )
}