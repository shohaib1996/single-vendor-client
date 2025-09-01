"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Users, Package, Star } from "lucide-react"

const stats = [
  {
    icon: Users,
    value: 10000,
    suffix: "+",
    label: "Happy Customers",
    description: "Satisfied customers worldwide",
    color: "text-blue-600",
  },
  {
    icon: Package,
    value: 50000,
    suffix: "+",
    label: "Orders Delivered",
    description: "Successfully completed orders",
    color: "text-green-600",
  },
  {
    icon: Star,
    value: 4.9,
    suffix: "/5",
    label: "Customer Rating",
    description: "Average customer satisfaction",
    color: "text-yellow-600",
    isDecimal: true,
  },
  {
    icon: TrendingUp,
    value: 99,
    suffix: "%",
    label: "Success Rate",
    description: "Order fulfillment rate",
    color: "text-purple-600",
  },
]

interface CounterProps {
  end: number
  duration?: number
  isDecimal?: boolean
  suffix?: string
  isVisible: boolean
  delay?: number
}

function Counter({ end, duration = 2000, isDecimal = false, suffix = "", isVisible, delay = 0 }: CounterProps) {
  const [count, setCount] = useState(0)
  const animationRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)

  const animate = useCallback(
    (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp + delay
      }

      if (timestamp < startTimeRef.current) {
        animationRef.current = requestAnimationFrame(animate)
        return
      }

      const elapsed = timestamp - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)

      // Easing function for smooth animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3)
      const currentValue = end * easeOutCubic

      setCount(currentValue)

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      }
    },
    [end, duration, delay],
  )

  useEffect(() => {
    if (isVisible) {
      // Reset values
      setCount(0)
      startTimeRef.current = null

      // Start animation
      animationRef.current = requestAnimationFrame(animate)
    } else {
      // Reset when not visible
      setCount(0)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      startTimeRef.current = null
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isVisible, animate])

  const formatNumber = (num: number) => {
    if (isDecimal) {
      return num.toFixed(1)
    }
    return Math.floor(num)?.toLocaleString()
  }

  return (
    <span>
      {formatNumber(count)}
      {suffix}
    </span>
  )
}

export function StatsSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Update visibility based on intersection
          setIsVisible(entry.isIntersecting)
        })
      },
      {
        threshold: 0.3, // Trigger when 30% of the section is visible
        rootMargin: "-50px 0px -50px 0px", // Add some margin for better UX
      },
    )

    const currentSection = sectionRef.current
    if (currentSection) {
      observer.observe(currentSection)
    }

    return () => {
      if (currentSection) {
        observer.unobserve(currentSection)
      }
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="py-6 bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-white relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      {/* Floating Elements */}
      <div className="absolute top-4 left-10 w-12 h-12 bg-white/5 rounded-full animate-float"></div>
      <div className="absolute bottom-4 right-10 w-8 h-8 bg-white/10 rounded-full animate-float delay-1000"></div>
      <div className="absolute top-1/2 right-20 w-6 h-6 bg-white/5 rounded-full animate-float delay-2000"></div>

      <div className="container mx-auto px-4 relative">
        {/* Compact Header */}
        <div className="text-center mb-8">
          <Badge variant="secondary" className="mb-3 bg-white/20 text-white border-white/30">
            Our Achievements
          </Badge>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Numbers That Speak</h2>
          <p className="text-sm text-white/80 max-w-xl mx-auto">
            Our success measured by customer satisfaction and service quality
          </p>
        </div>

        {/* Compact Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center group animate-in slide-in-from-bottom-10 bg-white/5 backdrop-blur-sm rounded-xl p-4 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 border border-white/10"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Icon */}
              <div className="mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 group-hover:bg-white/20 transition-all duration-300 group-hover:scale-110">
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>

              {/* Counter */}
              <div className="text-3xl md:text-4xl font-bold mb-2 group-hover:scale-105 transition-transform duration-300">
                <Counter
                  end={stat.value}
                  isDecimal={stat.isDecimal}
                  suffix={stat.suffix}
                  isVisible={isVisible}
                  duration={1500}
                  delay={index * 200}
                />
              </div>

              {/* Label */}
              <div className="text-lg font-semibold mb-1">{stat.label}</div>

              {/* Description */}
              <div className="text-xs text-white/70 leading-tight">{stat.description}</div>
            </div>
          ))}
        </div>

        {/* Bottom Accent */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center gap-2 text-sm text-white/60">
            <div className="w-8 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
            <span>Trusted by customers worldwide</span>
            <div className="w-8 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
