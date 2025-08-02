"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Mail, Gift, Bell, Zap } from "lucide-react"

export function NewsletterSection() {
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter subscription
    console.log("Newsletter subscription:", email)
    setEmail("")
  }

  const benefits = [
    {
      icon: Gift,
      text: "Exclusive deals & offers",
    },
    {
      icon: Bell,
      text: "New product alerts",
    },
    {
      icon: Zap,
      text: "Early access to sales",
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

      {/* Floating Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-float"></div>
      <div className="absolute bottom-10 right-10 w-16 h-16 bg-white/5 rounded-full animate-float delay-1000"></div>
      <div className="absolute top-1/2 right-20 w-12 h-12 bg-white/10 rounded-full animate-float delay-2000"></div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Section Header */}
          <div className="mb-12 animate-in slide-in-from-bottom-10 duration-1000">
            <Badge variant="secondary" className="mb-4">
              <Mail className="w-4 h-4 mr-2" />
              Newsletter
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay in the Loop</h2>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-8">
              Subscribe to our newsletter and be the first to know about new products, exclusive deals, and special
              offers. Join our community of smart shoppers!
            </p>
          </div>

          {/* Benefits */}
          <div className="flex flex-wrap justify-center gap-6 mb-12 animate-in slide-in-from-bottom-10 duration-1000 delay-300">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-2 text-primary-foreground/90">
                <benefit.icon className="h-5 w-5" />
                <span className="text-sm font-medium">{benefit.text}</span>
              </div>
            ))}
          </div>

          {/* Newsletter Form */}
          <div className="max-w-md mx-auto animate-in slide-in-from-bottom-10 duration-1000 delay-500">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 bg-white/10 border-white/20 text-primary-foreground placeholder:text-primary-foreground/60 focus:bg-white/20"
              />
              <Button type="submit" variant="secondary" className="whitespace-nowrap group">
                Subscribe Now
                <Mail className="ml-2 h-4 w-4 transition-transform group-hover:scale-110" />
              </Button>
            </form>
            <p className="text-xs text-primary-foreground/60 mt-4">We respect your privacy. Unsubscribe at any time.</p>
          </div>

          {/* Social Proof */}
          <div className="mt-12 animate-in slide-in-from-bottom-10 duration-1000 delay-700">
            <p className="text-primary-foreground/80 mb-4">Join 25,000+ subscribers who love our updates</p>
            <div className="flex justify-center items-center space-x-2">
              <div className="flex -space-x-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-white/20 border-2 border-primary flex items-center justify-center text-xs font-bold"
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <span className="text-sm text-primary-foreground/70">and many more...</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
