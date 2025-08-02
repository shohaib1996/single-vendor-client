"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, ArrowRight } from "lucide-react"
import Image from "next/image"

const blogPosts = [
  {
    id: 1,
    title: "10 Essential Items Every Home Needs",
    excerpt:
      "Discover the must-have items that can transform your living space into a comfortable and functional home.",
    image: "/placeholder.svg?height=250&width=400",
    author: "Sarah Wilson",
    date: "Dec 15, 2024",
    category: "Home & Living",
    readTime: "5 min read",
  },
  {
    id: 2,
    title: "Sustainable Shopping: A Complete Guide",
    excerpt: "Learn how to make eco-friendly choices while shopping and contribute to a more sustainable future.",
    image: "/placeholder.svg?height=250&width=400",
    author: "Mike Green",
    date: "Dec 12, 2024",
    category: "Sustainability",
    readTime: "7 min read",
  },
  {
    id: 3,
    title: "Tech Trends 2024: What's Worth Buying",
    excerpt: "Stay ahead of the curve with our comprehensive guide to the most innovative tech products of 2024.",
    image: "/placeholder.svg?height=250&width=400",
    author: "Alex Tech",
    date: "Dec 10, 2024",
    category: "Technology",
    readTime: "6 min read",
  },
]

export function BlogSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 animate-in slide-in-from-bottom-10 duration-1000">
          <Badge variant="outline" className="mb-4">
            Latest Blog
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Stories & Insights</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stay updated with the latest trends, tips, and insights from our expert team
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <Card
              key={post.id}
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-in slide-in-from-bottom-10"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <CardContent className="p-0">
                {/* Featured Image */}
                <div className="relative overflow-hidden rounded-t-lg">
                  <Image
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    width={400}
                    height={250}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <Badge className="absolute top-4 left-4 bg-primary">{post.category}</Badge>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Meta Info */}
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{post.date}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{post.readTime}</span>
                    <Button variant="ghost" size="sm" className="group/btn">
                      Read More
                      <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12 animate-in slide-in-from-bottom-10 duration-1000 delay-1000">
          <Button variant="outline" size="lg">
            View All Articles
          </Button>
        </div>
      </div>
    </section>
  )
}
