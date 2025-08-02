


export interface ICategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  parentId: string | null;
  parent: ICategory | null;
  children: ICategory[];
}
