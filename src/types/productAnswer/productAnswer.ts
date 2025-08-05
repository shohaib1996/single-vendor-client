export interface IProductAnswer {
  id: string;
  answer: string;
  questionId: string;
  adminId: string;
  createdAt: string; // Assuming string for simplicity, can be Date if parsed
}
