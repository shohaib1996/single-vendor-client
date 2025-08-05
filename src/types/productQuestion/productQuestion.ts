export interface IProductQuestion {
  id: string;
  question: string;
  userId: string;
  productId: string;
  createdAt: string; // Assuming string for simplicity, can be Date if parsed
}
