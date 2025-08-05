export interface ICartItem {
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


export interface ICart {
  id: string;
  userId: string;
  user: {
    name: string;
    email: string;
    phone: string;
  };
  items: ICartItem[];
}