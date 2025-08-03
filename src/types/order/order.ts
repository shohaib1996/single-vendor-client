export interface IUser {
  id: string
  name: string
  email: string
  password: string
  role: string
  address: string
  phone: string
  avatarUrl: string
  createdAt: string
}

export interface IProduct {
  id: string
  name: string
  description: string
  price: number
  stock: number
  images: string[]
  featured: boolean
  createdAt: string
  updatedAt: string
  isDiscountActive: boolean
  discountPercentage: number
  discountedPrice: number
  discountValidUntil: string
  categoryId: string
  brandId: string
}

export interface IOrderItem {
  id: string
  orderId: string
  productId: string
  quantity: number
  price: number
  product: IProduct
}

export interface IPayment {
  id: string
  orderId: string
  status: PaymentStatus
  method: string | null
  paidAt: string | null
}

export interface IOrder {
  id: string
  userId: string
  status: OrderStatus
  total: number
  createdAt: string
  user: IUser
  orderItems: IOrderItem[]
  payment: IPayment
}

export type OrderStatus = "PENDING" | "SHIPPED" | "DELIVERED" | "PAID" | "CANCELED"
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUND"
