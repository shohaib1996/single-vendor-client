"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Award, Users, Globe } from "lucide-react"
import Image from "next/image"

const features = [
  {
    icon: CheckCircle,
    title: "Quality Guaranteed",
    description: "Every product is carefully selected and tested for quality",
  },
  {
    icon: Award,
    title: "Award Winning",
    description: "Recognized as the best ecommerce platform of 2024",
  },
  {
    icon: Users,
    title: "Customer First",
    description: "Our customers are at the heart of everything we do",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "Serving customers in over 50 countries worldwide",
  },
]

export function AboutSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-in slide-in-from-left-10 duration-1000">
            <div>
              <Badge variant="outline" className="mb-4">
                About EcoShop
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Your Trusted Shopping Partner Since 2020</h2>
              <p className="text-lg text-muted-foreground mb-6">
                We started with a simple mission: to make quality products accessible to everyone. Today, we're proud to
                serve thousands of happy customers with our carefully curated selection of premium products.
              </p>
              <p className="text-muted-foreground mb-8">
                Our commitment to excellence, sustainability, and customer satisfaction has made us a leader in the
                ecommerce space. We believe in building lasting relationships with our customers through trust, quality,
                and exceptional service.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-4 rounded-lg bg-background border">
                <div className="text-3xl font-bold text-primary mb-2">10K+</div>
                <div className="text-sm text-muted-foreground">Happy Customers</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-background border">
                <div className="text-3xl font-bold text-primary mb-2">5K+</div>
                <div className="text-sm text-muted-foreground">Products Sold</div>
              </div>
            </div>

            <Button size="lg">Learn More About Us</Button>
          </div>

          {/* Right Content */}
          <div className="space-y-8 animate-in slide-in-from-right-10 duration-1000 delay-300">
            {/* Main Image */}
            <div className="relative">
              <Image
                src="/placeholder.svg?height=400&width=500"
                alt="About Us"
                width={500}
                height={400}
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground p-6 rounded-xl shadow-lg">
                <div className="text-2xl font-bold">4+ Years</div>
                <div className="text-sm opacity-90">of Excellence</div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="hover:shadow-md transition-shadow duration-300 animate-in slide-in-from-bottom-10"
                  style={{ animationDelay: `${(index + 4) * 200}ms` }}
                >
                  <CardContent className="p-4">
                    <feature.icon className="h-8 w-8 text-primary mb-3" />
                    <h4 className="font-semibold mb-2">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
