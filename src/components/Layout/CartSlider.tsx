"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { X, Plus, Minus, ShoppingBag, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { useAppSelector } from "@/redux/hooks/hooks"
import { useDeleteCartItemMutation, useGetCartQuery, useUpdateCartItemMutation } from "@/redux/api/cart/cartApi"

interface CartItem {
  id: string
  cartId: string
  productId: string
  quantity: number
  product: {
    id: string
    name: string
    price: number
    brand: {
      id: string
      name: string
    }
    images: string[]
  }
}

interface CartSliderProps {
  isOpen: boolean
  onClose: () => void
}

const CartSlider = ({ isOpen, onClose }: CartSliderProps) => {
  const { user } = useAppSelector((state) => state.auth)
  const { data, isLoading } = useGetCartQuery({})
  const [deleteCart, { isLoading: deleteCartLoading }] = useDeleteCartItemMutation()
  const [updateCartItemQuantity, { isLoading: updateQuantityLoading }] = useUpdateCartItemMutation()

  const cartItems: CartItem[] = data?.data?.items || []

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price)
  }

  const updateQuantity = async (id: string, newQuantity: number) => {
    if (newQuantity < 1) return

    console.log(id, newQuantity, "from cart")

    try {
      await updateCartItemQuantity({ id, data: { quantity: newQuantity } }).unwrap()
      toast.success("Quantity updated")
    } catch (error) {
      toast.error("Failed to update quantity")
    }
  }

  const removeItem = async (id: string) => {
    try {
      await deleteCart(id).unwrap()
      toast.success("Item removed from cart")
    } catch (error) {
      toast.error("Failed to remove item")
    }
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      return total + item.product.price * item.quantity
    }, 0)
  }

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

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
              <ShoppingBag className="h-5 w-5" />
              <h2 className="text-lg font-semibold">Shopping Cart</h2>
              <Badge variant="secondary" className="ml-2">
                {getTotalItems()}
              </Badge>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <p>Loading cart items...</p>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
                <p className="text-muted-foreground mb-4">Add some products to get started!</p>
                <Button onClick={onClose} asChild>
                  <Link href="/products">Continue Shopping</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex gap-3">
                        {/* Product Image */}
                        <div className="relative w-20 h-20 flex-shrink-0">
                          <Image
                            src={item.product.images[0] || "/placeholder.svg"}
                            alt={item.product.name}
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-medium text-sm line-clamp-2">{item.product.name}</h3>
                              <p className="text-xs text-muted-foreground">{item.product.brand.name}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-muted-foreground hover:text-destructive"
                              onClick={() => removeItem(item.id)}
                              disabled={deleteCartLoading}
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

                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center border rounded-md">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1 || updateQuantityLoading}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
                                {item.quantity}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                disabled={updateQuantityLoading}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <span className="text-sm font-semibold">
                              {formatPrice(item.product.price * item.quantity)}
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
          {cartItems.length > 0 && (
            <div className="border-t p-4 space-y-4">
              <Separator />

              {/* Total */}
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-xl font-bold text-primary">{formatPrice(getTotalPrice())}</span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Button className="w-full" size="lg" asChild>
                  <Link href="/checkout" onClick={onClose}>
                    Proceed to Checkout
                  </Link>
                </Button>
                {/* <Button variant="outline" className="w-full bg-transparent" asChild>
                  <Link href="/cart" onClick={onClose}>
                    View Full Cart
                  </Link>
                </Button> */}
              </div>

              {/* Continue Shopping */}
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

export default CartSlider