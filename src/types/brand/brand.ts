export interface IBrand {
  id: string;
  name: string;
  categories: {
    id: string;
    name: string;
    slug: string;
    icon: string;
    description: string;
    parentId: string | null;
  }[];
}
