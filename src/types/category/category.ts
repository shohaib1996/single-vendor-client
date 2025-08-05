


export interface ICategory {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
  parentId: string | null;
  children: ICategory[];
  parent: ICategory | null;
}
export interface ISubCategory {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
  parentId: string;
  children: ISubCategory[]; // or [] if you're sure there are no deeper levels
  parent: {
    id: string;
    name: string;
    slug: string;
    icon: string;
    description: string;
    parentId: string | null;
  };
}

