"use client"

import { Button } from "@/components/ui/button"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Smartphone,
  Headphones,
  Camera,
  Watch,
  Gamepad2,
  Tv,
  Speaker,
  HardDrive,
  Router,
  Battery,
  Cpu,
  Monitor,
} from "lucide-react"

const categories = [
  {
    id: 1,
    name: "Drone",
    count: 125,
    icon: Camera,
    color: "from-blue-500 to-blue-600",
    description: "Professional & Consumer Drones",
  },
  {
    id: 2,
    name: "Gimbal",
    count: 89,
    icon: Camera,
    color: "from-purple-500 to-purple-600",
    description: "Camera Stabilizers",
  },
  {
    id: 3,
    name: "Charger Fan",
    count: 156,
    icon: Battery,
    color: "from-green-500 to-green-600",
    description: "Cooling & Charging Solutions",
  },
  {
    id: 4,
    name: "Weight Scale",
    count: 67,
    icon: Monitor,
    color: "from-orange-500 to-orange-600",
    description: "Digital & Smart Scales",
  },
  {
    id: 5,
    name: "TV",
    count: 234,
    icon: Tv,
    color: "from-red-500 to-red-600",
    description: "Smart TVs & Displays",
  },
  {
    id: 6,
    name: "Mobile Phone",
    count: 445,
    icon: Smartphone,
    color: "from-indigo-500 to-indigo-600",
    description: "Latest Smartphones",
  },
  {
    id: 7,
    name: "Mobile Accessories",
    count: 678,
    icon: Headphones,
    color: "from-pink-500 to-pink-600",
    description: "Cases, Chargers & More",
  },
  {
    id: 8,
    name: "Portable SSD",
    count: 123,
    icon: HardDrive,
    color: "from-teal-500 to-teal-600",
    description: "External Storage Solutions",
  },
  {
    id: 9,
    name: "Portable WiFi Camera",
    count: 89,
    icon: Router,
    color: "from-cyan-500 to-cyan-600",
    description: "Wireless Security Cameras",
  },
  {
    id: 10,
    name: "Trimmer",
    count: 156,
    icon: Cpu,
    color: "from-amber-500 to-amber-600",
    description: "Personal Care Devices",
  },
  {
    id: 11,
    name: "Smart Watch",
    count: 234,
    icon: Watch,
    color: "from-emerald-500 to-emerald-600",
    description: "Fitness & Smart Watches",
  },
  {
    id: 12,
    name: "Action Camera",
    count: 167,
    icon: Camera,
    color: "from-violet-500 to-violet-600",
    description: "Adventure & Sports Cameras",
  },
  {
    id: 13,
    name: "Earphone",
    count: 345,
    icon: Headphones,
    color: "from-rose-500 to-rose-600",
    description: "Wired & Wireless Earphones",
  },
  {
    id: 14,
    name: "Earbuds",
    count: 289,
    icon: Headphones,
    color: "from-sky-500 to-sky-600",
    description: "True Wireless Earbuds",
  },
  {
    id: 15,
    name: "Bluetooth Speakers",
    count: 178,
    icon: Speaker,
    color: "from-lime-500 to-lime-600",
    description: "Portable Audio Speakers",
  },
  {
    id: 16,
    name: "Gaming Console",
    count: 134,
    icon: Gamepad2,
    color: "from-fuchsia-500 to-fuchsia-600",
    description: "Gaming Systems & Accessories",
  },
]

export function CategoriesSection() {
  return (
    <section className="py-6 bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-6 animate-in slide-in-from-bottom-10 duration-1000">
          <Badge variant="outline" className="mb-4 border-primary/20 text-primary">
            Featured Category
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Get Your Desired Product from Featured Category!
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our comprehensive range of tech products across various categories
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <Card
              key={category.id}
              className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-card/50 backdrop-blur-sm border-border/50 animate-in slide-in-from-bottom-10 p-0"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardContent className="p-2 text-center">
                <div className="mb-4">
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${category.color} group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                  >
                    <category.icon className="h-6 w-6 md:h-8 md:w-8 text-white" />
                  </div>
                </div>

                <h3 className="font-semibold text-sm md:text-base mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {category.name}
                </h3>

                <p className="text-xs text-muted-foreground mb-2 line-clamp-2 hidden md:block">
                  {category.description}
                </p>

                <div className="text-xs text-primary font-medium">{category.count} products</div>

                {/* Hover Effect */}
                <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-8 h-0.5 bg-gradient-to-r from-primary to-accent rounded-full mx-auto"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12 animate-in slide-in-from-bottom-10 duration-1000 delay-1000">
          <Button
            variant="outline"
            size="lg"
            className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20 hover:from-primary/10 hover:to-accent/10 hover:border-primary/30"
          >
            View All Categories
          </Button>
        </div>
      </div>
    </section>
  )
}
