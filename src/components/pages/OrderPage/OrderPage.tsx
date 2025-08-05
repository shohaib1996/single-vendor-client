"use client"

import { useGetAllOrdersQuery, useDeleteOrderMutation } from "@/redux/api/order/orderApi"
import { useCreateCheckoutSessionMutation } from "@/redux/api/payment/paymentApi"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Home, Package, CreditCard, Truck, CheckCircle, Star, Trash2, Eye, ChevronRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { IOrder, OrderStatus, PaymentStatus } from "@/types/order/order"
import { toast } from "sonner"

const OrderPage = () => {
  const { data: orders, isLoading } = useGetAllOrdersQuery({})
  const [deleteOrder, { isLoading: deleteLoading }] = useDeleteOrderMutation()
  const [createCheckoutSession] = useCreateCheckoutSessionMutation()
  const [activeTab, setActiveTab] = useState("all")
  const [paymentLoadingOrderId, setPaymentLoadingOrderId] = useState<string | null>(null)
  const router = useRouter()

  const orderList: IOrder[] = orders?.data || []

  const getOrderStatusBadge = (status: OrderStatus) => {
    const statusConfig = {
      PENDING: { variant: "secondary" as const, label: "Pending" },
      SHIPPED: { variant: "default" as const, label: "Shipped" },
      DELIVERED: { variant: "default" as const, label: "Delivered" },
      PAID: { variant: "default" as const, label: "Paid" },
      CANCELED: { variant: "destructive" as const, label: "Canceled" },
    }

    const config = statusConfig[status] || statusConfig.PENDING
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getPaymentStatusBadge = (status: PaymentStatus) => {
    const statusConfig = {
      PENDING: { variant: "secondary" as const, label: "Pending", color: "text-yellow-600" },
      COMPLETED: { variant: "default" as const, label: "Completed", color: "text-white" },
      FAILED: { variant: "destructive" as const, label: "Failed", color: "text-red-600" },
      REFUND: { variant: "outline" as const, label: "Refunded", color: "text-blue-600" },
    }

    const config = statusConfig[status] || statusConfig.PENDING
    return (
      <Badge variant={config.variant} className={config.color}>
        {config.label}
      </Badge>
    )
  }

  const filterOrdersByTab = (tab: string) => {
    switch (tab) {
      case "to-pay":
        return orderList.filter((order) => order.payment.status === "PENDING")
      case "to-ship":
        return orderList.filter((order) => order.payment.status === "COMPLETED" && order.status === "PENDING")
      case "to-receive":
        return orderList.filter((order) => order.status === "SHIPPED")
      case "delivered":
        return orderList.filter((order) => order.status === "DELIVERED")
      case "to-review":
        return orderList.filter(
          (order) => (order.status === "DELIVERED" && order.payment.status === "COMPLETED") || order.status === "PAID",
        )
      default:
        return orderList
    }
  }

  const handleDeleteOrder = async (orderId: string) => {
    try {
      await deleteOrder(orderId).unwrap()
      toast.success("Order deleted successfully")
    } catch (error) {
      console.log(error)
      toast.error("Failed to delete order")
    }
  }

  const handlePayNow = async (order: IOrder) => {
    try {
      setPaymentLoadingOrderId(order.id)
      const paymentData = {
        amount: order.total,
        currency: "usd",
        orderId: order.id,
      }

      const response = await createCheckoutSession(paymentData).unwrap()

      if (response?.data?.url) {
        router.push(response?.data?.url)
      } else {
        throw new Error("No checkout URL received")
      }
    } catch (error) {
      console.log(error)
      toast.error("Failed to create payment session")
    } finally {
      setPaymentLoadingOrderId(null)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const shouldShowPayButton = (order: IOrder) => {
    return order.payment.status === "PENDING" && order.status !== "DELIVERED" && order.status !== "CANCELED"
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-2 mb-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Home className="h-4 w-4" />
            <span className="text-sm">Home</span>
          </Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Orders</span>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-6 w-20" />
                </div>
                <div className="flex gap-4">
                  <Skeleton className="h-20 w-20 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const filteredOrders = filterOrdersByTab(activeTab)

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Home className="h-4 w-4" />
          <span className="text-sm">Home</span>
        </Link>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Orders</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">My Orders</h1>
        <p className="text-muted-foreground">Track and manage your orders</p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="overflow-x-auto mb-6">
          <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground min-w-full w-max">
            <TabsTrigger
              value="all"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-2 py-1.5 text-xs font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm min-w-[80px] sm:min-w-[100px]"
            >
              <Package className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span className="text-xs sm:text-sm">All</span>
            </TabsTrigger>
            <TabsTrigger
              value="to-pay"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-2 py-1.5 text-xs font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm min-w-[80px] sm:min-w-[100px]"
            >
              <CreditCard className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span className="text-xs sm:text-sm">To Pay</span>
            </TabsTrigger>
            <TabsTrigger
              value="to-ship"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-2 py-1.5 text-xs font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm min-w-[80px] sm:min-w-[100px]"
            >
              <Package className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span className="text-xs sm:text-sm">To Ship</span>
            </TabsTrigger>
            <TabsTrigger
              value="to-receive"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-2 py-1.5 text-xs font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm min-w-[80px] sm:min-w-[100px]"
            >
              <Truck className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span className="text-xs sm:text-sm">To Receive</span>
            </TabsTrigger>
            <TabsTrigger
              value="delivered"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-2 py-1.5 text-xs font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm min-w-[80px] sm:min-w-[100px]"
            >
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span className="text-xs sm:text-sm">Delivered</span>
            </TabsTrigger>
            <TabsTrigger
              value="to-review"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-2 py-1.5 text-xs font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm min-w-[80px] sm:min-w-[100px]"
            >
              <Star className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span className="text-xs sm:text-sm">To Review</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={activeTab}>
          {filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No orders found</h3>
                <p className="text-muted-foreground text-center">
                  {activeTab === "all"
                    ? "You haven't placed any orders yet."
                    : `No orders in "${activeTab.replace("-", " ")}" status.`}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <Card key={order.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-sm font-medium">Order #{order.id.slice(-8)}</CardTitle>
                        {getOrderStatusBadge(order.status)}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{formatDate(order.createdAt)}</span>
                        {getPaymentStatusBadge(order.payment.status)}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      {order.orderItems.map((item) => (
                        <div key={item.id} className="flex gap-4 p-3 bg-muted/30 rounded-lg">
                          <div className="relative h-16 w-16 md:h-20 md:w-20 flex-shrink-0">
                            <Image
                              src={item.product.images[0] || "/placeholder.svg?height=80&width=80"}
                              alt={item.product.name}
                              fill
                              className="object-cover rounded-lg"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm md:text-base line-clamp-2 mb-1">{item.product.name}</h4>
                            <p className="text-xs md:text-sm text-muted-foreground mb-2 line-clamp-1">
                              {item.product.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-sm">
                                <span className="text-muted-foreground">Qty: {item.quantity}</span>
                                <span className="font-semibold">{formatPrice(item.price)}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                {item.product.isDiscountActive && (
                                  <Badge variant="secondary" className="text-xs">
                                    {item.product.discountPercentage}% OFF
                                  </Badge>
                                )}
                                <Button variant="outline" size="sm" asChild>
                                  <Link href={`/products/${item.product.id}`}>
                                    <Eye className="h-3 w-3 mr-1" />
                                    Details
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4 pt-4 border-t">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm text-muted-foreground">Total Amount</span>
                        <span className="text-lg font-bold">{formatPrice(order.total)}</span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {activeTab === "to-review" && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteOrder(order.id)}
                            disabled={deleteLoading}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        )}

                        {shouldShowPayButton(order) && (
                          <Button
                            size="sm"
                            onClick={() => handlePayNow(order)}
                            disabled={paymentLoadingOrderId === order.id}
                          >
                            <CreditCard className="h-4 w-4 mr-1" />
                            {paymentLoadingOrderId === order.id ? "Processing..." : "Pay Now"}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default OrderPage
