"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Minus } from "lucide-react";
import { useGetAllCategoriesQuery } from "@/redux/api/category/categoryApi";

import { useRouter } from "next/navigation";
import { ICategory } from "@/types";

export function CategoryDropdown({ onClose }: { onClose: () => void }) {
  const { data: categoriesData, isLoading } = useGetAllCategoriesQuery({});
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const router = useRouter();

  const handleCategoryToggle = (categoryId: string) => {
    setOpenCategory(openCategory === categoryId ? null : categoryId);
  };

  const handleBrandClick = (brandName: string) => {
    router.push(`//products?searchTerm=${encodeURIComponent(brandName)}`);
    onClose(); // Close dropdown on click
  };

  if (isLoading) {
    return <div className="p-4 text-center">Loading categories...</div>;
  }

  return (
    <div className="w-full bg-background rounded-xl">
      <nav className="flex flex-col space-y-2 max-h-[83vh] overflow-y-auto">
        {categoriesData?.data.map((category: ICategory) => (
          <div key={category.id} className="border-b last:border-b-0">
            <div className="flex items-center justify-between py-2 px-2">
              <Link
                href={`/products?category=${category.id}`}
                className="flex-1 text-sm font-medium hover:text-primary transition-colors"
                onClick={onClose} // Close dropdown on click
              >
                {category.name}
              </Link>
              {category.children.length > 0 || category.brands.length > 0 ? (
                <button
                  onClick={() => handleCategoryToggle(category.id)}
                  className="p-1 rounded-full hover:bg-muted transition-colors"
                >
                  {openCategory === category.id ? (
                    <Minus className="h-4 w-4" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </button>
              ) : null}
            </div>
            {openCategory === category.id && (
              <div className="pl-6 py-2 space-y-1 bg-muted/30">
                {category.children.length > 0 && (
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold text-muted-foreground">Subcategories:</p>
                    {category.children.map((subCategory) => (
                      <Link
                        key={subCategory.id}
                        href={`/category/${subCategory.slug}~${subCategory.id}`}
                        className="text-sm hover:text-primary transition-colors"
                        onClick={onClose} // Close dropdown on click
                      >
                        {subCategory.name}
                      </Link>
                    ))}
                  </div>
                )}
                {category.brands.length > 0 && (
                  <div className="flex flex-col space-y-1 mt-2">
                    <p className="text-sm font-semibold text-muted-foreground">Brands:</p>
                    {category.brands.slice(0, 10).map((brand) => (
                      <button
                        key={brand.id}
                        onClick={() => handleBrandClick(brand.name)}
                        className="text-sm text-left hover:text-primary transition-colors"
                      >
                        {brand.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}
