"use client"

import { useState } from "react"
import { useGetCartQuery } from "@/redux/api/cart/cartApi"
import { useAppSelector } from "@/redux/hooks/hooks"
import type { ICartItem } from "@/types"
import { toast } from "sonner"
import CheckoutHeader from "./CheckoutHeader"
import CheckoutLoading from "./CheckoutLoading"
import CheckoutError from "./CheckoutError"
import CheckoutEmpty from "./CheckoutEmpty"
import CheckoutLoginRequired from "./CheckoutLoginRequired"
import UserInfoCard from "./UserInfoCard"
import ShippingForm from "./ShippingForm"
import PaymentMethodCard from "./PaymentMethodCard"
import OrderSummaryCard from "./OrderSummaryCard"
import { useCreateOrderMutation } from "@/redux/api/order/orderApi"
import { useCreateCheckoutSessionMutation } from "@/redux/api/payment/paymentApi"
import { useRouter } from "next/navigation"

const CheckoutPage = () => {
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"pay_now" | "pay_later">("pay_now")
  const { user } = useAppSelector((state) => state.auth)
  const { data, isLoading, error } = useGetCartQuery({})
  const cartItems: ICartItem[] = data?.data?.items || []
  const [createOrderToDb] = useCreateOrderMutation()
  const [createPayment] = useCreateCheckoutSessionMutation()
  const router = useRouter()

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      return total + item.product.price * item.quantity
    }, 0)
  }

  const createOrder = async () => {
    const orderData = {
      userId: user?.id,
      orderItems: cartItems.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price
      })),
    }

    // Simulate API call to create order
    const orderResponse = await createOrderToDb(orderData).unwrap()

    toast.success("Order Created Successfully..")

    return orderResponse
  }

  const initiatePayment = async (orderId: string, amount: number) => {
    const paymentData = {
      amount: amount,
      currency: "usd",
      orderId: orderId,
    }

    console.log("Initiating payment:", paymentData)

    // Simulate payment API call
    const paymentResponse = await createPayment(paymentData).unwrap()

    if(paymentResponse.success){
      router.push(`${paymentResponse.data.url}`)
    }
    

    return paymentResponse
  }

  const handlePlaceOrder = async () => {
    setIsProcessing(true)

    try {
      // Create order first
      const orderResponse = await createOrder()

      if (paymentMethod === "pay_now") {
        // Initiate payment for online payment
        await initiatePayment(orderResponse.data.id, getTotalPrice())
        toast.success("Order created and payment initiated successfully!")
        // Redirect to payment gateway or success page
      } else {
       
        toast.success("Order placed successfully! You can pay upon delivery.")
         router.push('/order-success')
      }

    } catch (error) {
      console.error("Checkout error:", error)
      toast.error("Failed to process order. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  if (isLoading) {
    return <CheckoutLoading />
  }

  if (error) {
    return <CheckoutError />
  }

  if (!user) {
    return <CheckoutLoginRequired />
  }

  if (cartItems.length === 0) {
    return <CheckoutEmpty />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto py-4 sm:py-8 px-4">
        <CheckoutHeader />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Checkout Form */}
          <div className="xl:col-span-2 space-y-6">
            <UserInfoCard user={user} />
            <ShippingForm user={user} />
            <PaymentMethodCard paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} />
          </div>

          {/* Order Summary Sidebar */}
          <div className="xl:col-span-1">
            <div className="sticky top-4 space-y-6">
              <OrderSummaryCard
                cartItems={cartItems}
                getTotalPrice={getTotalPrice}
                paymentMethod={paymentMethod}
                isProcessing={isProcessing}
                onSubmit={handlePlaceOrder}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
