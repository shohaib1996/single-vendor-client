"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Heart, Star, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { useAppSelector } from "@/redux/hooks/hooks"
import { useDeleteWishlistMutation, useGetWishlistQuery } from "@/redux/api/wishlist/wishlistApi"

// Define interfaces based on provided data structure
interface Product {
  id: string
  name: string
  price: number
  images: string[]
}

interface WishlistItem {
  id: string
  userId: string
  productId: string
  product: Product
}

interface WishlistSliderProps {
  isOpen: boolean
  onClose: () => void
}

const WishlistSlider = ({ isOpen, onClose }: WishlistSliderProps) => {
  const { data: wishlist } = useGetWishlistQuery({})
  const [deleteWishlist, { isLoading: wishlistDeleteLoading }] = useDeleteWishlistMutation()

  const wishlistItems: WishlistItem[] = wishlist?.data || []

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price)
  }

  const removeItem = async (id: string) => {
    try {
      await deleteWishlist(id).unwrap()
      toast.success("Item removed from wishlist")
    } catch (error) {
      console.log(error)
      toast.error("Failed to remove item from wishlist")
    }
  }

  // const renderStars = (rating: number = 0) => {
  //   return Array.from({ length: 5 }, (_, i) => (
  //     <Star key={i} className={cn("h-3 w-3", i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300")} />
  //   ))
  // }

  return (
    <>
      {/* Backdrop */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />}

      {/* Slider */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-full sm:w-96 bg-background border-l shadow-xl z-50 transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 fill-current text-red-500" />
              <h2 className="text-lg font-semibold">Wishlist</h2>
              <Badge variant="secondary" className="ml-2">
                {wishlistItems.length}
              </Badge>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Wishlist Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {wishlistItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Heart className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Your wishlist is empty</h3>
                <p className="text-muted-foreground mb-4">Save items you love for later!</p>
                <Button onClick={onClose} asChild>
                  <Link href="/products">Browse Products</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {wishlistItems.map((item) => (
                  <Card key={item.id} className="overflow-hidden p-0">
                    <CardContent className="p-3">
                      <div className="flex gap-3">
                        {/* Product Image */}
                        <div className="relative w-20 h-20 flex-shrink-0">
                          <Image
                            src={item.product.images[0] || "/placeholder.svg"}
                            alt={item.product.name}
                            fill
                            className="object-contain rounded-md"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <Link href={`/products/${item.productId}`} onClick={onClose}>
                                <h3 className="font-medium text-sm line-clamp-2 hover:text-primary cursor-pointer">
                                  {item.product.name}
                                </h3>
                              </Link>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-muted-foreground hover:text-destructive"
                              onClick={() => removeItem(item.id)}
                              disabled={wishlistDeleteLoading}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>

                          {/* Price */}
                          <div className="flex items-center gap-2 mb-3">
                            <span className="font-semibold text-sm">
                              {formatPrice(item.product.price)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {wishlistItems.length > 0 && (
            <div className="border-t p-4 space-y-3">
              {/* <Button className="w-full bg-transparent" variant="outline" onClick={onClose} asChild>
                <Link href="/wishlist">View Full Wishlist</Link>
              </Button> */}
              <Button variant="ghost" className="w-full text-sm" onClick={onClose} asChild>
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default WishlistSlider