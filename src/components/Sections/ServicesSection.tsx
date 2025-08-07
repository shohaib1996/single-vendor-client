

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Truck, Shield, Headphones, RotateCcw, CreditCard, Gift } from "lucide-react"

const services = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "Free shipping on all orders over $50. Fast and reliable delivery worldwide.",
    color: "text-blue-600 dark:text-blue-400",
  },
  {
    icon: Shield,
    title: "Secure Payment",
    description: "Your payment information is encrypted and secure with our SSL protection.",
    color: "text-green-600 dark:text-green-400",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Our customer support team is available 24/7 to help you with any questions.",
    color: "text-purple-600 dark:text-purple-400",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "Not satisfied? Return your purchase within 30 days for a full refund.",
    color: "text-orange-600 dark:text-orange-400",
  },
  {
    icon: CreditCard,
    title: "Multiple Payment",
    description: "We accept all major credit cards, PayPal, and other secure payment methods.",
    color: "text-red-600 dark:text-red-400",
  },
  {
    icon: Gift,
    title: "Gift Cards",
    description: "Perfect for any occasion. Give the gift of choice with our gift cards.",
    color: "text-pink-600 dark:text-pink-400",
  },
]

export function ServicesSection() {
  return (
    <section className="py-6">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8 animate-in slide-in-from-bottom-10 duration-1000">
          <Badge variant="outline" className="mb-4 text-primary border-primary/20">
              Our Services
            </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose EcoShop?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We provide exceptional services to ensure your shopping experience is smooth and enjoyable
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card
              key={index}
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-in slide-in-from-bottom-10 p-0 dark:border-gray-400"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted group-hover:scale-110 transition-transform duration-300">
                    <service.icon className={`h-8 w-8 ${service.color}`} />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-4 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
