import { IBrand } from "../brand/brand";



export interface ICategory {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
  parentId: string | null;
  children: ICategory[];
  parent: ICategory | null;
  brands: IBrand[]
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

export interface IFilterOption {
  id: string;
  categoryId: string;
  name: string;
  type: 'DROPDOWN' | 'RANGE' | 'TEXT';
  options: string[] | null;
  unit: string | null;
  category: ICategory;
}

