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

export type ISingleProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  isDiscountActive: boolean;
  discountPercentage?: number;
  discountedPrice?: number;
  discountValidUntil?: string;
  categoryId?: string;
  brandId?: string;

  category?: ICategory;
  brand?: IBrand;
  specifications?: IProductSpecification[];
  reviews?: IReview[];
  questions?: IQuestion[];
};

type ICategory = {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  parentId: string | null;
};

export type IBrand = {
  id: string;
  name: string;
};

export type IProductSpecification = {
  id: string;
  productId: string;
  key: string;
  value: string;
  product: {
    name: string,
    price: number
  }
};

export type IReview = {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  userId: string;
  productId: string;
};

export type IQuestion = {
  id: string;
  question: string;
  createdAt: string;
  userId: string;
  productId: string;
  answer: IAnswer | null;
};

export type IAnswer = {
  id: string;
  answer: string;
  createdAt: string;
  questionId: string;
  adminId: string;
};


