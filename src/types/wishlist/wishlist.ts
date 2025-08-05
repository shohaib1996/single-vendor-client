export interface IWishlistItem {
  id: string;
  userId: string;
  productId: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
  };
}
