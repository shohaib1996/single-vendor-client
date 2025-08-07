"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Eye, Clock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useGetAllProductsQuery } from "@/redux/api/product/productApi"
import type { IProduct } from "@/types"

export function FeaturedProducts() {
  const { data: products, isLoading } = useGetAllProductsQuery({ featured: true })

  if (isLoading) {
    return (
      <section className="py-6 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 animate-pulse">
              Loading...
            </Badge>
            <div className="h-8 bg-muted animate-pulse rounded-lg w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-muted animate-pulse rounded-lg w-96 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, index) => (
              <Card key={index} className="animate-pulse p-0">
                <CardContent className="p-0">
                  <div className="w-full h-64 bg-muted rounded-t-lg"></div>
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                    <div className="h-6 bg-muted rounded w-1/3"></div>
                    <div className="h-10 bg-muted rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  const featuredProducts = products?.data || []

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price)
  }

  const isDiscountValid = (product: IProduct) => {
    if (!product.isDiscountActive || !product.discountValidUntil) return false
    return new Date(product.discountValidUntil) > new Date()
  }

  const getDisplayPrice = (product: IProduct) => {
    if (product.isDiscountActive && product.discountedPrice && isDiscountValid(product)) {
      return product.discountedPrice
    }
    return product.price
  }

  const getOriginalPrice = (product: IProduct) => {
    if (product.isDiscountActive && product.discountedPrice && isDiscountValid(product)) {
      return product.price
    }
    return null
  }

  return (
    <section className="py-6 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 animate-in slide-in-from-bottom-10 duration-1000">
          <Badge variant="outline" className="mb-4 border-primary/20 text-primary">
            Featured Products
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Trending Products
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our most popular items loved by thousands of customers worldwide
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredProducts.map((product: IProduct, index: number) => (
            <Card
              key={product.id}
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-in slide-in-from-bottom-10 bg-card/50 backdrop-blur-sm border-border dark:border-gray-400 p-0"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-0">
                {/* Product Image */}
                <div className="relative overflow-hidden rounded-t-lg">
                  <Link href={`/products/${product.id}`}>
                    <Image
                      src={product.images[0] || "/placeholder.svg?height=300&width=300"}
                      alt={product.name}
                      width={300}
                      height={300}
                      className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110 cursor-pointer"
                    />
                  </Link>

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.featured && (
                      <Badge className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-xs">
                        Featured
                      </Badge>
                    )}
                    {product.isDiscountActive && isDiscountValid(product) && (
                      <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold">
                        {product.discountPercentage}% OFF
                      </Badge>
                    )}
                    {product.stock <= 5 && product.stock > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        Only {product.stock} left
                      </Badge>
                    )}
                    {product.stock === 0 && (
                      <Badge variant="secondary" className="text-xs">
                        Out of Stock
                      </Badge>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {/* <Button size="icon" variant="secondary" className="h-8 w-8 bg-white/90 hover:bg-white">
                      <Heart className="h-4 w-4" />
                    </Button> */}
                    <Button size="icon" variant="secondary" className="h-8 w-8 bg-white/90 hover:bg-white" asChild>
                      <Link href={`/products/${product.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>

                  {/* Discount Timer */}
                  {product.isDiscountActive && isDiscountValid(product) && (
                    <div className="absolute bottom-3 left-3 bg-black/80 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>Limited Time</span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-3">
                  {/* Brand & Category */}
                  <div className="flex items-center justify-between mb-2">
                    {product.brand && (
                      <Badge variant="outline" className="text-xs">
                        {product.brand.name}
                      </Badge>
                    )}
                    {product.category && <span className="text-xs text-muted-foreground">{product.category.name}</span>}
                  </div>

                  {/* Product Name */}
                  <Link href={`/products/${product.id}`}>
                    <h3 className="font-semibold text-lg mb-3 group-hover:text-primary transition-colors line-clamp-2 cursor-pointer">
                      {product.name}
                    </h3>
                  </Link>

                  {/* Price */}
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-2xl font-bold text-primary">{formatPrice(getDisplayPrice(product))}</span>
                    {getOriginalPrice(product) && (
                      <span className="text-lg text-muted-foreground line-through">
                        {formatPrice(getOriginalPrice(product)!)}
                      </span>
                    )}
                  </div>

                  {/* Stock Status */}
                  <div className="mb-4">
                    {product.stock > 0 ? (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-green-600 dark:text-green-400">In Stock</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-sm text-red-600 dark:text-red-400">Out of Stock</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {featuredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
              <ShoppingCart className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Featured Products</h3>
            <p className="text-muted-foreground mb-6">Check back later for our latest featured items.</p>
            <Button asChild>
              <Link href="/products">Browse All Products</Link>
            </Button>
          </div>
        )}

        {/* View All Button */}
        {featuredProducts.length > 0 && (
          <div className="text-center mt-12 animate-in slide-in-from-bottom-10 duration-1000 delay-1000">
            <Button variant="outline" size="lg" asChild>
              <Link href="/products">View All Products</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
