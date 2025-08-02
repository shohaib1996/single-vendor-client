"use client"

import { Badge } from "@/components/ui/badge"
import { TrendingUp, Users, Package, Star } from "lucide-react"

const stats = [
  {
    icon: Users,
    value: "10,000+",
    label: "Happy Customers",
    description: "Satisfied customers worldwide",
  },
  {
    icon: Package,
    value: "50,000+",
    label: "Orders Delivered",
    description: "Successfully completed orders",
  },
  {
    icon: Star,
    value: "4.9/5",
    label: "Customer Rating",
    description: "Average customer satisfaction",
  },
  {
    icon: TrendingUp,
    value: "99%",
    label: "Success Rate",
    description: "Order fulfillment rate",
  },
]

export function StatsSection() {
  return (
    <section className="py-20 bg-primary text-primary-foreground relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <div className="text-center mb-16 animate-in slide-in-from-bottom-10 duration-1000">
          <Badge variant="secondary" className="mb-4">
            Our Achievements
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Numbers That Speak</h2>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Our success is measured by the satisfaction of our customers and the quality of our service
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center group animate-in slide-in-from-bottom-10"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-foreground/10 group-hover:bg-primary-foreground/20 transition-colors duration-300 group-hover:scale-110 transform">
                  <stat.icon className="h-8 w-8" />
                </div>
              </div>
              <div className="text-4xl md:text-5xl font-bold mb-2 group-hover:scale-105 transition-transform duration-300">
                {stat.value}
              </div>
              <div className="text-xl font-semibold mb-2">{stat.label}</div>
              <div className="text-primary-foreground/70">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
