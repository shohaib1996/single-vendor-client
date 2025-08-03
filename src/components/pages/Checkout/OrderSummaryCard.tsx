"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import { ShoppingBag, CreditCard, Truck, Shield, CheckCircle, Loader2 } from "lucide-react"
import type { ICartItem } from "@/types"

interface OrderSummaryCardProps {
  cartItems: ICartItem[]
  getTotalPrice: () => number
  paymentMethod: "pay_now" | "pay_later"
  isProcessing: boolean
  onSubmit: () => void
}

const OrderSummaryCard = ({
  cartItems,
  getTotalPrice,
  paymentMethod,
  isProcessing,
  onSubmit,
}: OrderSummaryCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price)
  }

  return (
    <>
      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Order Summary
            <Badge variant="secondary" className="ml-auto">
              {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Cart Items */}
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <div className="relative w-12 h-12 flex-shrink-0">
                  <Image
                    src={item.product.images[0] || "/placeholder.svg"}
                    alt={item.product.name}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm line-clamp-1">{item.product.name}</h4>
                  <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">{formatPrice(item.product.price * item.quantity)}</p>
                </div>
              </div>
            ))}
          </div>

          <Separator />

          {/* Total Price */}
          <div className="flex justify-between font-semibold text-xl">
            <span>Total:</span>
            <span className="text-primary">{formatPrice(getTotalPrice())}</span>
          </div>
        </CardContent>
      </Card>

      {/* Place Order Button */}
      <Button onClick={onSubmit} disabled={isProcessing} size="lg" className="w-full h-12">
        {isProcessing ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Processing...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {paymentMethod === "pay_now" ? (
              <>
                <CreditCard className="h-4 w-4" />
                <span>Pay Now - {formatPrice(getTotalPrice())}</span>
              </>
            ) : (
              <>
                <Truck className="h-4 w-4" />
                <span>Place Order - {formatPrice(getTotalPrice())}</span>
              </>
            )}
          </div>
        )}
      </Button>

      {/* Security Features */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="p-2">
          <Shield className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Secure</span>
        </div>
        <div className="p-2">
          <Truck className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Fast Delivery</span>
        </div>
        <div className="p-2">
          <CheckCircle className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Guaranteed</span>
        </div>
      </div>
    </>
  )
}

export default OrderSummaryCard
