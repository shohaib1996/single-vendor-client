export interface IProduct {
  id: string
  name: string
  description: string
  price: number
  stock: number
  images: string[]
  featured?: boolean
  isDiscountActive?: boolean
  discountPercentage?: number
  discountedPrice?: number
  discountValidUntil?: Date | string
  categoryId?: string
  brandId?: string
  createdAt: Date | string
  updatedAt: Date | string
  category?: {
    id: string
    name: string
    slug: string
    icon: string
    description: string
    parentId: string | null
  }
  brand?: {
    id: string
    name: string
  }
  specifications?: any[]
}

